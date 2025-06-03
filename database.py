from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
import os
from dotenv import load_dotenv
import psycopg2
from urllib.parse import quote_plus

# Load environment variables
load_dotenv()

# Database connection parameters
params = {
    'host': os.getenv('DB_HOST', '127.0.0.1'),
    'database': os.getenv('DB_NAME', 'ethics_game'),
    'user': os.getenv('DB_USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', '')
}

# Create database URL with quoted password
password = quote_plus(params['password'])
DATABASE_URL = f"postgresql://{params['user']}:{password}@{params['host']}/{params['database']}?client_encoding=utf8"

# Test connection first
try:
    conn = psycopg2.connect(**params)
    conn.close()
    print("Successfully connected to PostgreSQL")
except Exception as e:
    print(f"Error connecting to PostgreSQL: {e}")
    raise

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

