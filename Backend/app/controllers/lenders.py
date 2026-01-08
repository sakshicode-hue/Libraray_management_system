from decimal import Decimal
from fastapi import APIRouter, HTTPException
from app.schemas.lenders import Lenderget, ReturnBook
from app.database import get_connection
from datetime import date, timedelta,datetime
from app.controllers.notifications import add_notification
from app.schemas.notifications import Notification_ADD
def get_lendings(lender: Lenderget):
    conn=get_connection()
    cursor=conn.cursor()
    try:
       cursor.execute("SELECT Borrower_ID, user_id, Name, BookTitle, Category, Author, IssuedDate, DueDate, CopiesLent, FinePerDay, Price, Book_ID, Status FROM borrower WHERE user_id=%s", (lender.user_id,))
       result=cursor.fetchall()
       keys=["Borrower_ID", "user_id", "Name", "BookTitle","Category", "Author", "IssuedDate", "DueDate", "CopiesLent", "FinePerDay", "Price", "Book_ID","Status"]
       lendings_dict_list = [dict(zip(keys, lending)) for lending in result]
       return lendings_dict_list
    except Exception as e:  
        raise HTTPException(status_code=500, detail=f"Database error {e}",)
    finally:
        conn.close()

def return_book(lender: ReturnBook):
    conn=get_connection()
    cursor=conn.cursor()
    try:
        # Postgres: RETURNING clause is at the end
        cursor.execute("UPDATE borrower SET Status = 'Returned' WHERE user_id = %s AND Book_ID = %s AND Borrower_ID = %s RETURNING CopiesLent", (lender.user_id, lender.book_id, lender.borrower_id))
        result=cursor.fetchone()
        conn.commit()
        user=cursor.execute("SELECT Cost FROM users WHERE User_id=%s", (lender.user_id,)).fetchone()
        book=cursor.execute("SELECT IssuedDate,DueDate, Price,CopiesLent FROM borrower WHERE Borrower_ID=%s", (lender.borrower_id,)).fetchone()
        days=(book[1]-book[0]).days
        cursor.execute("UPDATE users SET Cost = %s WHERE User_id=%s", (str(int(user[0]) - int(book[3]) * int(book[2]) * days), lender.user_id))
        conn.commit()
        if result[0] == 1:
            # Postgres: LIMIT 1 instead of TOP 1
            cursor.execute("SELECT * FROM reserved WHERE Book_ID = %s LIMIT 1", (lender.book_id,))
            reservation=cursor.fetchone()
            if not reservation:
                cursor.execute("SELECT Available from books WHERE Book_ID=%s", (lender.book_id,))
                result=cursor.fetchone()
                # Postgres: RETURNING clause
                cursor.execute("UPDATE books SET Status = 'Available', Available=%s WHERE Book_ID = %s RETURNING Book_Title", (str(int(result[0]) + 1), lender.book_id))
                book=cursor.fetchone()
                add_notification(Notification_ADD(UserId=lender.user_id, Message=f"Book {book[0]} returned on {date.today().strftime('%d/%m/%Y')}", IsRead=0, CreatedAt=datetime.now().strftime("%d/%m/%Y, %H:%M:%S")))
                conn.commit()
                return {"message": "Book returned successfully"}
            cursor.execute("SELECT Book_Title,Category,Author,Price from books WHERE Book_ID=%s", (lender.book_id,))
            book=cursor.fetchone()
            cursor.execute("SELECT User_Name from users WHERE User_id=%s", (reservation[1],))
            user=cursor.fetchone()
            cursor.execute("""
    INSERT INTO borrower (
        Book_ID, user_id, Name, BookTitle, Author,
        IssuedDate, DueDate, CopiesLent, FinePerDay, Price, Category
    )
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
""", (
    str(lender.book_id),                              # varchar
    str(reservation[1]),                              # varchar
    str(user[0]),                                     # varchar
    str(book[0]),                                     # varchar
    str(book[2]),                                     # varchar
    date.today().strftime("%Y-%m-%d"),                # date
    (date.today() + timedelta(days=2)).strftime("%Y-%m-%d"),  # date
    int(1),                                           # CopiesLent (int)
    int(100),                                           # FinePerDay (int)
    Decimal(book[3]),                              # Price (decimal(10,2))
    str(book[1]),                                     # varchar
))
            conn.commit()
            cursor.execute("DELETE FROM reserved WHERE Reservation_ID = %s", (reservation[0],))
            conn.commit()
        else:
            # Postgres: LIMIT 1
            cursor.execute("SELECT * FROM reserved WHERE Book_ID = %s LIMIT 1", (lender.book_id,))
            reservation=cursor.fetchone()
            if reservation:
                cursor.execute("SELECT Book_Title,Category,Author,Price from books WHERE Book_ID=%s", (lender.book_id,))
                book=cursor.fetchone()
                cursor.execute("SELECT User_Name from users WHERE User_id=%s", (reservation[1],))
                user=cursor.fetchone()
                cursor.execute("""
    INSERT INTO borrower (
        Book_ID, user_id, Name, BookTitle, Author,
        IssuedDate, DueDate, CopiesLent, FinePerDay, Price, Category
    )
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
""", (
    str(lender.book_id),                              # varchar
    str(reservation[1]),                              # varchar 
    str(user[0]),                                     # varchar
    str(book[0]),                                     # varchar
    str(book[2]),                                     # varchar
    date.today().strftime("%Y-%m-%d"),                # date
    (date.today() + timedelta(days=2)).strftime("%Y-%m-%d"),  # date
    int(1),                                           # CopiesLent (int)
    int(100),                                           # FinePerDay (int)
    Decimal(book[3]),                                 # Price (decimal(10,2))
    str(book[1]),                                     # varchar
))
                conn.commit()
                cursor.execute("DELETE FROM reserved WHERE Reservation_ID = %s", (reservation[0],))
                conn.commit()
                cursor.execute("SELECT Available from books WHERE Book_ID=%s", (lender.book_id,))
                result1=cursor.fetchone()
                # Postgres: RETURNING clause
                cursor.execute("UPDATE books SET Available=%s,status='Available' WHERE Book_ID = %s RETURNING Book_Title", (str(int(result[0]) + int(result1[0]) -1), lender.book_id))
                book=cursor.fetchone()
                add_notification(Notification_ADD(UserId=lender.user_id, Message=f"Book {book[0]} returned on {date.today().strftime('%d/%m/%Y')}", IsRead=0, CreatedAt=datetime.now().strftime("%d/%m/%Y, %H:%M:%S")))
                conn.commit()
                return {"message": "Book returned successfully"}
        cursor.execute("SELECT Available from books WHERE Book_ID=%s", (lender.book_id,))
        result1=cursor.fetchone()
        # Postgres: RETURNING clause
        cursor.execute("UPDATE books SET Available=%s,Status='Available' WHERE Book_ID = %s RETURNING Book_Title", (str(int(result[0]) + int(result1[0])), lender.book_id))
        book=cursor.fetchone()
        add_notification(Notification_ADD(UserId=lender.user_id,Message=f"Book {book[0]} returned on {date.today().strftime('%d/%m/%Y')}", IsRead=0, CreatedAt=datetime.now().strftime("%d/%m/%Y, %H:%M:%S")))
        conn.commit()
        return {"message": "Book returned successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error {e}",)
    finally:
        conn.close()