from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Workflow, User, Document
from app.routers.auth import get_current_user

router = APIRouter(prefix = "/api")

@router.get("/", response_model=List[dict])
async def get_workflows(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    workflows = db.query(Workflow).filter(
        Workflow.created_by_id == current_user.id
    ).offset(skip).limit(limit).all()
    return workflows

@router.get("/{workflow_id}")
async def get_workflow(
    workflow_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    workflow = db.query(Workflow).filter(
        Workflow.id == workflow_id,
        Workflow.created_by_id == current_user.id
    ).first()
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return workflow

@router.post("/{document_id}/workflow/start")
async def start_workflow(
    document_id: int,
    workflow_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify document ownership
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.owner_id == current_user.id
    ).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Create workflow
    workflow = Workflow(
        document_id=document_id,
        steps=workflow_data.get("steps", []),
        triggers=workflow_data.get("triggers", {}),
        created_by_id=current_user.id
    )
    db.add(workflow)
    db.commit()
    db.refresh(workflow)
    
    return {"workflow_id": workflow.id, "status": "started"}

@router.put("/{workflow_id}/approve")
async def approve_workflow_step(
    workflow_id: int,
    approval_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    workflow = db.query(Workflow).filter(Workflow.id == workflow_id).first()
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    # Update workflow status
    workflow.status = "approved"
    db.commit()
    
    return {"message": "Workflow step approved", "status": workflow.status}

@router.put("/{workflow_id}/reject")
async def reject_workflow_step(
    workflow_id: int,
    rejection_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    workflow = db.query(Workflow).filter(Workflow.id == workflow_id).first()
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    # Update workflow status
    workflow.status = "rejected"
    db.commit()
    
    return {"message": "Workflow step rejected", "status": workflow.status}