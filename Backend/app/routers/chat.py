from fastapi import APIRouter
from app.schemas.chat import ChatRequest
from app.controllers.chat import process_chat

router = APIRouter(prefix="/req/chat", tags=["chat"])

@router.post("/")
def chat_endpoint(request: ChatRequest):
    return process_chat(request.user_id, request.message)
