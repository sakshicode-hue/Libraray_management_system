from app.database import get_connection

try:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM books LIMIT 0")
    colnames = [desc[0] for desc in cursor.description]
    print("Columns in books table:", colnames)
except Exception as e:
    print(f"Error: {e}")
finally:
    if 'conn' in locals():
        conn.close()
