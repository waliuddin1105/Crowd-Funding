from fastapi import APIRouter
from ..core.haystack_prod import build_vector_db, initialize_rag_pipeline, vector_db_exists, getchatbot_response
from ..schemas.chatbot_schema import ChatRequest

router = APIRouter()

@router.on_event("startup")
async def startup_event():
    if not vector_db_exists():
        print("Vector database not found. Building vector database...")
        try:
            await initialize_rag_pipeline()
            print("Vector database built successfully")
        except Exception as e:
            raise RuntimeError(f"Failed to build vector database: {e}")
    else:
        print("Vector database exists. Skipping build.")

@router.get("/status")
async def get_status():
    return {
        "pipeline_ready": vector_db_exists(),
        "status": "operational" if vector_db_exists() else "initializing"
    }

@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    reply = await getchatbot_response(request.user_message, request.chat_history)
    return {"answer": reply}

@router.get("/health")
async def health_check():
    return {"status": "ok"}



