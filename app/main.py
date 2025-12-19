from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import book_routes

app = FastAPI(title="Library Management System")

# ✅ CORS CONFIG
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # frontend URLs (for dev)
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, PUT, DELETE, OPTIONS
    allow_headers=["*"],  # Authorization, Content-Type, etc
)

app.include_router(book_routes.router)

@app.get("/")
def root():
    return {"status": "Server running on port 3000"}
