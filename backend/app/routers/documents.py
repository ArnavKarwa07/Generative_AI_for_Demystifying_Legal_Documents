# app/api/documents.py
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends
from typing import List, Dict, Any, Optional
from datetime import datetime
import os
import uuid
from pathlib import Path

# Project services - adjust import paths to match your project structure
from app.services.file_storage import file_storage
from app.services.document_processor import document_processor
from app.services.langgraph_ai_service import LangGraphAIService

# --- Optional DB dependencies / schemas (replace with your actual implementations) ---
# from app.dependencies import get_db, get_current_user
# from sqlalchemy.orm import Session
# from app.models import User, Document
# from app.schemas import DocumentSchema, DocumentUpdate

# TODO: define/replace these according to your project
# def get_db() -> Session: ...
# def get_current_user() -> User: ...

# Example placeholders (remove if you have real implementations)
# from typing import NamedTuple
# class User(NamedTuple):
#     id: int
# class Document(NamedTuple):
#     id: int

# ------------------------------------------------------------------------------

router = APIRouter()
ai_service = LangGraphAIService()

# File upload config
SUPPORTED_FILE_TYPES = {"pdf", "docx", "doc", "txt"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
# Directory to store uploaded files (ensure it exists or create it in startup)
UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", "uploads"))
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


# -----------------------
# File-storage endpoints
# Prefix: /files
# -----------------------
files_router = APIRouter(prefix="/files", tags=["files"])


@files_router.get("/", response_model=List[Dict[str, Any]])
async def get_all_files():
    """
    Return metadata for all stored documents (from file_storage service).
    """
    documents = file_storage.get_all_documents()
    return documents


@files_router.get("/{document_id}")
async def get_file(document_id: str):
    """
    Get a single stored document metadata (from file_storage service).
    """
    document = file_storage.get_document(document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return document


@files_router.post("/upload")
async def upload_file(file: UploadFile = File(...), analyze: bool = Form(True)):
    """
    Upload a file, optionally run AI analysis, and save it to file_storage.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")

    file_extension = file.filename.split(".")[-1].lower()
    if file_extension not in SUPPORTED_FILE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Supported types: {', '.join(SUPPORTED_FILE_TYPES)}",
        )

    file_content = await file.read()
    if len(file_content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size: {MAX_FILE_SIZE // (1024*1024)}MB",
        )

    # Extract text
    try:
        document_text = await document_processor.extract_text(
            file_content, file.filename
        )
    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Error processing document: {str(e)}"
        )

    # Optionally analyze
    analysis = None
    if analyze and document_text:
        try:
            analysis = await ai_service.analyze_document(document_text, file.filename)
        except Exception as e:
            # Non-fatal: continue and save with analysis error
            analysis = {"error": f"Analysis failed: {str(e)}"}

    # Save file to file_storage (assuming save_document is async)
    try:
        doc_id = await file_storage.save_document(
            file_content=file_content,
            filename=file.filename,
            file_type=file_extension,
            analysis=analysis,
            uploaded_at=datetime.utcnow().isoformat(),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving document: {str(e)}")

    return {
        "message": "Document uploaded successfully",
        "document_id": doc_id,
        "filename": file.filename,
        "analyzed": analysis is not None and "error" not in analysis,
        "text_extracted": bool(document_text),
        "analysis": analysis,
    }


@files_router.post("/{document_id}/analyze")
async def analyze_file(document_id: str):
    """
    Analyze an already-uploaded file (reads from storage, extracts text, calls AI).
    """
    document = file_storage.get_document(document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    file_path = document.get("file_path")
    if not file_path or not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Stored file not found")

    try:
        with open(file_path, "rb") as f:
            file_content = f.read()

        if len(file_content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Maximum size: {MAX_FILE_SIZE // (1024*1024)}MB",
            )

        document_text = await document_processor.extract_text(
            file_content, document.get("filename", "")
        )
        analysis = await ai_service.analyze_document(
            document_text, document.get("filename", "")
        )
        await file_storage.update_document_analysis(document_id, analysis)

        return {
            "message": "Document analyzed successfully",
            "document_id": document_id,
            "analysis": analysis,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error analyzing document: {str(e)}"
        )


@files_router.delete("/{document_id}")
async def delete_file(document_id: str):
    """
    Delete a document from storage.
    """
    success = file_storage.delete_document(document_id)
    if not success:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"message": "Document deleted successfully"}


@files_router.get("/{document_id}/suggestions")
async def get_file_suggestions(document_id: str):
    """
    Return suggestions based on stored analysis for a document.
    If analysis is missing, instruct to run analysis first.
    """
    document = file_storage.get_document(document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    analysis = document.get("analysis")
    if not analysis:
        raise HTTPException(
            status_code=400, detail="Document not analyzed yet. Run analysis first."
        )

    # Example static suggestions generator based on analysis structure.
    # Replace with smarter logic if you have it.
    suggestions = [
        {
            "id": "1",
            "type": "improvement",
            "title": "Add Force Majeure Clause",
            "description": "Consider adding a force majeure clause to protect against unforeseen circumstances.",
            "priority": "medium",
        },
        {
            "id": "2",
            "type": "clarification",
            "title": "Define Key Terms",
            "description": "Ensure all important terms are clearly defined in a definitions section.",
            "priority": "high",
        },
        {
            "id": "3",
            "type": "legal",
            "title": "Review Liability Limitations",
            "description": "Consider adding or reviewing liability limitation clauses.",
            "priority": "high",
        },
    ]

    return {
        "document_id": document_id,
        "suggestions": suggestions,
        "analysis_summary": (
            analysis.get("summary", "") if isinstance(analysis, dict) else ""
        ),
        "risk_level": (
            analysis.get("risk_level", "Unknown")
            if isinstance(analysis, dict)
            else "Unknown"
        ),
    }


# -----------------------
# DB-backed CRUD endpoints
# These are kept at root-level ("/") and assume you have DB models & deps.
# Replace the placeholders with your actual DB/session/user code.
# -----------------------
db_router = APIRouter(tags=["documents"])


@db_router.get("/", response_model=List[Dict[str, Any]])
async def get_documents_db(db=Depends(lambda: None)):  # TODO: replace with get_db
    """
    Return all documents from DB. Replace implementation with your ORM query.
    """
    # TODO: implement actual DB query
    # Example: return db.query(Document).all()
    raise HTTPException(
        status_code=501,
        detail="Not implemented - replace get_documents_db with real DB logic",
    )


@db_router.post("/upload")
async def upload_document_db(
    file: UploadFile = File(...),
    title: str = Form(...),
    # current_user: User = Depends(get_current_user),
    # db: Session = Depends(get_db)
):
    """
    Upload and create a DB record (example). Replace get_current_user/get_db usage.
    """
    # TODO: wire current_user, db, and ORM model
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = UPLOAD_DIR / unique_filename

    content = await file.read()
    with open(file_path, "wb") as buffer:
        buffer.write(content)

    # TODO: create DB record using your ORM
    # Example:
    # db_document = Document(title=title, storage_path=str(file_path), owner_id=current_user.id, version_id=str(uuid.uuid4()))
    # db.add(db_document); db.commit(); db.refresh(db_document)
    # return {"document_id": db_document.id, "status": "uploaded", "filename": unique_filename}

    return {
        "document_id": str(uuid.uuid4()),  # temporary placeholder
        "status": "uploaded (placeholder)",
        "filename": unique_filename,
        "storage_path": str(file_path),
    }


@db_router.put("/{document_id}")
async def update_document_db(
    document_id: int,
    # document_update: DocumentUpdate,
    # current_user: User = Depends(get_current_user),
    # db: Session = Depends(get_db)
):
    """
    Update a DB document metadata. Replace the body with your DocumentUpdate schema & ORM operations.
    """
    # TODO: implement update logic
    raise HTTPException(
        status_code=501,
        detail="Not implemented - replace update_document_db with real DB logic",
    )


@db_router.delete("/{document_id}")
async def delete_document_db(
    document_id: int,
    # current_user: User = Depends(get_current_user),
    # db: Session = Depends(get_db)
):
    """
    Delete a DB document and remove its file from disk if present.
    """
    # TODO: query DB, check owner, delete file and DB record
    raise HTTPException(
        status_code=501,
        detail="Not implemented - replace delete_document_db with real DB logic",
    )


@db_router.get("/{document_id}/obligations")
async def get_document_obligations_db(
    document_id: int,
    # current_user: User = Depends(get_current_user),
    # db: Session = Depends(get_db)
):
    """
    Return obligations for a DB document.
    """
    # TODO: replace with actual DB query to fetch obligations list
    raise HTTPException(
        status_code=501,
        detail="Not implemented - replace get_document_obligations_db with real DB logic",
    )


# Register sub-routers on main router
router.include_router(files_router)
router.include_router(db_router)
