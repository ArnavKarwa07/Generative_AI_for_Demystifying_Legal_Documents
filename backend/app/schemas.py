from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List, Dict, Any
from enum import Enum

class UserRole(str, Enum):
    admin = "admin"
    lawyer = "lawyer"
    user = "user"

class DocumentStatus(str, Enum):
    draft = "draft"
    review = "review"
    approved = "approved"
    signed = "signed"
    archived = "archived"

# User schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: UserRole = UserRole.user

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[UserRole] = None

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Document schemas
class DocumentBase(BaseModel):
    title: str
    parties: Optional[Dict[str, Any]] = None
    jurisdiction: Optional[str] = None
    status: DocumentStatus = DocumentStatus.draft

class DocumentCreate(DocumentBase):
    pass

class DocumentUpdate(BaseModel):
    title: Optional[str] = None
    parties: Optional[Dict[str, Any]] = None
    jurisdiction: Optional[str] = None
    status: Optional[DocumentStatus] = None

class Document(DocumentBase):
    id: int
    upload_date: datetime
    version_id: Optional[str] = None
    storage_path: Optional[str] = None
    owner_id: int
    
    class Config:
        from_attributes = True

# Clause schemas
class ClauseBase(BaseModel):
    clause_type: Optional[str] = None
    text: str
    variables: Optional[Dict[str, Any]] = None
    tags: Optional[List[str]] = None

class ClauseCreate(ClauseBase):
    document_id: Optional[int] = None

class ClauseUpdate(BaseModel):
    clause_type: Optional[str] = None
    text: Optional[str] = None
    variables: Optional[Dict[str, Any]] = None
    tags: Optional[List[str]] = None

class Clause(ClauseBase):
    id: int
    document_id: Optional[int] = None
    version_id: Optional[int] = None
    risk_score: Optional[float] = None
    last_updated: datetime
    
    class Config:
        from_attributes = True

# Draft schemas
class DraftRequest(BaseModel):
    contract_type: str
    parties: Dict[str, str]
    jurisdiction: str
    scope_short: str
    payment_terms: str
    risk_profile: str = "balanced"

class DraftResponse(BaseModel):
    draft_id: str
    content: str
    summary: str
    clauses: List[Dict[str, Any]]

# AI schemas
class ExplainClauseRequest(BaseModel):
    clause_text: str
    explanation_type: str = "eli5"  # eli5, technical, legalese

class ExplainClauseResponse(BaseModel):
    explanation: str
    confidence: float
    citations: List[str]

class SimulateClauseRequest(BaseModel):
    original_clause: str
    modified_clause: str

class SimulateClauseResponse(BaseModel):
    impact_analysis: Dict[str, Any]
    risk_assessment: float
    recommendations: List[str]

# Auth schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str