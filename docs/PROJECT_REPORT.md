# Crowd-Funding — Technical Report

**Project:** Crowd-Funding

**Date:** 2025-11-25

---

## Table of Contents

- Title Page
- Executive Summary
- Repository Overview
  - Directory Structure
  - Entry Points and Startup Flow
  - Build / Run Steps
- Architecture & System Design
  - High-level Architecture
  - Component Interactions
  - Data Flow Diagram (ASCII)
  - External Services & Libraries
- Detailed Code Walkthrough
  - Backend: `backend/api/__init__.py`
  - Routes: `backend/api/routes/rag.py`
  - Helpers: `backend/api/helpers/rag_helper.py`
  - Models: `backend/api/models/cf_models.py`
  - RAG: `RAG/chatbot_prod.py`
  - Server entry: `backend/run.py`
  - Testing & Debugging: `backend/testing/*`
  - Frontend: `frontend/` (overview)
- Data, Models & Domain Logic
- APIs / Interfaces
- Frontend Details
- DevOps / Deployment
- Testing
- Security, Performance & Scalability
- Limitations & Future Work
- Appendices
  - Setup Guide
  - Example Commands & Outputs
  - Dependencies

---

## Executive Summary

This repository is a full-stack crowdfunding platform sharing code for both backend (Flask) and frontend (React + Vite + Tailwind). The recent work integrates a Retrieval-Augmented Generation (RAG) conversational assistant (RAG folder) powered by OpenAI embeddings + Chroma + LangChain.

Purpose: Provide a production-ready crowdfunding platform with a helpful AI assistant for users to query platform info, campaign help, payment guidance, and support workflows.

Main features:
- Core crowdfunding: Users, Campaigns, Donations, Comments, Follows, Campaign Updates, Admin Reviews
- REST API using Flask + Flask-RESTX for automatic Swagger documentation
- Database models powered by SQLAlchemy and Alembic migrations (Postgres typical target)
- RAG Chatbot: Pre-built knowledge base (markdown), vector DB (Chroma), LangChain, OpenAI embeddings & LLM
- Lazy-loading for expensive components to avoid repeated startup latency
- Test and diagnostic scripts for chatbot
- Frontend: React + Vite app with pages and components for campaigns, login/register and RAG UI

High-level architecture:
- Client (React) -> Flask REST API -> Postgres DB
- RAG components: local Chroma vectorstore (persist directory `vector_db`), OpenAI embeddings/LLM
- Chat history persisted to DB; conversation memory built for RAG chain on each request

---

## Repository Overview

### Root files
- `README.md` — overview, features and tech stack
- `requirements.txt` — Python dependencies for backend
- `docs/PROJECT_REPORT.md` — this report (generated)

### Important folders
- `backend/` — Flask backend and API
  - `backend/run.py` — server entry point used for local development
  - `backend/api/` — package containing Flask app factory (`__init__.py`), models, helpers, routes
    - `models/` — `cf_models.py` (ORM models), migrations folder present at `backend/migrations/`
    - `helpers/` — DB helpers including `rag_helper.py` used by RAG routes
    - `routes/` — endpoint definitions; includes `rag.py` for Chat endpoints
- `frontend/` — React + Vite frontend app (pages, components, lib)
- `RAG/` — Retrieval-Augmented Generation code and knowledge base
  - `chatbot_prod.py` — main RAG implementation (lazy loading)
  - `knowledge_base/` — markdown docs used to build the vector DB
- `backend/testing/` — test utilities (e.g., `test_chatbot.py`, `create_test_user.py`)
- `backend/debugging/` — debug/diagnostic scripts (e.g., `chatbot_debug.py`)

### Entry points and startup flow
- Backend dev start:
  - `cd backend && python run.py` starts Flask app with `app` from `backend/api/__init__.py`
  - `backend/api/__init__.py` constructs `Flask`, `Api`, `db`, registers namespaces and imports models
  - Routes are loaded from `backend/api/routes/*` (including `rag.py` when the RAG integration is used)
