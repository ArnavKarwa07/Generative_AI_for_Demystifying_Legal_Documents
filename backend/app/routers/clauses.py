from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models import Clause, User
from app.schemas import Clause as ClauseSchema, ClauseCreate, ClauseUpdate
from app.routers.auth import get_current_user

router = APIRouter(prefix="/api")

@router.get("/", response_model=List[ClauseSchema])
async def get_clauses(
    skip: int = 0,
    limit: int = 100,
    clause_type: Optional[str] = None,
    tags: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Clause)
    
    if clause_type:
        query = query.filter(Clause.clause_type == clause_type)
    
    if tags:
        # Simple tag filtering - in production, you'd want more sophisticated JSON querying
        query = query.filter(Clause.tags.contains([tags]))
    
    clauses = query.offset(skip).limit(limit).all()
    return clauses

@router.get("/{clause_id}", response_model=ClauseSchema)
async def get_clause(
    clause_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    clause = db.query(Clause).filter(Clause.id == clause_id).first()
    if not clause:
        raise HTTPException(status_code=404, detail="Clause not found")
    return clause

@router.post("/", response_model=ClauseSchema)
async def create_clause(
    clause: ClauseCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_clause = Clause(**clause.dict())
    db.add(db_clause)
    db.commit()
    db.refresh(db_clause)
    return db_clause

@router.put("/{clause_id}", response_model=ClauseSchema)
async def update_clause(
    clause_id: int,
    clause_update: ClauseUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    clause = db.query(Clause).filter(Clause.id == clause_id).first()
    if not clause:
        raise HTTPException(status_code=404, detail="Clause not found")
    
    for field, value in clause_update.dict(exclude_unset=True).items():
        setattr(clause, field, value)
    
    db.commit()
    db.refresh(clause)
    return clause

@router.delete("/{clause_id}")
async def delete_clause(
    clause_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    clause = db.query(Clause).filter(Clause.id == clause_id).first()
    if not clause:
        raise HTTPException(status_code=404, detail="Clause not found")
    
    db.delete(clause)
    db.commit()
    return {"message": "Clause deleted successfully"}

@router.get("/types/")
async def get_clause_types(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all unique clause types"""
    types = db.query(Clause.clause_type).distinct().all()
    return [t[0] for t in types if t[0]]

@router.get("/tags/")
async def get_clause_tags(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all unique tags"""
    # This is a simplified implementation
    # In production, you'd want to properly aggregate JSON array values
    clauses = db.query(Clause.tags).all()
    all_tags = set()
    for clause in clauses:
        if clause[0]:
            all_tags.update(clause[0])
    return list(all_tags)