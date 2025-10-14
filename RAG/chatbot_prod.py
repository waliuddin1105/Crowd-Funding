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

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
print("Loading existing vector database...")
vectorstore = Chroma(persist_directory=db_name, embedding_function=embeddings)
print("Vector database loaded successfully!")

llm = ChatOpenAI(model=MODEL, api_key=OPENAI_API_KEY, temperature=0.7)

retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

small_talk = {
    "hi": "Hello! How can I help you today?",
    "hello": "Hi there! Welcome to our crowdfunding platform.",
    "hey": "Hey! What can I assist you with?",
    "thanks": "You're welcome!",
    "thank you": "Happy to help!",
    "bye": "Goodbye! Have a great day!",
    "goodbye": "Take care! Feel free to come back anytime.",
}


def get_chatbot_response(user_message, conversation_history=None):
    try:
        if not user_message or not user_message.strip():
            return {
                "status": "error",
                "message": "Please provide a valid message.",
                "error": "Empty message",
                "conversation_history": conversation_history or [],
            }

        if conversation_history is None:
            conversation_history = []

        if user_message.lower().strip() in small_talk:
            bot_response = small_talk[user_message.lower().strip()]
            updated_history = conversation_history + [
                {"role": "user", "content": user_message},
                {"role": "assistant", "content": bot_response},
            ]
            return {
                "status": "success",
                "message": bot_response,
                "conversation_history": updated_history,
            }

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

        CONTEXT:
        {context}

        CHAT HISTORY:
        {chat_history}

        QUESTION: {question}

        ANSWER:"""

        QA_PROMPT = PromptTemplate(
            template=qa_template,
            input_variables=["context", "chat_history", "question"],
        )

        memory = ConversationBufferMemory(
            memory_key="chat_history", return_messages=True, output_key="answer"
        )

        for msg in conversation_history:
            if msg["role"] == "user":
                memory.chat_memory.add_message(HumanMessage(content=msg["content"]))
            elif msg["role"] == "assistant":
                memory.chat_memory.add_message(AIMessage(content=msg["content"]))

        conversation_chain = ConversationalRetrievalChain.from_llm(
            llm=llm,
            retriever=retriever,
            memory=memory,
            combine_docs_chain_kwargs={"prompt": QA_PROMPT},
            return_source_documents=False,
        )

        result = conversation_chain.invoke({"question": user_message})
        bot_response = result["answer"]

        updated_history = conversation_history + [
            {"role": "user", "content": user_message},
            {"role": "assistant", "content": bot_response},
        ]

        return {
            "status": "success",
            "message": bot_response,
            "conversation_history": updated_history,
        }

    except Exception as e:
        error_msg = f"Error processing request: {str(e)}"
        print(error_msg)
        return {
            "status": "error",
            "message": "I apologize, but I encountered an error processing your request. Please try again or rephrase your question.",
            "error": str(e),
            "conversation_history": conversation_history or [],
        }
