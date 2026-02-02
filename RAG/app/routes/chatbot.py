from fastapi import APIRouter
from pydantic import BaseModel
from ..core.chatbot import build_vector_db, create_rag_pipeline, vector_db_exists, getchatbot_response

router = APIRouter()
