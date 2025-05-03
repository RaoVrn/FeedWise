from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any
import os
from dotenv import load_dotenv
import google.generativeai as genai
import motor.motor_asyncio
from datetime import datetime
import logging

# --- Load environment variables ---
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not MONGO_URI or not GEMINI_API_KEY:
    raise Exception("Environment variables MONGO_URI and GEMINI_API_KEY must be set.")

# --- MongoDB Setup ---
mongo_client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
db = mongo_client["feedwise_db"]
form_submissions_collection = db["form_submissions"]

# --- Gemini AI Setup ---
genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel('gemini-1.5-flash-latest')

# --- FastAPI App Initialization ---
app = FastAPI()

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Setup Logger ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("feedwise_logger")

# --- Pydantic Models ---
class DynamicFormSubmission(BaseModel):
    responses: Dict[str, Any]  # Accept any type of values (text, number, etc.)

# --- Helper Functions ---
async def analyze_sentiment(text: str) -> str:
    prompt = f"Classify the sentiment of this feedback:\n'{text}'\nReply only with Positive, Negative, or Neutral."
    try:
        response = gemini_model.generate_content(prompt)
        if response and response.text:
            sentiment = response.text.strip().lower()
            if sentiment in {"positive", "negative", "neutral"}:
                return sentiment
    except Exception as e:
        logger.error(f"Gemini Sentiment Analysis Error: {e}")
    return "neutral"

async def generate_summary(text: str) -> str:
    prompt = f"Summarize the user's form submission in 1-2 lines:\n{text}"
    try:
        response = gemini_model.generate_content(prompt)
        if response and response.text:
            return response.text.strip()
    except Exception as e:
        logger.error(f"Gemini Summary Generation Error: {e}")
    return ""

# --- Webhook Receiver ---
@app.post("/webhook/{form_id}")
async def receive_webhook(form_id: str, submission: DynamicFormSubmission):
    try:
        if not submission.responses:
            raise HTTPException(status_code=400, detail="No responses received.")

        # --- FIX: Convert all types (number, boolean) into clean text ---
        combined_text = "\n".join(f"{k}: {str(v)}" for k, v in submission.responses.items())

        sentiment = await analyze_sentiment(combined_text)
        summary = await generate_summary(combined_text)

        record = {
            "form_id": form_id,
            "responses": submission.responses,  # Keep original dynamic responses
            "sentiment": sentiment,
            "summary": summary,
            "created_at": datetime.utcnow()
        }

        result = await form_submissions_collection.insert_one(record)

        logger.info(f"New submission inserted with ID: {result.inserted_id}")

        return {
            "message": "Submission received successfully.",
            "id": str(result.inserted_id),
            "sentiment": sentiment,
            "summary": summary
        }

    except Exception as e:
        logger.error(f"Webhook Error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error.")

# --- Fetch Feedback for a Form ---
@app.get("/feedback/{form_id}")
async def get_feedback_for_form(form_id: str):
    try:
        feedbacks = []
        cursor = form_submissions_collection.find({"form_id": form_id}).sort("_id", -1)

        async for doc in cursor:
            feedbacks.append({
                "id": str(doc["_id"]),
                "responses": doc.get("responses", {}),
                "sentiment": doc.get("sentiment", "unknown"),
                "summary": doc.get("summary", ""),
                "created_at": doc.get("created_at")
            })

        return feedbacks

    except Exception as e:
        logger.error(f"Fetch Feedback Error: {e}")
        raise HTTPException(status_code=500, detail="Error fetching feedbacks.")
