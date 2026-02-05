from fastapi import APIRouter, HTTPException
from ..core.haystack_prod import build_vector_db, initialize_rag_pipeline, vector_db_exists, get_chatbot_response
from ..schemas.chatbot_schema import ChatRequest

router = APIRouter()

# Track pipeline status
pipeline_ready = False

@router.on_event("startup")
async def startup_event():
    global pipeline_ready
    try:
        # Initialize the RAG pipeline (synchronous - not awaited)
        initialize_rag_pipeline()
        pipeline_ready = True
        print("✓ Chatbot router: Pipeline initialized successfully")
    except Exception as e:
        print(f"✗ Chatbot router: Pipeline initialization failed: {e}")
        # Don't crash - let the service start so CORS works
        pipeline_ready = False

@router.get("/status")
async def get_status():
    try:
        db_exists = vector_db_exists()
        return {
            "pipeline_ready": db_exists and pipeline_ready,
            "status": "operational" if db_exists else "initializing"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error checking pipeline status")

@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        if not request.user_message or not isinstance(request.user_message, str):
            raise HTTPException(status_code=400, detail="Invalid user message")
        
        reply = get_chatbot_response(request.user_message, request.chat_history)
        return {"answer": reply}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error generating response")

@router.get("/health")
async def health_check():
    try:
        return {"status": "ok", "pipeline_ready": vector_db_exists()}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Health check failed")



