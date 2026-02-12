import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from slowapi import _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from .routes.chatbot import router as chatbot_router
from limiter import limiter

# Pydantic models for request/response validation
class HealthResponse(BaseModel):
    status: str
    service: str


# Startup event to verify pipeline
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("=" * 50)
    print("RAG SERVICE STARTING")
    print(f"  OPENAI_API_KEY: {'SET' if os.getenv('OPENAI_API_KEY') else 'MISSING'}")
    print(f"  FRONTEND_URL: {os.getenv('FRONTEND_URL', 'NOT SET')}")
    print(f"  FRONTEND_URLS: {os.getenv('FRONTEND_URLS', 'NOT SET')}")
    print("=" * 50)
    
    # Pre-load the pipeline to catch errors early
    try:
        from .core.haystack_prod import initialize_rag_pipeline
        initialize_rag_pipeline()
        print("✓ RAG Pipeline loaded successfully")
    except Exception as e:
        print(f"✗ RAG Pipeline failed to load: {e}")
        # Don't crash - let the service start anyway
    
    yield
    # Shutdown
    print("RAG SERVICE SHUTTING DOWN")


app = FastAPI(
    title="Crowdfunding RAG API",
    description="RAG-powered chatbot for crowdfunding platform",
    version="1.0.0",
    lifespan=lifespan
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Configure CORS (Railway: set FRONTEND_URL or FRONTEND_URLS)
frontend_urls = os.getenv("FRONTEND_URLS") or os.getenv("FRONTEND_URL") or ""
allowed_origins = [url.strip() for url in frontend_urls.split(",") if url.strip()]

# Default for local development if no env vars set
if not allowed_origins:
    allowed_origins = ["http://localhost:5173", "http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Root endpoint
@app.get("/", response_model=HealthResponse)
async def root():
    return {"status": "ok", "service": "rag-chatbot"}


# Health endpoint for Railway
@app.get("/health", response_model=HealthResponse)
async def health_check():
    return {"status": "healthy", "service": "rag-chatbot"}


app.include_router(chatbot_router, prefix="/api/rag", tags=["RAG Chatbot"])