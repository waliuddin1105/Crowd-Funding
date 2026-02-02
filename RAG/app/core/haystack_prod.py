import os
from dotenv import load_dotenv
from haystack import Pipeline
from haystack.components.converters import MarkdownToDocument
from haystack.components.preprocessors import DocumentSplitter, DocumentCleaner
from haystack.components.writers import DocumentWriter
from haystack.components.embedders import OpenAIDocumentEmbedder, OpenAITextEmbedder
from haystack_integrations.document_stores.chroma import ChromaDocumentStore
from haystack.components.builders import PromptBuilder
from haystack.components.generators import OpenAIGenerator
from haystack_integrations.components.retrievers.chroma import ChromaEmbeddingRetriever
from haystack.utils import Secret

MODEL = "gpt-4o-mini"
EMBEDDING_MODEL = "text-embedding-3-small"
db_name = "vector_db"

# Load .env for local development (no-op in Docker)
load_dotenv()

# Environment variables are loaded by docker-compose via env_file
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY environment variable is not set")

rag_pipeline = None

document_store = ChromaDocumentStore(
    collection_name="vector_db",
    persist_path="./chroma_db",
)


def build_vector_db():
    """Build and persist the vector database from markdown files."""
    try:
        pipeline = Pipeline()

        pipeline.add_component("converter", MarkdownToDocument())
        pipeline.add_component("cleaner", DocumentCleaner())
        pipeline.add_component(
            "splitter",
            DocumentSplitter(split_by="word", split_length=200, split_overlap=20),
        )

        pipeline.add_component(
            "embedder",
            OpenAIDocumentEmbedder(
                model=EMBEDDING_MODEL,
                api_key=Secret.from_token(OPENAI_API_KEY)
            ),
        )

        pipeline.add_component("writer", DocumentWriter(document_store))

        pipeline.connect("converter", "cleaner")
        pipeline.connect("cleaner", "splitter")
        pipeline.connect("splitter", "embedder")
        pipeline.connect("embedder", "writer")

        import glob
        knowledge_base_path = os.path.join(os.path.dirname(__file__), "../../knowledge_base/**/*.md")
        md_files = glob.glob(knowledge_base_path, recursive=True)

        if not md_files:
            return

        pipeline.run({"converter": {"sources": md_files}})
    except Exception as e:
        raise RuntimeError(f"Failed to build vector database: {e}")


small_talk = {
    "hi": "Hello! How can I help you today?",
    "hello": "Hi there! Welcome to our crowdfunding platform.",
    "hey": "Hey! What can I assist you with?",
    "thanks": "You're welcome!",
    "thank you": "Happy to help!",
    "bye": "Goodbye! Have a great day!",
    "goodbye": "Take care! Feel free to come back anytime.",
}

def vector_db_exists():
    try:
        if not os.path.exists("./chroma_db"):
            return False
        
        count = document_store.count_documents()
        return count > 0
    except Exception as e:
        return False

def create_rag_pipeline():
    try:
        retrieval_pipeline = Pipeline()

        retrieval_pipeline.add_component(
            "query_embedder",
            OpenAITextEmbedder(
                model=EMBEDDING_MODEL,
                api_key=Secret.from_token(OPENAI_API_KEY)
            ),
        )

        retrieval_pipeline.add_component(
            "retriever", ChromaEmbeddingRetriever(document_store=document_store, top_k=3)
        )

        template = """You are an AI assistant for a crowdfunding platform founded by Saad Zaidi, Waliuddin Ahmed, and Sajjad Ahmed - Computer Science students at FAST University.

YOUR ROLE:
You help users understand and navigate our crowdfunding platform where people can donate to verified causes through multiple payment methods including credit/debit cards, PayPal, EasyPaisa, and JazzCash.

INSTRUCTIONS:
- For greetings: Respond warmly and briefly
- For questions: Use the context below AND the conversation history to answer accurately
- Refer back to previous messages when relevant (e.g., "As I mentioned earlier...")
- If uncertain: Say "I don't have that specific information in my knowledge base"
- Be professional, concise, and helpful
- Break down complex processes into clear steps

CONTEXT FROM KNOWLEDGE BASE:
{% for doc in documents %}
{{ doc.content }}
---
{% endfor %}

CHAT HISTORY:
{{ chat_history }}

CURRENT QUESTION: {{ question }}

ANSWER:"""

        retrieval_pipeline.add_component("prompt_builder", PromptBuilder(template=template))

        retrieval_pipeline.add_component(
            "llm", OpenAIGenerator(
                model=MODEL, 
                api_key=Secret.from_token(OPENAI_API_KEY),
                generation_kwargs={"temperature": 0.7}
            )
        )
        retrieval_pipeline.connect("query_embedder.embedding", "retriever.query_embedding")
        retrieval_pipeline.connect("retriever.documents", "prompt_builder.documents")
        retrieval_pipeline.connect("prompt_builder", "llm")

        return retrieval_pipeline
    except Exception as e:
        raise RuntimeError(f"Failed to create RAG pipeline: {e}")

def initialize_rag_pipeline():
    global rag_pipeline
    
    if rag_pipeline is None:
        try:
            if not vector_db_exists():
                try:
                    build_vector_db()
                except Exception as e:
                    raise RuntimeError(f"Failed to build vector database: {e}")
            
            count = document_store.count_documents()
            if count == 0:
                raise RuntimeError("Vector database is empty! Please check your markdown files.")
            
            rag_pipeline = create_rag_pipeline()
        except RuntimeError:
            raise
        except Exception as e:
            raise RuntimeError(f"Unexpected error during RAG pipeline initialization: {e}")
    
    return rag_pipeline

def format_chat_history(chat_history):
    """Format chat history from database"""
    if not chat_history or len(chat_history) == 0:
        return "No previous conversation."
    
    formatted = []
    for msg in chat_history:
        role = "User" if msg.get('role') == 'user' else "Assistant"
        message = msg.get('message', '')
        formatted.append(f"{role}: {message}")
    
    return "\n".join(formatted)

def get_chatbot_response(user_message, chat_history=None):
    """
    Generate a chatbot response using RAG with conversation history.

    Args:
        user_message (str): The user's current message
        chat_history (list): List of dicts with 'role' and 'message' keys from database

    Returns:
        str: The chatbot's response
    """
    try:
        if not user_message or not isinstance(user_message, str):
            return "Please provide a valid message."
        
        if not user_message.strip():
            return "Please provide a valid message."
        
        if user_message.lower().strip() in small_talk:
            return small_talk[user_message.lower().strip()]

        # Check if vector db and rag pipeline exist
        if not vector_db_exists() or rag_pipeline is None:
            initialize_rag_pipeline()
        
        if rag_pipeline is None:
            return "RAG pipeline is not initialized. Please try again later."
        
        chat_history_str = format_chat_history(chat_history)

        result = rag_pipeline.run({
            "query_embedder": {"text": user_message},
            "prompt_builder": {
                "question": user_message,
                "chat_history": chat_history_str
            }
        })

        answer = result["llm"]["replies"][0]

        return answer

    except RuntimeError as e:
        return f"Service error: {str(e)}"
    except KeyError:
        return "Error processing response. Please try again."
    except Exception as e:
        return "I'm sorry, something went wrong while processing your request."