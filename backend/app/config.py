import os
from dotenv import load_dotenv

load_dotenv()

# Groq settings - REQUIRED for AI functionality
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    print(
        "Warning: GROQ_API_KEY not found in environment variables. Please set it in .env file"
    )

# File upload settings
UPLOAD_DIR = "uploads"
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

# AI settings
CHAT_MODEL = "llama3-8b-8192"

# Environment
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

# Database settings
# Use env var if provided, otherwise default to local SQLite database file
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///clausecraft.db")

# Auth/JWT settings
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-change-me")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
