import logging
import google.generativeai as genai
from app.core.config import settings

logger = logging.getLogger(__name__)

def analyze_chat_image(image_bytes: bytes, mime_type: str) -> str:
    """
    Sends the uploaded image to Gemini to extract content / understand the image.
    Uses the configured GEMINI_API_KEY from settings.
    """
    try:
        api_key = settings.GEMINI_API_KEY
        if not api_key or api_key.startswith("your_"):
            raise ValueError("GEMINI_API_KEY is not configured or invalid.")

        genai.configure(api_key=api_key)
        
        # Use gemini-1.5-flash which is standard and supports multimodal input
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        prompt = (
            "You are an expert industrial engineering AI assistant. Analyze this uploaded image. "
            "1. Extract all readable text from it.\n"
            "2. Identify any industrial equipment tags mentioned or shown (e.g. P-101A, E-302, XV-104).\n"
            "3. Describe any visible damage, failures, actions, work orders, or process steps shown.\n"
            "4. Summarize what this image is and its significance.\n\n"
            "Provide your final output as a clear, well-structured, descriptive textual report. "
            "Use clear headings, markdown list items, and standard entity formats so our ingestion pipeline "
            "can build a knowledge graph from this report."
        )
        
        # Pass image data inside the required raw dictionary format for genai sdk
        response = model.generate_content([
            {
                "mime_type": mime_type,
                "data": image_bytes
            },
            prompt
        ])
        
        if not response.text:
            raise ValueError("Gemini returned an empty text response for the image.")
            
        return response.text.strip()
    except Exception as e:
        logger.error(f"Failed to analyze chat image with Gemini: {e}")
        raise e
