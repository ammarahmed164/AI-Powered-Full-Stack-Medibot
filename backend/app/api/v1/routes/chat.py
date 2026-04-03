"""
Chat Routes - MediBot AI Chatbot
=================================
Powered by Google Gemini AI (5 FREE Keys with Auto Rotation)
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# Import AI Engine
from app.ai.response_generator import ResponseGenerator

router = APIRouter()

# Initialize AI engine
response_generator = None

def get_generator():
    """Get or create AI generator instance"""
    global response_generator
    if response_generator is None:
        response_generator = ResponseGenerator()
    return response_generator

# Models
class ChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = None
    conversation_history: Optional[List[dict]] = None  # NEW: Add conversation history

class SymptomInfo(BaseModel):
    name: str
    confidence: float

class DiseasePrediction(BaseModel):
    disease: str
    confidence: float

class ChatResponse(BaseModel):
    consultation_id: str
    response: str
    extracted_symptoms: List[SymptomInfo]
    predicted_diseases: List[DiseasePrediction]
    advice: List[str]
    doctor_alert: bool
    home_remedies: List[str]
    requires_more_info: bool = False  # NEW: Flag to track if more info needed

@router.post("/message", response_model=ChatResponse)
async def chat_with_bot(data: ChatMessage):
    """Chat with state tracking"""
    try:
        generator = get_generator()
        
        # Generate response
        response_text = generator.generate(
            data.message,
            data.conversation_history or []
        )
        
        # Count bot questions to determine if we should diagnose
        bot_questions = [msg for msg in (data.conversation_history or []) if isinstance(msg, dict) and msg.get('type') == 'bot']
        question_count = len(bot_questions)
        
        # If 4+ questions asked, give diagnosis
        requires_more_info = question_count < 4
        
        consultation_id = f"consult_{int(datetime.now().timestamp())}"
        
        return ChatResponse(
            consultation_id=consultation_id,
            response=response_text,
            extracted_symptoms=[{"name": data.message, "confidence": 0.9}],
            predicted_diseases=[],
            advice=[],
            doctor_alert=False,
            home_remedies=[],
            requires_more_info=requires_more_info
        )
        
    except Exception as e:
        print(f"❌ AI Error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail="Failed to process message. Please try again."
        )

@router.get("/history")
async def get_history(page: int = 1, limit: int = 20):
    """Get chat history"""
    return {"consultations": [], "total": 0, "page": page, "limit": limit}

@router.get("/stats")
async def get_stats():
    """Get chat statistics"""
    return {"total": 0, "symptoms": [], "diseases": []}

@router.get("/")
async def chat_info():
    """Chat endpoint info"""
    return {
        "service": "MediBot Chat",
        "status": "Upgrading to Gemini AI",
        "message": "Enhanced AI chatbot coming soon!"
    }
