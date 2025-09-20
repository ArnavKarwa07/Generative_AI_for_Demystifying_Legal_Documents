from fastapi import APIRouter, Depends, HTTPException, Request, Header
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.database import get_db
from app.models import User, Document, Clause
from app.schemas import DraftRequest, DraftResponse
from app.routers.auth import get_current_user
from app.services.ai_service import AIService
from app.services.file_storage import file_storage
from app.config import ENVIRONMENT, SECRET_KEY, ALGORITHM
from jose import jwt, JWTError

router = APIRouter()


@router.post("/", response_model=DraftResponse)
async def create_draft(
    draft_request: DraftRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    ai_service = AIService()

    # Generate draft using AI
    draft_content = await ai_service.generate_draft(draft_request)

    # Create document record
    document = Document(
        title=f"{draft_request.contract_type} - {draft_request.parties.get('partyA', 'Unknown')}",
        parties=draft_request.parties,
        jurisdiction=draft_request.jurisdiction,
        status="draft",
        owner_id=current_user.id,
        version_id=str(uuid.uuid4()),
    )
    db.add(document)
    db.commit()
    db.refresh(document)

    # Extract and save clauses
    clauses = ai_service.extract_clauses(draft_content["content"])
    clause_records = []

    for clause_data in clauses:
        clause = Clause(
            document_id=document.id,
            clause_type=clause_data.get("type"),
            text=clause_data.get("text"),
            variables=clause_data.get("variables"),
            risk_score=clause_data.get("risk_score", 0.5),
        )
        db.add(clause)
        clause_records.append(clause)

    db.commit()

    return DraftResponse(
        draft_id=str(document.id),
        content=draft_content["content"],
        summary=draft_content["summary"],
        clauses=[
            {
                "id": clause.id,
                "type": clause.clause_type,
                "text": clause.text,
                "risk_score": clause.risk_score,
            }
            for clause in clause_records
        ],
    )


@router.get("/{draft_id}")
async def get_draft(
    draft_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    document = (
        db.query(Document)
        .filter(Document.id == draft_id, Document.owner_id == current_user.id)
        .first()
    )

    if not document:
        raise HTTPException(status_code=404, detail="Draft not found")

    clauses = db.query(Clause).filter(Clause.document_id == document.id).all()

    return {"document": document, "clauses": clauses}


@router.put("/{draft_id}")
async def update_draft(
    draft_id: int,
    content: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    document = (
        db.query(Document)
        .filter(Document.id == draft_id, Document.owner_id == current_user.id)
        .first()
    )

    if not document:
        raise HTTPException(status_code=404, detail="Draft not found")

    # Update document content logic here
    # This would typically involve updating the document's storage

    return {"message": "Draft updated successfully"}


@router.post("/{draft_id}/simulate")
async def simulate_draft(
    draft_id: int,
    simulation_request: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    document = (
        db.query(Document)
        .filter(Document.id == draft_id, Document.owner_id == current_user.id)
        .first()
    )

    if not document:
        raise HTTPException(status_code=404, detail="Draft not found")

    ai_service = AIService()
    simulation_result = await ai_service.simulate_changes(simulation_request)

    return simulation_result


@router.post("/export", summary="Export a draft to DOCX and return a public URL")
async def export_draft(
    payload: dict,
    request: Request,
    authorization: str | None = Header(default=None, alias="Authorization"),
    db: Session = Depends(get_db),
):
    """
    Accepts JSON like {"content": "...", "title": "Optional"} and returns a URL to the DOCX.
    """
    content = payload.get("content", "")
    title = payload.get("title")
    if not isinstance(content, str) or len(content.strip()) == 0:
        raise HTTPException(status_code=400, detail="Content is required to export")

    # In production, require a valid JWT; allow anonymous in non-production for demo use
    if ENVIRONMENT.lower() == "production":
        if not authorization or not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Not authenticated")
        token = authorization.split(" ", 1)[1]
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            email = payload.get("sub")
            if not email:
                raise HTTPException(status_code=401, detail="Invalid token")
            # Optionally ensure the user exists
            user = db.query(User).filter(User.email == email).first()
            if not user:
                raise HTTPException(status_code=401, detail="User not found")
        except JWTError:
            raise HTTPException(status_code=401, detail="Invalid token")

    record = await file_storage.save_draft_docx(content=content, title=title)

    # Build absolute URL using request
    base_url = str(request.base_url).rstrip("/")
    public_url = f"{base_url}/drafts/{record['filename']}"

    return {
        "draft_id": record["id"],
        "filename": record["filename"],
        "url": public_url,
    }


@router.get("/{draft_id}/share", summary="Get a shareable link for a saved DOCX draft")
async def get_share_link(
    draft_id: str,
    request: Request,
    authorization: str | None = Header(default=None, alias="Authorization"),
    db: Session = Depends(get_db),
):
    # In production, require auth; allow anonymous in non-production for demo use
    if ENVIRONMENT.lower() == "production":
        if not authorization or not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Not authenticated")
        token = authorization.split(" ", 1)[1]
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            email = payload.get("sub")
            if not email:
                raise HTTPException(status_code=401, detail="Invalid token")
            user = db.query(User).filter(User.email == email).first()
            if not user:
                raise HTTPException(status_code=401, detail="User not found")
        except JWTError:
            raise HTTPException(status_code=401, detail="Invalid token")
    metadata = file_storage._load_metadata().get("drafts", {})
    info = metadata.get(draft_id)
    if not info:
        raise HTTPException(status_code=404, detail="Draft not found")

    base_url = str(request.base_url).rstrip("/")
    filename = info.get("filename") or f"{draft_id}.docx"
    url = f"{base_url}/drafts/{filename}"
    return {"url": url}
