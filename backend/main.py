from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import Response
from sqlalchemy.orm import Session
import uvicorn
import os
from dotenv import load_dotenv

from app.routers import documents, drafts, clauses, workflows, ai, auth, chatbot
from app.database import Base, engine, get_db
from app import models
from app.services.file_storage import file_storage

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
    "ALLOW_ORIGINS",
    "https://generative-ai-for-demystifying-legal-documents-fa9f8k4o8.vercel.app,http://localhost:3000,http://localhost:8000",
)
allow_origins = [o.strip() for o in allow_origins_env.split(",") if o.strip()]

# Add wildcard for development if no specific origins are set
if not allow_origins or allow_origins == [""]:
    allow_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Include routers
app.include_router(documents.router, prefix="/api/documents", tags=["documents"])
app.include_router(drafts.router, prefix="/api/drafts", tags=["drafts"])
app.include_router(clauses.router, prefix="/api/clauses", tags=["clauses"])
app.include_router(workflows.router, prefix="/api/workflows", tags=["workflows"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(chatbot.router, tags=["chatbot"])


# Database-based file serving endpoints
@app.get("/uploads/{file_id}")
async def serve_upload(file_id: str, db: Session = Depends(get_db)):
    """Serve uploaded files from database"""
    file_data = await file_storage.get_file_from_db(file_id)
    if not file_data:
        raise HTTPException(status_code=404, detail="File not found")

    return Response(
        content=file_data["file_content"],
        media_type=file_data["content_type"],
        headers={
            "Content-Disposition": f"attachment; filename={file_data['filename']}"
        },
    )


@app.get("/documents/{file_id}")
async def serve_document(file_id: str, db: Session = Depends(get_db)):
    """Serve document files from database"""
    file_data = await file_storage.get_file_from_db(file_id)
    if not file_data:
        raise HTTPException(status_code=404, detail="File not found")

    return Response(
        content=file_data["file_content"],
        media_type=file_data["content_type"],
        headers={
            "Content-Disposition": f"attachment; filename={file_data['filename']}"
        },
    )


@app.get("/drafts/{filename}")
async def serve_draft(filename: str, db: Session = Depends(get_db)):
    """Serve draft files from database"""
    # Extract file ID from filename (assuming format like "uuid.docx")
    file_id = filename.split(".")[0] if "." in filename else filename

    file_data = await file_storage.get_file_from_db(file_id)
    if not file_data:
        raise HTTPException(status_code=404, detail="File not found")

    return Response(
        content=file_data["file_content"],
        media_type=file_data["content_type"],
        headers={
            "Content-Disposition": f"attachment; filename={file_data['filename']}"
        },
    )


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
