from datetime import date
from fastapi import APIRouter, HTTPException
from app.database import get_connection

def get_fines_summary(user_id: str):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        # Fetch active lendings for the user
        cursor.execute("""
            SELECT BookTitle, DueDate, FinePerDay, CopiesLent, IssuedDate 
            FROM borrower 
            WHERE user_id = %s AND Status = 'Borrowed'
        """, (user_id,))
        lendings = cursor.fetchall()
        
        total_fines = 0
        overdue_books = []
        
        for lending in lendings:
            book_title, due_date, fine_per_day, copies_lent, issued_date = lending
            
            # Calculate days overdue
            # due_date is date object from DB
            today = date.today()
            
            if today > due_date:
                overdue_days = (today - due_date).days
                fine = overdue_days * fine_per_day * copies_lent
                total_fines += fine
                
                overdue_books.append({
                    "title": book_title,
                    "dueDate": due_date.strftime("%Y-%m-%d"),
                    "overdueDays": overdue_days,
                    "fineAmount": fine
                })
        
        # Get User Account Cost/Balance
        cursor.execute("SELECT Cost FROM users WHERE User_id = %s", (user_id,))
        user_result = cursor.fetchone()
        account_cost = user_result[0] if user_result else 0

        return {
            "totalFines": total_fines,
            "accountCost": account_cost,
            "overdueBooks": overdue_books
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        conn.close()
