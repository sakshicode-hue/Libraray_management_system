
import sys
import traceback
from fastapi import FastAPI

# Redirect output to file
sys.stdout = open('debug_log.txt', 'w', encoding='utf-8')
sys.stderr = sys.stdout

from app.routers import (
    auth_routes, book_routes, member_routes, transaction_routes,
    fine_routes, reservation_routes, search_routes, ebook_routes,
    report_routes, system_routes, ai_routes
)

def test_router(router, name):
    print(f"Testing router: {name}...")
    app = FastAPI()
    app.include_router(router)
    try:
        app.openapi()
        print(f"[OK] {name}")
    except Exception as e:
        print(f"[FAIL] {name}")
        traceback.print_exc()

# Test each one
test_router(auth_routes.router, "auth")
test_router(book_routes.router, "book")
test_router(member_routes.router, "member")
test_router(transaction_routes.router, "transaction")
test_router(fine_routes.router, "fine")
test_router(reservation_routes.router, "reservation")
test_router(search_routes.router, "search")
test_router(ebook_routes.router, "ebook")
test_router(report_routes.router, "report")
test_router(system_routes.router, "system")
test_router(ai_routes.router, "ai")
