from fastapi import APIRouter, Depends
from app.controllers.ai_controller import handle_chat_request
from app.schemas.ai_schema import ChatRequest, ChatResponse

router = APIRouter(prefix="/ai", tags=["AI"])

@router.post("/chat", response_model=ChatResponse)
async def chat(chat_data: ChatRequest):
    """Chat with AI assistant"""
    return await handle_chat_request(chat_data)
