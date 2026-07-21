import logging
import json
import re
from typing import List, Dict, Any, Optional
import google.generativeai as genai
from app.core.config import settings
from app.agents.tools import search_documents, query_graph
from app.agents.contradiction import check_contradictions

logger = logging.getLogger(__name__)

genai.configure(api_key=settings.GEMINI_API_KEY)
MODEL_NAME = "gemini-2.5-flash"

SYSTEM_INSTRUCTION = """
You are the OnBrain Copilot, an AI assistant for Industrial Knowledge Intelligence.
You help engineers and technicians diagnose issues, find procedures, and understand equipment.
You must base your answers ONLY on the provided retrieved context.
When you state a fact from the context, you MUST include an inline citation formatted as [doc_id:page_number].
For example: "The pump requires 5W-30 oil [doc_123:2]."
If the provided context does not contain enough information to answer the question, clearly state:
"I don't have enough source coverage to answer this confidently."
Do NOT guess or hallucinate information.
"""

def extract_equipment_tags(query: str) -> List[str]:
    matches = re.findall(r'[A-Z]{1,4}-\d{3,4}[A-Z]?', query)
    return list(set(matches))

def calculate_confidence(search_results: List[Dict[str, Any]]) -> float:
    if not search_results:
        return 0.0
    scores = [res.get('relevance_score', 0.0) for res in search_results]
    avg_score = sum(scores) / len(scores)
    unique_docs = len(set([res.get('doc_id') for res in search_results]))
    confidence = avg_score
    if unique_docs > 1:
        confidence = min(1.0, confidence + 0.1)
    return round(confidence, 4)

class CopilotAgent:
    def __init__(self):
        self.model = genai.GenerativeModel(
            model_name=MODEL_NAME,
            system_instruction=SYSTEM_INSTRUCTION,
            generation_config=genai.GenerationConfig(temperature=0.2)
        )

    async def process_query_stream(self, query: str, history: List[Dict[str, str]] = None):
        """
        Processes a user query and yields dictionaries representing SSE events.
        """
        search_results = search_documents(query, limit=5)
        
        tags = extract_equipment_tags(query)
        graph_results = []
        for tag in tags:
            graph_data = query_graph(tag)
            if "error" not in graph_data:
                graph_results.append(graph_data)
                
        confidence = calculate_confidence(search_results)
        
        if confidence < 0.5 and not graph_results:
            yield {
                "type": "meta",
                "confidence": confidence,
                "citations": [],
                "contradiction_flag": False,
                "contradiction_summary": ""
            }
            yield {"type": "token", "text": "I don't have enough source coverage to answer this confidently."}
            return
            
        contradiction_flag = False
        contradiction_summary = ""
        if len(search_results) > 1:
            contradict_res = check_contradictions(query, search_results)
            contradiction_flag = contradict_res.get("contradiction_found", False)
            contradiction_summary = contradict_res.get("summary", "")

        context_parts = []
        citations_metadata = {}
        
        if search_results:
            context_parts.append("--- Document Search Results ---")
            for res in search_results:
                doc_ref = f"{res['doc_id']}:{res['page_number']}"
                citations_metadata[doc_ref] = {
                    "doc_id": res['doc_id'],
                    "page_number": res['page_number'],
                    "source_filename": res['source_filename']
                }
                context_parts.append(f"[{doc_ref}] (File: {res['source_filename']}): {res['text']}")
                
        if graph_results:
            context_parts.append("\n--- Knowledge Graph Context ---")
            for gr in graph_results:
                context_parts.append(json.dumps(gr, indent=2))
                
        if contradiction_flag:
            context_parts.append(f"\n--- Important Note --- \n{contradiction_summary}")
            
        context_str = "\n".join(context_parts)
        prompt = f"User Query: {query}\n\nContext:\n{context_str}\n\nPlease provide a clear answer with inline citations."
        
        yield {
            "type": "meta",
            "confidence": confidence,
            "citations": list(citations_metadata.values()),
            "contradiction_flag": contradiction_flag,
            "contradiction_summary": contradiction_summary
        }
        
        chat = self.model.start_chat(history=self._format_history(history))
        response = await chat.send_message_async(prompt, stream=True)
        async for chunk in response:
            if chunk.text:
                yield {"type": "token", "text": chunk.text}
                
    def _format_history(self, history: List[Dict[str, str]]) -> List[Dict[str, str]]:
        if not history:
            return []
        formatted = []
        for msg in history:
            role = "user" if msg["role"] == "user" else "model"
            formatted.append({"role": role, "parts": [msg["content"]]})
        return formatted
