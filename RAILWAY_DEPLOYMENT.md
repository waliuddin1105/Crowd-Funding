# Railway Deployment Guide

This guide covers deploying the Crowdfunding platform on Railway with three separate services: Backend, RAG, and Frontend.

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Frontend     │────▶│     Backend     │────▶│  PostgreSQL     │
│  (React/Vite)   │     │    (Flask)      │     │   (Railway)     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │
        ▼
┌─────────────────┐
│   RAG Service   │
│   (FastAPI)     │
└─────────────────┘
```

## Prerequisites

1. A Railway account (https://railway.app)
2. An OpenAI API key
3. Git repository with your code

## Step 1: Create Railway Project

1. Go to Railway dashboard and create a new project
2. Connect your GitHub repository

## Step 2: Deploy PostgreSQL Database

1. In your Railway project, click "New" → "Database" → "PostgreSQL"
2. Railway will provision a PostgreSQL database
3. Note: Railway automatically sets `DATABASE_URL` for linked services

## Step 3: Deploy Backend Service

### Create Service
1. Click "New" → "GitHub Repo" → Select your repository
2. Set the **Root Directory** to: `backend`
3. Railway will auto-detect the Dockerfile

### Environment Variables
Set these in the Backend service settings:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | (Link to Railway PostgreSQL - done automatically) |
| `SECRET_KEY` | Generate a random string (32+ chars) |
| `JWT_SECRET_KEY` | Generate another random string |
| `EMAIL_SENDER_ADDRESS` | (Optional) Your Gmail address |
| `EMAIL_SENDER_PASSWORD` | (Optional) Gmail app password |
| `STRIPE_SECRET_KEY` | (Optional) Your Stripe secret key |

### Health Check
- The backend exposes `/health` endpoint
- Railway will auto-detect it

## Step 4: Deploy RAG Service

### Create Service
1. Click "New" → "GitHub Repo" → Select your repository  
2. Set the **Root Directory** to: `RAG`
3. Railway will auto-detect the Dockerfile

### Environment Variables
Set these in the RAG service settings:

| Variable | Value |
|----------|-------|
| `OPENAI_API_KEY` | Your OpenAI API key |
| `FRONTEND_URL` | `https://your-frontend.railway.app` |
| `FRONTEND_URLS` | Comma-separated list if multiple origins |

### Health Check
- The RAG service exposes `/health` endpoint

## Step 5: Deploy Frontend Service

### Create Service
1. Click "New" → "GitHub Repo" → Select your repository
2. Set the **Root Directory** to: `frontend`
3. Railway will auto-detect the Dockerfile

### Build Arguments (Critical!)
The frontend uses Vite, which bakes environment variables at **build time**. Set these as **Build Arguments**, not runtime environment variables:

In Railway service settings → "Variables" → Add as **Build arguments**:

| Variable | Value |
|----------|-------|
| `VITE_BACKEND_URL` | `https://your-backend.railway.app` |
| `VITE_RAG_URL` | `https://your-rag.railway.app/api/rag` |
| `VITE_CLOUDINARY_CLOUD_NAME` | (Optional) Your Cloudinary cloud name |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | (Optional) Your upload preset |

**Important**: These must be set BEFORE the build runs. If you add them after deployment, you need to trigger a rebuild.

## Step 6: Configure Networking

### Public Domains
1. For each service, go to Settings → Networking
2. Click "Generate Domain" to get a public URL
3. Update CORS settings with these URLs

### Update Environment Variables
After all services are deployed, update cross-references:

1. **RAG Service**: Set `FRONTEND_URL` to the frontend's public domain
2. **Frontend**: Rebuild with correct `VITE_BACKEND_URL` and `VITE_RAG_URL`

## Verification

### Check Backend Health
```bash
curl https://your-backend.railway.app/health
```
Expected: `{"status": "healthy", "database": "connected"}`

### Check RAG Health
```bash
curl https://your-rag.railway.app/health
```
Expected: `{"status": "healthy", "service": "rag-chatbot"}`

### Check Frontend
Open `https://your-frontend.railway.app` in a browser.

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is set (Railway links it automatically)
- Check logs for "DATABASE_URL: SET" message
- Ensure the database is in the same Railway project

### CORS Errors
- Add frontend domain to RAG service's `FRONTEND_URL` or `FRONTEND_URLS`
- Include both `http` and `https` versions if needed

### Frontend API Calls Failing
- VITE variables are baked at build time
- Check browser DevTools → Network to see actual URLs being called
- Rebuild frontend after changing `VITE_*` variables

### Migrations Not Running
- Check backend logs for Flask-Migrate output
- Ensure `Flask-Migrate` is in requirements.txt
- The CMD runs `flask db upgrade` before starting gunicorn

### RAG Service Errors
- Verify `OPENAI_API_KEY` is set correctly
- Check logs for "OPENAI_API_KEY: SET" message
- Ensure the key has sufficient credits

## Environment Variables Summary

### Backend
```
DATABASE_URL=postgresql://... (auto-linked)
SECRET_KEY=<random-string>
JWT_SECRET_KEY=<random-string>
EMAIL_SENDER_ADDRESS=<optional>
EMAIL_SENDER_PASSWORD=<optional>
STRIPE_SECRET_KEY=<optional>
```

### RAG
```
OPENAI_API_KEY=sk-...
FRONTEND_URL=https://your-frontend.railway.app
FRONTEND_URLS=https://your-frontend.railway.app,http://localhost:5173
```

### Frontend (Build Arguments)
```
VITE_BACKEND_URL=https://your-backend.railway.app
VITE_RAG_URL=https://your-rag.railway.app/api/rag
VITE_CLOUDINARY_CLOUD_NAME=<optional>
VITE_CLOUDINARY_UPLOAD_PRESET=<optional>
```

## Cost Optimization Tips

1. Use Railway's sleep feature for development environments
2. The services use minimal worker counts (2 workers each)
3. Connection pooling is enabled to reduce database connections
4. Consider Railway's hobby plan for personal projects

## Security Notes

1. Never commit `.env` files or `config.cfg` to Git
2. Use strong, unique values for `SECRET_KEY` and `JWT_SECRET_KEY`
3. All services run as non-root users in containers
4. CORS is configured to only allow specific origins
