from pydantic import BaseModel
from typing import Dict, Any, Optional

class DynamicFormSubmission(BaseModel):
    responses: Dict[str, Any]  # Accept strings, numbers, anything

class FeedbackResponse(BaseModel):
    id: str
    responses: Dict[str, Any]
    sentiment: str
    sentiment_analysis: str  # Full Gemini response for sentiment
    summary: str
    detailed_analysis: str  # Full Gemini response for analysis
    created_at: Dict[str, Any]  # For datetime serialization
