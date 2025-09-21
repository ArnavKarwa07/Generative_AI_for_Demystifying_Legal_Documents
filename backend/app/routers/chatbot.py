from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any, Optional, List
from app.services.langgraph_ai_service import LangGraphAIService
from app.routers.auth import get_current_user
from app.schemas import User

router = APIRouter(prefix="/api/chatbot", tags=["chatbot"])

# Initialize the LangGraph AI service
ai_service = LangGraphAIService()


class ChatMessage(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None


class ChatResponse(BaseModel):
    response: str
    query_type: str
    intent: str
    recommendations: List[str]
    conversation_id: Optional[str] = None


class ChatHistory(BaseModel):
    conversation_id: str
    messages: List[Dict[str, Any]]


# In-memory storage for chat conversations (in production, use a database)
chat_conversations: Dict[str, List[Dict[str, Any]]] = {}


@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(
    chat_message: ChatMessage,
    current_user: User = Depends(get_current_user)
):
    """
    Chat with the AI legal assistant
    """
    try:
        # Generate conversation ID if not provided
        conversation_id = f"user_{current_user.id}_conv_{len(chat_conversations) + 1}"
        
        # Get or create conversation history
        if conversation_id not in chat_conversations:
            chat_conversations[conversation_id] = []
        
        # Add user message to history
        chat_conversations[conversation_id].append({
            "role": "user",
            "content": chat_message.message,
            "timestamp": "2025-01-21T12:00:00Z"  # In production, use actual timestamp
        })
        
        # Get AI response using LangGraph
        result = await ai_service.chat_response(
            user_message=chat_message.message,
            context=chat_message.context
        )
        
        # Add AI response to history
        chat_conversations[conversation_id].append({
            "role": "assistant",
            "content": result.get('response', ''),
            "timestamp": "2025-01-21T12:00:01Z",
            "metadata": {
                "query_type": result.get('query_type', ''),
                "intent": result.get('intent', '')
            }
        })
        
        return ChatResponse(
            response=result.get('response', ''),
            query_type=result.get('query_type', 'general'),
            intent=result.get('intent', ''),
            recommendations=result.get('recommendations', []),
            conversation_id=conversation_id
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat message: {str(e)}")


@router.get("/conversations/{conversation_id}", response_model=ChatHistory)
async def get_conversation_history(
    conversation_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    Get conversation history for a specific conversation
    """
    try:
        if conversation_id not in chat_conversations:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        return ChatHistory(
            conversation_id=conversation_id,
            messages=chat_conversations[conversation_id]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving conversation: {str(e)}")


@router.get("/conversations", response_model=List[str])
async def list_user_conversations(
    current_user: User = Depends(get_current_user)
):
    """
    List all conversation IDs for the current user
    """
    try:
        user_conversations = [
            conv_id for conv_id in chat_conversations.keys()
            if conv_id.startswith(f"user_{current_user.id}_")
        ]
        return user_conversations
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing conversations: {str(e)}")


@router.delete("/conversations/{conversation_id}")
async def delete_conversation(
    conversation_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    Delete a conversation
    """
    try:
        if conversation_id not in chat_conversations:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        # Check if user owns this conversation
        if not conversation_id.startswith(f"user_{current_user.id}_"):
            raise HTTPException(status_code=403, detail="Not authorized to delete this conversation")
        
        del chat_conversations[conversation_id]
        
        return {"message": "Conversation deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting conversation: {str(e)}")


@router.post("/quick-help")
async def get_quick_help(
    current_user: User = Depends(get_current_user)
):
    """
    Get quick help suggestions and common queries
    """
    try:
        help_suggestions = {
            "common_queries": [
                "Explain this clause in simple terms",
                "What are the risks in this contract?",
                "Help me draft a confidentiality clause",
                "What does 'force majeure' mean?",
                "How can I improve this agreement?",
                "What should I negotiate in this contract?"
            ],
            "features": [
                {
                    "title": "Document Analysis",
                    "description": "Upload documents for AI-powered analysis and insights"
                },
                {
                    "title": "Clause Explanation",
                    "description": "Get plain English explanations of complex legal terms"
                },
                {
                    "title": "Risk Assessment",
                    "description": "Identify potential legal and business risks"
                },
                {
                    "title": "Draft Assistance",
                    "description": "Get help drafting contracts and legal documents"
                }
            ],
            "tips": [
                "Be specific about your legal questions for better responses",
                "Provide context about your situation when asking for advice",
                "Remember that AI suggestions should be reviewed by legal counsel",
                "Use the document upload feature for comprehensive analysis"
            ]
        }
        
        return help_suggestions
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting help: {str(e)}")


# Legal knowledge base queries
@router.post("/knowledge-base")
async def query_knowledge_base(
    query: str,
    current_user: User = Depends(get_current_user)
):
    """
    Query the legal knowledge base for specific information
    """
    try:
        # Use the AI service to provide knowledge base responses
        result = await ai_service.chat_response(
            user_message=f"From a legal knowledge perspective: {query}",
            context={"type": "knowledge_base", "user_role": getattr(current_user, 'role', 'user')}
        )
        
        return {
            "query": query,
            "response": result.get('response', ''),
            "sources": ["Legal Knowledge Base", "AI Analysis"],
            "confidence": 0.85,
            "related_topics": result.get('recommendations', [])
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error querying knowledge base: {str(e)}")