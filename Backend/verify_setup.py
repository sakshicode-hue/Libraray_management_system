import psycopg2
import os
from dotenv import load_dotenv

# Load simple .env (not using pydantic here to keep it simple and robust)
load_dotenv()

SERVER = os.getenv("db_server")
DB = os.getenv("db_database")
USER = os.getenv("db_username")
PASSWORD = os.getenv("db_password")
PORT = os.getenv("db_port", "5432")

def verify():
    print(f"Connecting to {SERVER}:{PORT}/{DB} as {USER}...")
    try:
        conn = psycopg2.connect(
            host=SERVER,
            database=DB,
            user=USER,
            password=PASSWORD,
            port=PORT
        )
        print("✅ Connection Successful!")
        
        cursor = conn.cursor()
        cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';")
        tables = [row[0] for row in cursor.fetchall()]
        
        print(f"Found {len(tables)} tables: {tables}")
        
        required_tables = {"users", "books", "borrower", "reserved", "notifications", "otps"}
        missing = required_tables - set(tables)
        
        if missing:
            print(f"❌ Missing required tables: {missing}")
            print("The database schema has not been migrated yet.")
        else:
            print("✅ All required tables seem to be present.")

        conn.close()
    except Exception as e:
        print(f"❌ Connection Failed: {e}")

if __name__ == "__main__":
    verify()
