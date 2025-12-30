from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
from enum import Enum

class IntentType(str, Enum):
    CHECK_AVAILABILITY = "check_availability"
    FETCH_FINES = "fetch_fines"
    BORROWING_HISTORY = "borrowing_history"
    RECOMMENDATION = "recommendation"
    GENERAL_QUERY = "general_query"
    UNKNOWN = "unknown"

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    user_id: Optional[str] = None # In a real app this comes from auth context, but useful for testing agents

class ChatResponse(BaseModel):
    response: str
    conversation_id: Optional[str] = None
    intent: Optional[IntentType] = None
    data: Optional[Dict[str, Any]] = None

class AIIntent(BaseModel):
    intent: IntentType
    entities: Dict[str, Any] = Field(default_factory=dict)
    confidence: float

