import logging
from typing import List, Dict, Any
import google.generativeai as genai
from app.core.config import settings

logger = logging.getLogger(__name__)

genai.configure(api_key=settings.GEMINI_API_KEY)
MODEL_NAME = "gemini-2.5-flash" 

def check_contradictions(query: str, search_results: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Checks if there are contradictions among the retrieved documents for the given query.
    """
    if len(search_results) < 2:
        return {"contradiction_found": False, "summary": ""}

    context_parts = []
    for i, res in enumerate(search_results):
        context_parts.append(f"Source {i+1} [{res['doc_id']}]: {res['text']}")
    
    context_str = "\n".join(context_parts)

    prompt = f"""
    You are an expert analyst. I am providing you with multiple snippets from different documents retrieved for a user query.
    User Query: {query}
    
    Context Snippets:
    {context_str}
    
    Do any of these sources directly contradict each other regarding the facts relevant to the query?
    Respond ONLY in valid JSON format with two keys:
    - "contradiction_found": boolean (true if there is a clear contradiction, false otherwise)
    - "summary": string (a brief 1-sentence explanation of the contradiction, or empty string if none)
    """

    try:
        model = genai.GenerativeModel(model_name=MODEL_NAME)
        response = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                temperature=0.0
            )
        )
        
        import json
        result = json.loads(response.text)
        return {
            "contradiction_found": bool(result.get("contradiction_found", False)),
            "summary": result.get("summary", "")
        }
    except Exception as e:
        logger.error(f"Error checking contradictions: {e}")
        return {"contradiction_found": False, "summary": ""}
