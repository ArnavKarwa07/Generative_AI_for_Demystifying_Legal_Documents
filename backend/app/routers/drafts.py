from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.database import get_db
from app.models import User, Document, Clause
from app.schemas import DraftRequest, DraftResponse
from app.routers.auth import get_current_user
from app.services.ai_service import AIService

router = APIRouter()

@router.post("/", response_model=DraftResponse)
async def create_draft(
    draft_request: DraftRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
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
        version_id=str(uuid.uuid4())
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
            risk_score=clause_data.get("risk_score", 0.5)
        )
        db.add(clause)
        clause_records.append(clause)
    
    db.commit()
    
    return DraftResponse(
        draft_id=str(document.id),
        content=draft_content["content"],
        summary=draft_content["summary"],
        clauses=[{
            "id": clause.id,
            "type": clause.clause_type,
            "text": clause.text,
            "risk_score": clause.risk_score
        } for clause in clause_records]
    )

@router.get("/{draft_id}")
async def get_draft(
    draft_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    document = db.query(Document).filter(
        Document.id == draft_id,
        Document.owner_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(status_code=404, detail="Draft not found")
    
    clauses = db.query(Clause).filter(Clause.document_id == document.id).all()
    
    return {
        "document": document,
        "clauses": clauses
    }

@router.put("/{draft_id}")
async def update_draft(
    draft_id: int,
    content: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    document = db.query(Document).filter(
        Document.id == draft_id,
        Document.owner_id == current_user.id
    ).first()
    
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
    db: Session = Depends(get_db)
):
    document = db.query(Document).filter(
        Document.id == draft_id,
        Document.owner_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(status_code=404, detail="Draft not found")
    
    ai_service = AIService()
    simulation_result = await ai_service.simulate_changes(simulation_request)
    
    return simulation_result