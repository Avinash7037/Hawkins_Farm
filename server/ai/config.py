import os
from pathlib import Path
from dotenv import load_dotenv
BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")
GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")

GEMINI_MODEL = os.getenv(
    "GEMINI_MODEL",
    "gemini-3.6-flash"
)
# VALIDATION
if not GEMINI_API_KEY:
    print("WARNING: GEMINI_API_KEY is not configured.")

if not TAVILY_API_KEY:
    print("WARNING: TAVILY_API_KEY is not configured.")