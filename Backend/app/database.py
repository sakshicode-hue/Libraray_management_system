import psycopg2
from app.core.config import settings

def get_connection():
    return psycopg2.connect(
        host=settings.db_server,
        database=settings.db_database,
        user=settings.db_username,
        password=settings.db_password,
        port=settings.db_port
    )
