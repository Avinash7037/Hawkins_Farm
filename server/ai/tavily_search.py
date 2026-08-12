from tavily import TavilyClient
from config import TAVILY_API_KEY
tavily_client = None
if TAVILY_API_KEY:
    tavily_client = TavilyClient(
        api_key=TAVILY_API_KEY
    )
def search_web(query: str) -> dict:
    """
    Search the web using Tavily.
    Returns:
        {
            "success": bool,
            "results": list,
            "answer": str | None
        }
    """
    if not tavily_client:
        return {
            "success": False,
            "results": [],
            "answer": None,
            "error": "Tavily API key is not configured."
        }

    try:

        response = tavily_client.search(
            query=query,
            search_depth="basic",
            max_results=5,
            include_answer=True,
        )

        results = []
        for result in response.get("results", []):
            results.append({
                "title": result.get("title", ""),
                "url": result.get("url", ""),
                "content": result.get("content", ""),
                "score": result.get("score", 0),
            })

        return {
            "success": True,
            "results": results,
            "answer": response.get("answer"),
        }

    except Exception as e:

        print(f"Tavily search error: {e}")

        return {
            "success": False,
            "results": [],
            "answer": None,
            "error": str(e),
        }

# FORMAT SEARCH RESULTS
def format_search_context(search_data: dict) -> str:
    """
    Convert Tavily results into context for Gemini.
    """
    if not search_data.get("success"):
        return ""
    context_parts = []
    direct_answer = search_data.get("answer")
    if direct_answer:
        context_parts.append(
            f"SEARCH SUMMARY:\n{direct_answer}"
        )
    for index, result in enumerate(
        search_data.get("results", []),
        start=1
    ):

        context_parts.append(
            f"""
SOURCE {index}

Title:
{result.get("title", "")}

URL:
{result.get("url", "")}

Content:
{result.get("content", "")}
"""
        )
    return "\n\n".join(context_parts)