from fastapi import APIRouter
from app.controllers.fines import get_fines_summary

router = APIRouter(prefix="/req/fines", tags=["fines"])

@router.get("/{user_id}")
def get_fines(user_id: str):
    return get_fines_summary(user_id)
