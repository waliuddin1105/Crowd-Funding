import os
from dotenv import load_dotenv
from haystack import Pipeline
from haystack.components.converters import MarkdownToDocument
from haystack.components.preprocessors import DocumentSplitter, DocumentCleaner
from haystack.components.writers import DocumentWriter
from haystack.components.embedders import SentenceTransformersDocumentEmbedder, SentenceTransformersTextEmbedder
from haystack_integrations.document_stores.chroma import ChromaDocumentStore
from haystack.components.builders import PromptBuilder
from haystack.components.generators import OpenAIGenerator
from haystack_integrations.components.retrievers.chroma import ChromaEmbeddingRetriever  # FIXED IMPORT

MODEL = "gpt-4o-mini"
db_name = "vector_db"
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

document_store = ChromaDocumentStore(
    collection_name="vector_db",
    persist_path="./chroma_db",
)


def build_vector_db():
    pipeline = Pipeline()

    pipeline.add_component("converter", MarkdownToDocument())
    pipeline.add_component("cleaner", DocumentCleaner())
    pipeline.add_component(
        "splitter",
        DocumentSplitter(split_by="word", split_length=200, split_overlap=20),
    )

    pipeline.add_component(
        "embedder",
        SentenceTransformersDocumentEmbedder(
            model="sentence-transformers/all-MiniLM-L6-v2"
        ),
    )

    pipeline.add_component("writer", DocumentWriter(document_store))

    pipeline.connect("converter", "cleaner")
    pipeline.connect("cleaner", "splitter")
    pipeline.connect("splitter", "embedder")
    pipeline.connect("embedder", "writer")

    import glob

    md_files = glob.glob("../Crowd-Funding/RAG/knowledge_base/*.md")

    if not md_files:
        print("No markdown files found! Check your path.")
        return

    print(f"Found {len(md_files)} markdown files")
    pipeline.run({"converter": {"sources": md_files}})

    print(f"Total documents in store: {document_store.count_documents()}")


small_talk = {
    "hi": "Hello! How can I help you today?",
    "hello": "Hi there! Welcome to our crowdfunding platform.",
    "hey": "Hey! What can I assist you with?",
    "thanks": "You're welcome!",
    "thank you": "Happy to help!",
    "bye": "Goodbye! Have a great day!",
    "goodbye": "Take care! Feel free to come back anytime.",
}


def create_rag_pipeline():
    retrieval_pipeline = Pipeline()

    retrieval_pipeline.add_component(
        "query_embedder",
        SentenceTransformersTextEmbedder(
            model="sentence-transformers/all-MiniLM-L6-v2"
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

CURRENT QUESTION: {{ question }}

ANSWER:"""

    retrieval_pipeline.add_component("prompt_builder", PromptBuilder(template=template))

    retrieval_pipeline.add_component(
        "llm", OpenAIGenerator(
            model=MODEL, 
            api_key=OPENAI_API_KEY,
            generation_kwargs={"temperature": 0.7}
        )
    )
    retrieval_pipeline.connect("query_embedder.embedding", "retriever.query_embedding")
    retrieval_pipeline.connect("retriever.documents", "prompt_builder.documents")
    retrieval_pipeline.connect("prompt_builder", "llm")

    return retrieval_pipeline


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
        if not user_message or not user_message.strip():
            return "Please provide a valid message."
        
        if user_message.lower().strip() in small_talk:
            return small_talk[user_message.lower().strip()]

        rag_pipeline = create_rag_pipeline()

        result = rag_pipeline.run({
            "query_embedder": {"text": user_message},
            "prompt_builder": {"question": user_message}
        })

        answer = result["llm"]["replies"][0]

        return answer

    except Exception as e:
        print(f"Error generating response: {e}")
        import traceback
        traceback.print_exc()
        return "I'm sorry, something went wrong while processing your request."


if __name__ == "__main__":
    build_vector_db()
    
    print("\n--- Testing Chatbot ---")
    response = get_chatbot_response("What payment methods do you support?")
    print(f"Response: {response}")