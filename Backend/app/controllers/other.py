from fastapi import HTTPException
from app.database import get_connection
from app.schemas.other import User

def chart_details(user:User):
    conn=get_connection()
    cursor=conn.cursor()
    try:
        cursor.execute("SELECT COUNT(*) FROM borrower WHERE user_id = %s AND Status='Returned'", (user.user_id,))
        returned = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM borrower WHERE DueDate < CURRENT_DATE AND Status='not returned'  AND user_id = %s ", (user.user_id,))
        overdue = cursor.fetchone()[0]
        return {"returned":returned,"overdue":overdue}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error {e}",)
    finally:
        conn.close()

def lending_activity(user: User):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT TO_CHAR(IssuedDate::date, 'Month') AS MonthName, COUNT(*) AS Count
            FROM borrower
            WHERE user_id = %s
            GROUP BY TO_CHAR(IssuedDate::date, 'Month')
        """, (user.user_id,))
        
        months = {
            "January": 0, "February": 0, "March": 0, "April": 0,
            "May": 0, "June": 0, "July": 0, "August": 0,
            "September": 0, "October": 0, "November": 0, "December": 0
        }

        for month_name, count in cursor.fetchall():
            if month_name: 
                months[month_name] = count

        return months

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error {e}")
    finally:
        conn.close()

def other_get(user:User):
    conn=get_connection()
    cursor=conn.cursor()
    try:
        cursor.execute("SELECT COUNT(*) FROM borrower WHERE user_id = %s AND Status='not returned'", (user.user_id,))
        lended = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM borrower WHERE DueDate < CURRENT_DATE AND Status='not returned'  AND user_id = %s ", (user.user_id,))
        overdue = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM reserved WHERE user_id = %s", (user.user_id,))
        reserved = cursor.fetchone()[0]
        return {"lended":lended,"overdue":overdue,"reserved":reserved}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error {e}",)
    finally:
        conn.close()