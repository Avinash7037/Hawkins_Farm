from google import genai
from google.genai import types
from config import GEMINI_API_KEY, GEMINI_MODEL
from prompts import SYSTEM_PROMPT
from tavily_search import (
    search_web,
    format_search_context,
)

# GEMINI CLIENT
gemini_client = None
if GEMINI_API_KEY:
    gemini_client = genai.Client(
        api_key=GEMINI_API_KEY
    )
# WEB SEARCH KEYWORDS
WEB_KEYWORDS = [
    "today",
    "today's",
    "current",
    "currently",
    "latest",
    "recent",
    "recently",
    "this week",
    "this month",
    "now",
    "right now",
    "price today",
    "market price",
    "current price",
    "latest price",
    "msp",
    "government scheme",
    "government schemes",
    "new scheme",
    "latest news",
    "recent news",
    "news today",
    "latest research",
    "recent research",
]

def needs_web_search(question: str) -> bool:
    question_lower = question.lower().strip()
    for keyword in WEB_KEYWORDS:
        if keyword in question_lower:
            return True

    return False

# GEMINI GENERATION
def generate_gemini_answer(
    question: str,
    web_context: str | None = None
) -> str:

    if not gemini_client:
        raise RuntimeError(
            "GEMINI_API_KEY is not configured."
        )

    user_prompt = f"""
USER QUESTION:

{question}
"""

    if web_context:
        user_prompt += f"""

EXTERNAL WEB INFORMATION:
{web_context}
IMPORTANT:
Use the web information above when it is relevant.
Do not invent information that is not supported by the
web results.
When answering a current-information question, prefer
the external sources over your general knowledge.
If the web results conflict with each other, explain
the uncertainty instead of pretending there is one
certain answer.
"""


    # Gemini
    response = gemini_client.models.generate_content(
        model=GEMINI_MODEL,
        contents=user_prompt,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            max_output_tokens=1200,
        ),
    )

    if not response.text:
        raise RuntimeError(
            "Gemini returned an empty response."
        )

    return response.text.strip()

# MAIN HAWKINS AI AGENT
def ask_hawkins_agent(question: str) -> dict:
    question = question.strip()
    if not question:
        return {
            "answer": "Please enter a question.",
            "source": "none",
            "sources": [],
        }

    use_web = needs_web_search(question)
    # PATH 1: GEMINI ONLY
    if not use_web:
        try:
            answer = generate_gemini_answer(
                question=question
            )
            return {
                "answer": answer,
                "source": "gemini",
                "sources": [],
            }

        except Exception as e:
            print(f"Gemini error: {e}")
            return {
                "answer": (
                    "Sorry, I couldn't process your question "
                    "right now. Please try again."
                ),
                "source": "error",
                "sources": [],
            }

    # PATH 2: TAVILY → GEMINI
    search_data = search_web(question)
    if search_data.get("success"):
        web_context = format_search_context(
            search_data
        )
        try:
            answer = generate_gemini_answer(
                question=question,
                web_context=web_context,
            )
            sources = [
                {
                    "title": item.get("title", ""),
                    "url": item.get("url", ""),
                }
                for item in search_data.get("results", [])
                if item.get("url")
            ]

            return {
                "answer": answer,
                "source": "tavily + gemini",
                "sources": sources,
            }

        except Exception as e:

            print(f"Gemini with Tavily context error: {e}")

            return {
                "answer": (
                    "I found external information, but "
                    "I couldn't generate the final answer. "
                    "Please try again."
                ),
                "source": "tavily_error",
                "sources": [],
            }


    # TAVILY FAILED → GEMINI FALLBACK
    try:

        answer = generate_gemini_answer(
            question=question
        )

        return {
            "answer": answer,
            "source": "gemini_fallback",
            "sources": [],
        }

    except Exception as e:

        print(f"Fallback Gemini error: {e}")

        return {
            "answer": (
                "Sorry, Hawkins AI is temporarily "
                "unable to answer this question."
            ),
            "source": "error",
            "sources": [],
        }


# ==========================================================
# FUTURE HAWKINS FARM TOOLS
# ==========================================================

# These are intentionally NOT implemented yet.
#
# ----------------------------------------------------------
# FUTURE RAG
# ----------------------------------------------------------
#
# def hawkins_rag_search(query: str):
#     pass
#
#
# ----------------------------------------------------------
# FUTURE WEATHER
# ----------------------------------------------------------
#
# def weather_tool(city: str):
#     pass
#
#
# ----------------------------------------------------------
# FUTURE CROP RECOGNITION
# ----------------------------------------------------------
#
# def crop_recognition_tool(image):
#     pass
#
#
# ----------------------------------------------------------
# FUTURE PRICE PREDICTION
# ----------------------------------------------------------
#
# def price_prediction_tool(crop: str):
#     pass
#
#
# ----------------------------------------------------------
# FUTURE AUCTION
# ----------------------------------------------------------
#
# def auction_tool(...):
#     pass