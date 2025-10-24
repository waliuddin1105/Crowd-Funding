import os
from dotenv import load_dotenv

from langchain_chroma import Chroma
from langchain.chains import ConversationalRetrievalChain
from langchain.prompts import PromptTemplate
from langchain.memory import ConversationBufferMemory
from langchain.schema import HumanMessage, AIMessage
from langchain_openai import OpenAIEmbeddings, ChatOpenAI

load_dotenv(override=True)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise ValueError(
        "OPENAI_API_KEY not found in environment. Please set it in your .env file."
    )

MODEL = "gpt-4o-mini"
db_name = "vector_db"

# Global variables for lazy loading
_embeddings = None
_vectorstore = None
_llm = None
_retriever = None


def get_embeddings():
    """Lazy load embeddings"""
    global _embeddings
    if _embeddings is None:
        _embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
    return _embeddings


def get_vectorstore():
    """Lazy load vector database"""
    global _vectorstore
    if _vectorstore is None:
        print("Loading vector database...")
        try:
            _vectorstore = Chroma(
                persist_directory=db_name, 
                embedding_function=get_embeddings()
            )
            print("Vector database loaded successfully!")
        except Exception as e:
            print(f"Error loading vector database: {e}")
            raise
    return _vectorstore


def get_llm():
    """Lazy load LLM"""
    global _llm
    if _llm is None:
        _llm = ChatOpenAI(model=MODEL, api_key=OPENAI_API_KEY, temperature=0.7)
    return _llm


def get_retriever():
    """Lazy load retriever"""
    global _retriever
    if _retriever is None:
        _retriever = get_vectorstore().as_retriever(search_kwargs={"k": 3})
    return _retriever

small_talk = {
    "hi": "Hello! How can I help you today?",
    "hello": "Hi there! Welcome to our crowdfunding platform.",
    "hey": "Hey! What can I assist you with?",
    "thanks": "You're welcome!",
    "thank you": "Happy to help!",
    "bye": "Goodbye! Have a great day!",
    "goodbye": "Take care! Feel free to come back anytime.",
}


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

        # Handle small talk directly (no need for RAG)
        if user_message.lower().strip() in small_talk:
            return small_talk[user_message.lower().strip()]

        # Build conversation history for LangChain memory
        memory = ConversationBufferMemory(
            memory_key="chat_history", 
            return_messages=True, 
            output_key="answer"
        )
        
        if chat_history:
            for msg in chat_history:
                if msg["role"].lower() == "user":
                    memory.chat_memory.add_message(HumanMessage(content=msg["message"]))
                elif msg["role"].lower() == "assistant":
                    memory.chat_memory.add_message(AIMessage(content=msg["message"]))

        # Define the QA template
        qa_template = """You are an AI assistant for a crowdfunding platform founded by Saad Zaidi, Waliuddin Ahmed, and Sajjad Ahmed - Computer Science students at FAST University.

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
{context}

CHAT HISTORY:
{chat_history}

CURRENT QUESTION: {question}

ANSWER:"""

        QA_PROMPT = PromptTemplate(
            template=qa_template,
            input_variables=["context", "chat_history", "question"],
        )

        # Get components with lazy loading
        llm = get_llm()
        retriever = get_retriever()

        # Create the conversational retrieval chain
        conversation_chain = ConversationalRetrievalChain.from_llm(
            llm=llm,
            retriever=retriever,
            memory=memory,
            combine_docs_chain_kwargs={"prompt": QA_PROMPT},
            return_source_documents=False,
            verbose=False
        )

        # Get response from the chain
        result = conversation_chain.invoke({"question": user_message})
        return result["answer"]

    except Exception as e:
        print(f"Error in get_chatbot_response: {str(e)}")
        import traceback
        traceback.print_exc()
        return "I apologize, but I encountered an error processing your request. Please try again or rephrase your question."