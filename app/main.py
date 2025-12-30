from fastapi import FastAPI, Request
import logging
import time
from fastapi.middleware.cors import CORSMiddleware
from app.routers import (
    auth_routes, book_routes, member_routes, transaction_routes,
    fine_routes, reservation_routes, search_routes, ebook_routes,
    report_routes, system_routes, ai_routes
)

app = FastAPI(
    title="Library Management System",
    description="Comprehensive Library Management System with 54 API endpoints",
    version="1.0.0"
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    logger.info(
        f"Method: {request.method} Path: {request.url.path} "
        f"Status: {response.status_code} Time: {process_time:.2f}s"
    )
    return response

from app.scheduler import start_scheduler

@app.on_event("startup")
async def startup_event():
    start_scheduler()


# ✅ CORS CONFIG
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # frontend URLs (for dev)
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, PUT, DELETE, OPTIONS
    allow_headers=["*"],  # Authorization, Content-Type, etc
)

# Include all routers
app.include_router(auth_routes.router)
app.include_router(book_routes.router)
app.include_router(member_routes.router)
app.include_router(transaction_routes.router)
app.include_router(fine_routes.router)
app.include_router(reservation_routes.router)
app.include_router(search_routes.router)
app.include_router(ebook_routes.router)
app.include_router(report_routes.router)
app.include_router(system_routes.router)
app.include_router(ai_routes.router)

@app.get("/")
def root():
    return {
        "status": "Server running",
        "message": "Library Management System API",
        "version": "1.0.0",
        "total_endpoints": 54,
        "documentation": "/docs"
    }
