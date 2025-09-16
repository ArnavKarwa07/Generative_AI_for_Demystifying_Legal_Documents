import os
from dotenv import load_dotenv

load_dotenv()

# Database settings
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./clausecraft.db")

# JWT settings
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Groq settings
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Redis settings
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

# File upload settings
UPLOAD_DIR = "uploads"
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB

# AI settings
EMBEDDING_MODEL = "text-embedding-ada-002"
CHAT_MODEL = "llama3-8b-8192"

# Security settings
BCRYPT_ROUNDS = 12