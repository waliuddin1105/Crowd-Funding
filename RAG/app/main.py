import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes.chatbot import router as chatbot_router

app = FastAPI(title="RAG Service")

# Configure CORS (Railway: set FRONTEND_URL or FRONTEND_URLS)
frontend_urls = os.getenv("FRONTEND_URLS") or os.getenv("FRONTEND_URL") or ""
allowed_origins = [url.strip() for url in frontend_urls.split(",") if url.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chatbot_router, prefix="/api/rag", tags=["RAG Chatbot"])