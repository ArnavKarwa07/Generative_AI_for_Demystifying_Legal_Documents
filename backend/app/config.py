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
