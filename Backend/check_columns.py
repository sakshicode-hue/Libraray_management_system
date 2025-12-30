import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

SERVER = os.getenv("db_server")
DB = os.getenv("db_database")
USER = os.getenv("db_username")
PASSWORD = os.getenv("db_password")
PORT = os.getenv("db_port", "5432")

def check_columns():
    try:
        conn = psycopg2.connect(
            host=SERVER,
            database=DB,
            user=USER,
            password=PASSWORD,
            port=PORT
        )
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users LIMIT 0")
        columns = [desc[0] for desc in cursor.description]
        print(f"Columns in 'users' table: {columns}")
        conn.close()
    except Exception as e:
        print(e)

if __name__ == "__main__":
    check_columns()