- Frontend dev start: `cd frontend && npm install && npm run dev` (Vite)

### Build / Run steps (developer)
1. Create a Python virtual environment, install requirements:
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```
2. Configure `config.cfg` (DB URI, SECRET_KEY), or set env vars accordingly
3. Run DB migrations (Flask-Migrate) if needed:
```powershell
cd backend
flask db upgrade
```
4. Start backend:
```powershell
cd backend
python run.py
```
5. Start frontend:
```bash
cd frontend
npm install
npm run dev
```

---

## Architecture & System Design

### High-level architecture

ASCII diagram (simplified):

```
+----------------+         +-------------+         +----------------+
|   Frontend     |  <--->  |   Backend   |  <--->  |   Postgres DB  |
| (React + Vite) |         | (Flask API) |         | (SQLAlchemy)   |
+----------------+         +-------------+         +----------------+
                                   |
                                   |  (RAG endpoints use local vector DB & LLM)
                                   v
                          +---------------------------+
                          |  RAG Service (in repo)    |
                          |  - Chroma vectorstore     |
                          |  - LangChain retriever    |
                          |  - OpenAI embeddings/LLM  |
                          +---------------------------+
```

Component interactions:
- Frontend sends REST requests to Flask API
- API endpoints use SQLAlchemy models for persistence
- Chat endpoints call `RAG/chatbot_prod.py` functions; the vector DB is cached in-process (lazy-loaded)
- Chat history is stored in `chat_history` table via helper functions

External services / libraries used:
- OpenAI (embeddings + LLM)
- Chroma (vector DB)
- LangChain
- Flask-RESTX, Flask-SQLAlchemy, Flask-Migrate
- React, Vite, Tailwind on frontend

---

## Detailed Code Walkthrough (key modules)

> Note: Files referenced by path are relative to the repo root.

### `backend/api/__init__.py`
- Purpose: Initialize Flask app, create `Api` instance (Flask-RESTX), configure app, create `db`, `bcrypt`, `migrate`, register namespaces and import routes/models
- Key behavior:
  - Reads `config.cfg` via `ConfigParser` for `SQLALCHEMY_DATABASE_URI` and `SECRET_KEY`.
  - Configures CORS globally before creating the API.
  - Registers namespaces: users, campaigns, donations, comments, payments, updates, follows, campaign updates, admin reviews, creator dashboard.
  - Imports `api.models.cf_models` and route modules (ensures models and tables are bound to metadata before usage).
  - Calls `configure_mappers()` to avoid mapper configuration issues.
- Startup flow:
  - `run.py` imports `app` from this package; calling `app.run()` triggers Flask server and the registered namespaces become active.

Notes / gotchas:
- The file sets a global `authorizations` dict to include a `bearer` scheme for API docs; actual auth enforcement is the developer's responsibility per-route.
- `rag` namespace is intentionally commented out as RAG lives in a separate module under `RAG/` and is registered via `backend/run.py` (or `api_instance` alias pattern used previously).

---

### `backend/api/routes/rag.py` (Chat endpoints)
- Purpose: Provide chatbot API endpoints using Flask-RESTX: `/chat` (POST), `/chat/warmup` (GET), `/chat/history/<user_id>` (GET/DELETE).
- Key functions:
  - `ChatResource.post()`:
    - Validates request JSON (`user_id`, `message`).
    - Calls `rag_helper.add_message` to persist the user message.
    - Retrieves recent chat history with `rag_helper.get_chat_history`.
    - Calls `RAG.chatbot_prod.get_chatbot_response(...)` with user message and chat history.
    - Persists assistant response to `chat_history`.
    - Returns JSON: `{"status":"success","reply": <reply>}`.
  - `WarmupResource.get()`:
    - Calls `chatbot_prod.get_vectorstore()` to force lazy-loading the vector DB.
    - Useful if you want to pre-warm the vector DB so first user request is fast; otherwise lazy loading will occur on demand.
  - `ChatHistoryResource.get/delete()`:
    - Get: returns timestamped history by calling `rag_helper.get_chat_history_with_timestamps`.
    - Delete: clears a user’s history via `rag_helper.delete_chat_history`.
- Implementation notes:
  - The module manipulates `sys.path` to ensure the top-level `RAG` package can be imported reliably when backend runs from `backend/`.

---

### `backend/api/helpers/rag_helper.py`
- Purpose: Database helper functions for storing, retrieving, and deleting chat history.
- Functions:
  - `add_message(user_id, role, message)` — creates a `ChatHistory` record (role = "User" or "Assistant").
  - `get_chat_history(user_id, limit=10)` — returns list of dicts: `[{"role": msg.role, "message": msg.message}, ...]` ordered ascending by timestamp.
  - `get_chat_history_with_timestamps(user_id, limit=None)` — returns same but includes `timestamp` string in `YYYY-MM-DD HH:MM:SS` format.
  - `delete_chat_history(user_id)` — deletes all chat messages for the user and commits.
  - `get_recent_context(user_id, limit=5)` — returns a joined string of the last `limit` messages reversed in chronological order (suitable for feeding to RAG as context).
- Notes: helper functions import `ChatHistory` lazily to avoid circular import issues at module import time.

---

### `RAG/chatbot_prod.py` (RAG logic)
- Purpose: Provide a production-ready RAG chatbot using local Chroma vectorstore + LangChain + OpenAI embeddings/LLM.
- Key design choices:
  - **Lazy-loading**: `_embeddings`, `_vectorstore`, `_llm`, `_retriever` are module-level variables initialized to `None`. `get_vectorstore()` only builds the Chroma instance when first called.
  - **Safety checks**: `OPENAI_API_KEY` must be present in `.env` or environment.
- Key functions:
  - `get_embeddings()` — returns (and caches) an `OpenAIEmbeddings` instance.
  - `get_vectorstore()` — creates a `Chroma` persistent store at `persist_directory=db_name` and caches it.
  - `get_llm()` — returns cached `ChatOpenAI` LLM.
  - `get_retriever()` — returns a retriever built from vectorstore with `k=3` by default.
  - `get_chatbot_response(user_message, chat_history=None)` — builds a LangChain `ConversationalRetrievalChain` with:
    - `memory`: `ConversationBufferMemory`, seeded with `chat_history` if provided (user and assistant messages)
    - `prompt`: custom `QA_PROMPT` that includes platform context and instructions
    - `retriever` and `llm` from lazy-loaded components
    - Invokes the chain and returns the answer string
- Performance / scaling notes:
  - Because Chroma is persisted to `vector_db` and cached per-process, all users share the in-memory vectorstore after first load. This is efficient but means multiple server processes (e.g., multiple Gunicorn workers) each load their own Chroma instance.
  - Warmup endpoint triggers pre-load in a background thread or manually via `/chat/warmup`.

---

### `backend/api/models/cf_models.py` (Data models)
- Purpose: All core data models / ORM mapping for the application.
- Tables & models:
  - `Users` — user profile with fields: `user_id`, `username`, `email`, `password_hash`, `role` (enum), `profile_image`, timestamps. Contains `liked_comments` relationship.
  - `Campaigns` — campaign details: `campaign_id`, `creator_id`, `title`, `description`, `category` (enum), `goal_amount`, `raised_amount`, `start_date`, `end_date`, `image`, `status`, timestamps. Contains relationships for comments, donations, follows, updates, reviews.
  - `Comments` — user comments with `likes` counter and `liked_by_users` relationship (many-to-many via `user_comment_likes`).
  - `Donations` — donation record linked to user and campaign.
  - `Payments` — payment metadata for donations.
  - `Follows` — users following campaigns.
  - `CampaignUpdates` — updates posted by campaign creators.
  - `AdminReviews` — admin review records for campaigns.
  - `ChatHistory` — chat messages used by RAG integration: `chat_id`, `user_id`, `role`, `message`, `timestamp`.

- Enums used:
  - `DonationStatus`, `UserRole`, `CampaignStatus`, `CampaignCategory`, `CampaignPaymentStatus`.

- Notes:
  - Models include `to_dict()` helper methods for JSON serialization; date/time fields are often ISO-encoded using `.isoformat()` in these helpers.
  - The file includes a `user_comment_likes` association table for comment likes.

---

### `backend/run.py`
- Purpose: Minimal developer entrypoint that imports `app` from `backend/api` and runs Flask dev server. In a full deployment, use a WSGI server instead of Flask's dev server.

---

### `backend/testing` & `backend/debugging`
- `test_chatbot.py` — interactive and automated test harness for chatbot endpoints; sends messages to `/chat`, checks history and deletion, prints colored terminal output.
- `create_test_user.py` — helper to create a test user (`chatbot_tester`) in the DB for quick testing.
- `chatbot_debug.py` — a diagnostic tool which attempts connection to the server and hits several endpoints.

---

### Frontend (high-level)
- Built with React + Vite + Tailwind and contains components/pages for campaigns, login/register, and a RAG chat UI.
- Entry point: `frontend/src/main.jsx` (mounts `App.jsx` into DOM); `App.jsx` contains routes for `Home`, `AllCampaigns`, `CampaignDetails`, `Login`, `Register`.
- `frontend/src/lib/` contains utility wrappers for API calls.

Note: Frontend details are described at a high level here — read the `frontend/src` folder for exact component implementations.

---

## Data, Models & Domain Logic

### Data formats
- API returns JSON by default. Example chat response:
```json
{ "status": "success", "reply": "<assistant-answer>" }
```
- Chat history shape returned by `/chat/history/<user_id>`:
```json
{ "status": "success", "history": [{"role": "User|Assistant", "message": "...", "timestamp": "YYYY-MM-DD HH:MM:SS"}, ...] }
```

### Database schema highlights
- `chat_history` table: stores conversation lines per user persisted as `message` and `role` so RAG chain can rebuild memory.
- Campaigns include `start_date`/`end_date` to compute active/completed states.

### How components use data
- `rag_helper.get_recent_context()` builds a small textual context by concatenating recent chat messages for inclusion in prompt if desired.
- `RAG/chatbot_prod.py` retrieves contextual documents using the LangChain retriever and combines with conversation memory to produce an answer.

---

## APIs / Interfaces

### Chat API
- POST `/chat` — body: `{ "user_id": <int>, "message": "<text>" }`
  - Response: `{ "status": "success", "reply": "<assistant text>" }`
  - Persists user message and assistant reply in `chat_history`.

- GET `/chat/warmup` — triggers `chatbot_prod.get_vectorstore()` to pre-load Chroma and embeddings.
  - Response: `{ "status": "success", "message": "Chatbot warmed up successfully" }` or error JSON.

- GET `/chat/history/<user_id>?limit=<n>` — returns last `<n>` messages with timestamps.
- DELETE `/chat/history/<user_id>` — removes chat history for the given user.

### Other APIs
- Standard endpoints for users, campaigns, donations, comments, payments etc. follow REST conventions and are registered via Flask-RESTX namespaces (see `backend/api/*Routes` files).

### Authentication
- Swagger `authorizations` indicates a bearer token header can be used; actual authentication and authorization must be enforced in route implementations (not all routes show auth enforcement in code read but pattern is present).

---

## Frontend (concise)
- Structure: `src/components`, `src/pages`, `src/lib` containing API logic.
- Routing: `App.jsx` defines public routes and protected routes for creators/donors (JWT-based flows expected).
- Chat UI: a chat component posts to `/chat` and displays messages and chat history.

---

## DevOps / Deployment

### Local development
- Python virtualenv, `pip install -r requirements.txt`, set `config.cfg` or env variables, `python backend/run.py`.
- Vite front-end: `npm install && npm run dev`.

### Production deployment recommendations
- Use a WSGI server (Gunicorn or uWSGI) behind a reverse proxy (NGINX).
- Run multiple worker processes; note that RAG vectorstore is loaded per process (memory + disk persistence). Consider using a Chroma server or hosted vector DB for multi-instance scaling.
- Containerization: Dockerfile not present — recommended to add a `Dockerfile` for backend and frontend containers and Kubernetes manifests for orchestration.

---

## Testing
- `backend/testing/test_chatbot.py` — run to validate chatbot endpoints and basic flows.
- `create_test_user.py` — create a test user (username: `chatbot_tester`, password `test123`) for manual testing.
- `chatbot_debug.py` — connectivity and endpoint diagnostic tool.

Run example:
```powershell
cd backend
python testing/create_test_user.py
python testing/test_chatbot.py
```

---

## Security, Performance & Scalability

### Security risks & recommendations
- Ensure `config.cfg` or `.env` is never committed with secrets.
- Use HTTPS and secure cookies; enable proper CORS origins (current dev config uses `*` — restrict in production).
- Implement per-route authorization checks (Flask-RESTX `authorizations` only documents the scheme).
- Sanitize content going into vector DB and avoid storing PII in embeddings or vector store persist directory.

### Performance and bottlenecks
- Vector DB load is expensive; currently lazy-loaded per process. Use warmup or central hosted vector DB to avoid per-process load.
- For scaled deployment, consider a separate vector DB service and shared LLM endpoints.
- Database: use connection pooling and proper indexes (on `chat_history.user_id`, `campaigns.creator_id`, etc.).

### Scalability improvements
- Deploy Chroma as a service or move to a hosted vector DB.
- Move LLM to managed inference endpoints (API-based) to centralize compute.
- Add rate-limiting on chat API to avoid abuse.

---

## Limitations & Future Work
- No production-ready WSGI / container configuration included; add `Dockerfile` and CI/CD pipeline.
- RAG vectorstore is local; multi-process deployments can cause duplicate resource usage.
- Auth flows (JWT management) need full route-level enforcement and refresh tokens.
- Add unit & integration tests for core API endpoints and migrations.
- Improve monitoring and observability for chat latency and vector DB metrics.

---

## Appendices

### Setup Guide (quick)
1. Create Python venv, activate, install requirements
2. Edit `backend/config.cfg` with DB URI (or use env variables)
3. Run DB migrations (`flask db upgrade`) or let `db.create_all()` run in dev
4. Start backend: `python backend/run.py`
5. Start frontend: `cd frontend && npm run dev`
6. Optional: pre-warm chatbot by calling `GET /chat/warmup`

### Example curl
- Send chat message
```bash
curl -X POST http://localhost:5000/chat -H "Content-Type: application/json" -d '{"user_id":1,"message":"How to create a campaign?"}'
```

- Get history
```bash
curl http://localhost:5000/chat/history/1
```

### Dependencies (from `requirements.txt`)
- Flask==3.1.2
- flask-restx==1.3.2
- Flask-SQLAlchemy==3.1.1
- Flask-Bcrypt==1.0.1
- Flask-Migrate==4.0.5
- Flask-CORS==4.0.0
- psycopg2-binary==2.9.9
- PyJWT==2.8.0
- python-dotenv>=1.0.0
- Additional RAG dependencies: `langchain`, `langchain-chroma`, `langchain-openai`, `chromadb`, `openai` (not listed in requirements.txt but required by `RAG/chatbot_prod.py`)

---

## Closing notes
This report documents the repository as present at commit `7d3be1a`. If you want a converted PDF or DOCX, I can produce a ready-to-convert Markdown (this file) or attempt to generate a PDF; provide confirmation which output you prefer and whether you want the report committed into the repository (I can create the file under `docs/` and commit it).

---

*End of report.*
