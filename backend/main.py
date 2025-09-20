from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import os
from dotenv import load_dotenv

from app.routers import documents, drafts, clauses, workflows, ai, auth
from app.database import Base, engine
from app import models

load_dotenv()

# Create necessary directories
os.makedirs("documents", exist_ok=True)
os.makedirs("uploads", exist_ok=True)
os.makedirs("drafts", exist_ok=True)

app = FastAPI(
    title="ClauseCraft API",
    description="AI-Powered Legal Document Platform",
    version="1.0.0",
)

# CORS middleware
# Configure CORS for dev and deployment via env var ALLOW_ORIGINS (comma-separated)
allow_origins_env = os.getenv(
    "ALLOW_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000"
)
allow_origins = [o.strip() for o in allow_origins_env.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(documents.router, prefix="/api/documents", tags=["documents"])
app.include_router(drafts.router, prefix="/api/drafts", tags=["drafts"])
app.include_router(clauses.router, prefix="/api/clauses", tags=["clauses"])
app.include_router(workflows.router, prefix="/api/workflows", tags=["workflows"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])

# Static files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.mount("/documents", StaticFiles(directory="documents"), name="documents")
app.mount("/drafts", StaticFiles(directory="drafts"), name="drafts")


@app.get("/")
async def root():
    return {"message": "ClauseCraft API is running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    # Create DB tables on startup (safe for SQLite; for production DBs, use migrations)
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"Warning: could not initialize database tables: {e}")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
