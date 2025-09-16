from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from datetime import datetime, timedelta
import jwt
import hashlib

# FastAPI app
app = FastAPI(
    title="ClauseCraft API",
    description="AI-Powered Legal Document Platform",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()
SECRET_KEY = "your-secret-key-for-jwt"
ALGORITHM = "HS256"


# Pydantic models
class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str


class DocumentResponse(BaseModel):
    id: int
    title: str
    type: str
    status: str
    created_at: str
    updated_at: str
    size: str
    pages: int


class ClauseResponse(BaseModel):
    id: int
    title: str
    category: str
    content: str
    tags: List[str]


# Mock database
mock_users = [
    {
        "id": 1,
        "name": "Demo User",
        "email": "demo@clausecraft.com",
        "password": "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
    }  # "password"
]

mock_documents = [
    {
        "id": 1,
        "title": "Service Agreement - TechCorp",
        "type": "Service Agreement",
        "status": "draft",
        "created_at": "2025-09-15T10:30:00Z",
        "updated_at": "2025-09-16T14:20:00Z",
        "size": "2.4 MB",
        "pages": 12,
    },
    {
        "id": 2,
        "title": "NDA - Startup Inc",
        "type": "Non-Disclosure Agreement",
        "status": "review",
        "created_at": "2025-09-14T09:15:00Z",
        "updated_at": "2025-09-16T11:45:00Z",
        "size": "856 KB",
        "pages": 8,
    },
    {
        "id": 3,
        "title": "Employment Contract - John Doe",
        "type": "Employment Contract",
        "status": "completed",
        "created_at": "2025-09-13T16:00:00Z",
        "updated_at": "2025-09-15T13:30:00Z",
        "size": "1.2 MB",
        "pages": 6,
    },
    {
        "id": 4,
        "title": "Software License Agreement",
        "type": "License Agreement",
        "status": "draft",
        "created_at": "2025-09-16T08:00:00Z",
        "updated_at": "2025-09-16T10:15:00Z",
        "size": "3.1 MB",
        "pages": 18,
    },
]

mock_clauses = [
    {
        "id": 1,
        "title": "Standard Payment Terms",
        "category": "Payment",
        "content": "Payment shall be made within thirty (30) days of invoice receipt. Late payments may incur interest at 1.5% per month.",
        "tags": ["payment", "invoice", "standard"],
    },
    {
        "id": 2,
        "title": "Liability Limitation",
        "category": "Liability",
        "content": "In no event shall either party's liability exceed the total amount paid under this agreement in the twelve months preceding the claim.",
        "tags": ["liability", "limitation", "protection"],
    },
    {
        "id": 3,
        "title": "Confidentiality Clause",
        "category": "Confidentiality",
        "content": "Both parties agree to maintain the confidentiality of all proprietary information disclosed during the term of this agreement.",
        "tags": ["confidentiality", "proprietary", "disclosure"],
    },
    {
        "id": 4,
        "title": "Termination for Convenience",
        "category": "Termination",
        "content": "Either party may terminate this agreement at any time with thirty (30) days written notice to the other party.",
        "tags": ["termination", "convenience", "notice"],
    },
    {
        "id": 5,
        "title": "Indemnification Clause",
        "category": "Risk Management",
        "content": "Each party shall indemnify and hold harmless the other party from any claims, damages, or losses arising from their breach of this agreement.",
        "tags": ["indemnification", "protection", "breach"],
    },
]


# Utility functions
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def create_jwt_token(user_id: int, email: str) -> str:
    payload = {
        "user_id": user_id,
        "email": email,
        "exp": datetime.utcnow() + timedelta(days=1),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(
            credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM]
        )
        user_id = payload.get("user_id")
        user = next((u for u in mock_users if u["id"] == user_id), None)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


# Routes
@app.get("/")
async def root():
    return {"message": "ClauseCraft API is running", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}


# Authentication endpoints
@app.post("/api/auth/login")
async def login(request: LoginRequest):
    # Find user
    user = next((u for u in mock_users if u["email"] == request.email), None)
    if not user or user["password"] != hash_password(request.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Create token
    token = create_jwt_token(user["id"], user["email"])

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user["id"], "name": user["name"], "email": user["email"]},
    }


