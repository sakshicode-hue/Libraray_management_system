# Backend/inspect_db.py
from app.database import get_connection
import psycopg2

def inspect():
    print("Connecting to Database...")
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        tables = ["books", "borrower", "users", "reserved", "notifications"]
        
        for table in tables:
            print(f"\n--- Schema for table: {table} ---")
            try:
                # Postgres specific query to get column details
                cursor.execute(f"SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '{table}';")
                columns = cursor.fetchall()
                if not columns:
                    print(f"Table '{table}' not found or empty schema.")
                for col in columns:
                    print(f"{col[0]}: {col[1]}")
            except Exception as e:
                print(f"Error inspecting {table}: {e}")
                
        conn.close()
        print("\nDatabase Inspection Complete.")
        
    except Exception as e:
        print(f"Connection Failed: {e}")

if __name__ == "__main__":
    inspect()
