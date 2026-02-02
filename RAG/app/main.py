from fastapi import FastAPI
from routes.chatbot import router as chatbot_router

app = FastAPI(title="RAG Service")
app.include_router(chatbot_router, prefix="/api/rag", tags=["RAG Chatbot"])