@app.post("/api/auth/register")
async def register(request: RegisterRequest):
    # Check if user exists
    if any(u["email"] == request.email for u in mock_users):
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create new user
    new_user = {
        "id": len(mock_users) + 1,
        "name": request.name,
        "email": request.email,
        "password": hash_password(request.password),
    }
    mock_users.append(new_user)

    # Create token
    token = create_jwt_token(new_user["id"], new_user["email"])

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": new_user["id"],
            "name": new_user["name"],
            "email": new_user["email"],
        },
    }


@app.get("/api/auth/me")
async def get_current_user_profile(current_user=Depends(get_current_user)):
    return {
        "id": current_user["id"],
        "name": current_user["name"],
        "email": current_user["email"],
    }


# Dashboard endpoints
@app.get("/api/dashboard/stats")
async def get_dashboard_stats(current_user=Depends(get_current_user)):
    return {
        "totalDocuments": len(mock_documents),
        "documentsThisMonth": 8,
        "pendingReviews": 5,
        "completedDocuments": len(
            [d for d in mock_documents if d["status"] == "completed"]
        ),
        "activeWorkflows": 3,
        "clausesLibrarySize": len(mock_clauses),
    }


# Documents endpoints
@app.get("/api/documents")
async def get_documents(current_user=Depends(get_current_user)):
    return {"documents": mock_documents, "total": len(mock_documents)}


@app.get("/api/documents/{document_id}")
async def get_document(document_id: int, current_user=Depends(get_current_user)):
    document = next((doc for doc in mock_documents if doc["id"] == document_id), None)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return document


@app.post("/api/documents")
async def create_document(
    title: str = "New Document",
    doc_type: str = "Contract",
    current_user=Depends(get_current_user),
):
    new_doc = {
        "id": len(mock_documents) + 1,
        "title": title,
        "type": doc_type,
        "status": "draft",
        "created_at": datetime.now().isoformat() + "Z",
        "updated_at": datetime.now().isoformat() + "Z",
        "size": "0 KB",
        "pages": 0,
    }
    mock_documents.append(new_doc)
    return new_doc


# Clauses endpoints
@app.get("/api/clauses")
async def get_clauses(
    category: Optional[str] = None, current_user=Depends(get_current_user)
):
    clauses = mock_clauses
    if category:
        clauses = [c for c in clauses if c["category"].lower() == category.lower()]
    return {"clauses": clauses, "total": len(clauses)}


@app.get("/api/clauses/types")
async def get_clause_types(current_user=Depends(get_current_user)):
    categories = list(set(clause["category"] for clause in mock_clauses))
    return {"categories": categories}


@app.get("/api/clauses/{clause_id}")
async def get_clause(clause_id: int, current_user=Depends(get_current_user)):
    clause = next((c for c in mock_clauses if c["id"] == clause_id), None)
    if not clause:
        raise HTTPException(status_code=404, detail="Clause not found")
    return clause


# AI endpoints
@app.post("/api/ai/explain")
async def explain_clause(current_user=Depends(get_current_user)):
    return {
        "explanation": "This clause establishes the payment terms and conditions, specifying that payments must be made within 30 days. The interest provision protects the service provider from late payments.",
        "key_points": [
            "30-day payment window",
            "Late payment penalties apply",
            "1.5% monthly interest rate",
        ],
        "risk_level": "Low",
        "recommendations": [
            "Consider adding specific payment methods",
            "Define what constitutes 'receipt' of invoice",
        ],
    }


@app.post("/api/ai/risk-analysis")
async def analyze_risk(current_user=Depends(get_current_user)):
    return {
        "overall_risk": 3.2,
        "risk_factors": [
            {"category": "Payment Terms", "risk": 2.1, "severity": "Low"},
            {"category": "Liability", "risk": 4.8, "severity": "Medium"},
            {"category": "Termination", "risk": 2.5, "severity": "Low"},
        ],
        "suggestions": [
            "Add liability limitation clause",
            "Include force majeure provisions",
            "Specify termination procedures",
        ],
        "compliance_score": 8.5,
    }


if __name__ == "__main__":
    uvicorn.run("simple_server:app", host="0.0.0.0", port=8000, reload=True)
