from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.schemas import ExplainClauseRequest, ExplainClauseResponse, SimulateClauseRequest, SimulateClauseResponse
from app.routers.auth import get_current_user
from app.services.langgraph_ai_service import LangGraphAIService

router = APIRouter()

@router.post("/explain", response_model=ExplainClauseResponse)
async def explain_clause(
    request: ExplainClauseRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ai_service = LangGraphAIService()
    explanation = await ai_service.explain_clause(
        request.clause_text,
        request.explanation_type
    )
    return explanation

@router.post("/simulate", response_model=SimulateClauseResponse)
async def simulate_clause_change(
    request: SimulateClauseRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ai_service = LangGraphAIService()
    simulation = await ai_service.simulate_clause_change(
        request.original_clause,
        request.modified_clause
    )
    return simulation

@router.post("/redline")
async def suggest_redline(
    redline_request: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ai_service = LangGraphAIService()
    suggestions = await ai_service.suggest_redline(redline_request)
    return suggestions

@router.post("/alternatives")
async def generate_alternatives(
    alternatives_request: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ai_service = LangGraphAIService()
    alternatives = await ai_service.generate_alternatives(alternatives_request)
    return alternatives

@router.post("/risk-analysis")
async def analyze_risk(
    risk_request: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ai_service = LangGraphAIService()
    risk_analysis = await ai_service.analyze_risk(risk_request)
    return risk_analysis