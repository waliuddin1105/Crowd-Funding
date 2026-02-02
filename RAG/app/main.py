from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes.chatbot import router as chatbot_router

app = FastAPI(title="RAG Service")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chatbot_router, prefix="/api/rag", tags=["RAG Chatbot"])