from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from agent import ask_hawkins_agent


# ==========================================================
# FASTAPI APPLICATION
# ==========================================================

app = FastAPI(
    title="Hawkins AI Assistant",
    description=(
        "AI-powered agricultural question answering "
        "using Gemini and Tavily."
    ),
    version="1.0.0",
)


# ==========================================================
# CORS
# ==========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================================
# REQUEST MODEL
# ==========================================================

class ChatRequest(BaseModel):

    message: str = Field(
        ...,
        min_length=1,
        max_length=2000,
        description="User's question",
    )


# ==========================================================
# RESPONSE MODEL
# ==========================================================

class Source(BaseModel):

    title: str
    url: str


class ChatResponse(BaseModel):

    answer: str
    source: str
    sources: list[Source] = []


# ==========================================================
# ROOT
# ==========================================================

@app.get("/")
def root():

    return {
        "message": "Hawkins AI Assistant is running",
        "status": "healthy",
    }


# ==========================================================
# AI CHAT
# ==========================================================

@app.post(
    "/ai/chat",
    response_model=ChatResponse,
)
async def chat(request: ChatRequest):

    result = ask_hawkins_agent(
        request.message
    )

    return result