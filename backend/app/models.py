from pydantic import BaseModel
from typing import Dict, Any  # Allow any type of response

class DynamicFormSubmission(BaseModel):
    responses: Dict[str, Any]  # Accept strings, numbers, anything
