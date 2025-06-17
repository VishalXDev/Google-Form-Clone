import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import StaticPool

# Database configuration
DATABASE_DIR = "data"
DATABASE_FILE = "forms.db"

# Ensure data directory exists
os.makedirs(DATABASE_DIR, exist_ok=True)

# Database URL
SQLALCHEMY_DATABASE_URL = f"sqlite:///./{DATABASE_DIR}/{DATABASE_FILE}"

# Create engine with optimized settings for SQLite
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={
        "check_same_thread": False,  # Allow multiple threads
        "timeout": 20,  # Connection timeout in seconds
    },
    poolclass=StaticPool,  # Use static pool for SQLite
    pool_pre_ping=True,  # Verify connections before use
    echo=False  # Set to True for SQL debugging
)

# Session factory
SessionLocal = sessionmaker(
    autocommit=False, 
    autoflush=False, 
    bind=engine
)

# Base class for models
Base = declarative_base()

# Database dependency for FastAPI
def get_database_url():
    """Get the current database URL"""
    return SQLALCHEMY_DATABASE_URL

def get_engine():
    """Get the database engine"""
    return engine

# Optional: Database initialization function
def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)
    print(f"Database initialized at: {SQLALCHEMY_DATABASE_URL}")

# Optional: Database cleanup function  
def close_db():
    """Close database connections"""
    engine.dispose()
    print("Database connections closed")