from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
import os
from dotenv import load_dotenv
import google.generativeai as genai
import motor.motor_asyncio
from datetime import datetime, timedelta
import logging
from bson import ObjectId

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

# Create indexes for better performance
async def create_indexes():
    await form_submissions_collection.create_index([("form_id", 1)])
    await form_submissions_collection.create_index([("created_at", -1)])
    await form_submissions_collection.create_index([("sentiment", 1)])

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
    responses: Dict[str, Any]

class FeedbackResponse(BaseModel):
    id: str
    responses: Dict[str, Any]
    sentiment: str
    sentiment_analysis: str
    detailed_analysis: str
    summary: str
    created_at: datetime

class FeedbackStats(BaseModel):
    total: int
    sentiment_counts: dict
    recent_trends: list

# --- Helper Functions ---
async def analyze_sentiment(text: str) -> str:
    prompt = (
        "Analyze the sentiment of this feedback and choose one option:\n"
        f"Text: '{text}'\n"
        "Options: positive, negative, neutral\n"
        "Consider:\n"
        "- Positive: Clearly expressing satisfaction, praise, or optimism\n"
        "- Negative: Indicating dissatisfaction, criticism, or problems\n"
        "- Neutral: Factual, balanced, or unclear sentiment\n"
        "Reply with only one word: positive, negative, or neutral"
    )
    try:
        response = gemini_model.generate_content(prompt)
        if response and response.text:
            sentiment = response.text.strip().lower()
            if sentiment in {"positive", "negative", "neutral"}:
                return sentiment
            logger.warning(f"Unexpected sentiment value: {sentiment}")
    except Exception as e:
        logger.error(f"Gemini Sentiment Analysis Error: {e}")
    return "neutral"

async def analyze_sentiment_detailed(text: str) -> tuple[str, str]:
    prompt = (
        "Analyze the sentiment and explain why:\n"
        f"Text: '{text}'\n"
        "Provide your response in two parts:\n"
        "1. One word (positive/negative/neutral)\n"
        "2. A brief explanation of why you chose this sentiment\n"
        "Format: sentiment\nexplanation"
    )
    try:
        response = gemini_model.generate_content(prompt)
        if response and response.text:
            parts = response.text.strip().split('\n', 1)
            sentiment = parts[0].strip().lower()
            explanation = parts[1].strip() if len(parts) > 1 else ""
            if sentiment in {"positive", "negative", "neutral"}:
                return sentiment, explanation if explanation else "Analysis not available. The feedback was classified as " + sentiment + " based on its overall tone."
            logger.warning(f"Unexpected sentiment value: {sentiment}")
    except Exception as e:
        logger.error(f"Gemini Sentiment Analysis Error: {e}")
    return "neutral", "Unable to perform sentiment analysis. The feedback has been marked as neutral by default."

async def generate_summary(text: str) -> str:
    prompt = (
        "Summarize this feedback in one clear, concise sentence:\n"
        f"Feedback: {text}\n"
        "Rules:\n"
        "- Keep it under 100 characters\n"
        "- Preserve the main sentiment and key points\n"
        "- Use professional language"
    )
    try:
        response = gemini_model.generate_content(prompt)
        if response and response.text:
            summary = response.text.strip()
            return summary[:100] if len(summary) > 100 else summary
    except Exception as e:
        logger.error(f"Gemini Summary Generation Error: {e}")
    return text[:100] + "..." if len(text) > 100 else text

async def generate_detailed_analysis(text: str) -> str:
    prompt = (
        "Analyze this feedback and highlight key points:\n"
        f"Text: '{text}'\n"
        "Consider:\n"
        "- Main themes or topics mentioned\n"
        "- Specific issues or praise\n"
        "- Any actionable suggestions\n"
        "Provide a concise but informative analysis in this format:\n"
        "Key Points:\n"
        "Main Themes: [list the main themes]\n"
        "Specific Points: [list specific observations]\n"
        "Specific Issues: [list any issues mentioned]\n"
        "Actionable Suggestions: [list any actionable items]\n"
    )
    try:
        response = gemini_model.generate_content(prompt)
        if response and response.text:
            analysis = response.text.strip()
            # Remove markdown-style formatting
            analysis = analysis.replace('**', '')
            analysis = analysis.replace('*', '')
            return analysis if analysis else "A detailed analysis could not be generated, but the feedback has been recorded and categorized appropriately."
    except Exception as e:
        logger.error(f"Gemini Detailed Analysis Error: {e}")
    return "The feedback has been received, but automatic analysis is temporarily unavailable. The core message has been captured and categorized based on its overall tone."

def clean_mongo_doc(doc: dict) -> dict:
    """Clean MongoDB document for JSON serialization"""
    if doc.get("_id"):
        doc["id"] = str(doc.pop("_id"))
    # Convert datetime to ISO format string
    if doc.get("created_at"):
        doc["created_at"] = doc["created_at"].isoformat()
    return doc

# --- Webhook Receiver ---
@app.post("/webhook/{form_id}", response_model=FeedbackResponse)
async def receive_webhook(form_id: str, submission: DynamicFormSubmission):
    try:
        if not submission.responses:
            raise HTTPException(status_code=400, detail="No responses received")

        # Extract the main feedback text
        feedback_text = str(submission.responses.get("feedback", ""))
        if not feedback_text:
            # Try to find any text content in the responses
            feedback_text = " ".join(str(v) for v in submission.responses.values() if v)

        if not feedback_text:
            raise HTTPException(status_code=400, detail="No feedback text found in submission")

        # Analyze feedback
        sentiment, sentiment_analysis = await analyze_sentiment_detailed(feedback_text)
        summary = await generate_summary(feedback_text)
        detailed_analysis = await generate_detailed_analysis(feedback_text)

        # Prepare record
        now = datetime.utcnow()
        record = {
            "form_id": form_id,
            "responses": submission.responses,
            "sentiment": sentiment,
            "sentiment_analysis": sentiment_analysis,
            "detailed_analysis": detailed_analysis,
            "summary": summary,
            "created_at": now
        }

        result = await form_submissions_collection.insert_one(record)
        
        # Return processed feedback
        return FeedbackResponse(
            id=str(result.inserted_id),
            responses=submission.responses,
            sentiment=sentiment,
            sentiment_analysis=sentiment_analysis,
            detailed_analysis=detailed_analysis,
            summary=summary,
            created_at=now
        )

    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Webhook Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# --- Fetch Feedback for a Form ---
@app.get("/feedback/{form_id}")
async def get_feedback_for_form(form_id: str, 
                              search: Optional[str] = None,
                              sentiment: Optional[str] = None,
                              limit: int = 50):
    try:
        # Build query
        query = {"form_id": form_id}
        
        # Add sentiment filter if provided
        if sentiment and sentiment in ["positive", "negative", "neutral"]:
            query["sentiment"] = sentiment

        # Add text search if provided
        if search:
            search = search.lower()
            query["$or"] = [
                {"summary": {"$regex": search, "$options": "i"}},
                {"responses.feedback": {"$regex": search, "$options": "i"}}
            ]

        # Execute query
        cursor = form_submissions_collection.find(query)
        cursor = cursor.sort("created_at", -1).limit(limit)
        
        feedbacks = []
        async for doc in cursor:
            feedbacks.append(clean_mongo_doc(doc))

        return feedbacks

    except Exception as e:
        logger.error(f"Fetch Feedback Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching feedbacks: {str(e)}")

# --- New Stats Endpoint ---
@app.get("/feedback/{form_id}/stats")
async def get_feedback_stats(form_id: str):
    try:
        # Get total count
        total = await form_submissions_collection.count_documents({"form_id": form_id})
        
        # Get sentiment counts
        pipeline = [
            {"$match": {"form_id": form_id}},
            {"$group": {
                "_id": "$sentiment",
                "count": {"$sum": 1}
            }}
        ]
        sentiment_counts = {}
        async for doc in form_submissions_collection.aggregate(pipeline):
            sentiment_counts[doc["_id"]] = doc["count"]
            
        # Get recent trends (last 7 days)
        seven_days_ago = datetime.utcnow() - timedelta(days=7)
        pipeline = [
            {"$match": {
                "form_id": form_id,
                "created_at": {"$gte": seven_days_ago}
            }},
            {"$group": {
                "_id": {
                    "date": {"$dateToString": {"format": "%Y-%m-%d", "date": "$created_at"}},
                    "sentiment": "$sentiment"
                },
                "count": {"$sum": 1}
            }},
            {"$sort": {"_id.date": 1}}
        ]
        trends = []
        async for doc in form_submissions_collection.aggregate(pipeline):
            trends.append({
                "date": doc["_id"]["date"],
                "sentiment": doc["_id"]["sentiment"],
                "count": doc["count"]
            })
            
        return FeedbackStats(
            total=total,
            sentiment_counts=sentiment_counts,
            recent_trends=trends
        )
        
    except Exception as e:
        logger.error(f"Stats Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching statistics: {str(e)}")

# --- Global Stats Endpoint ---
@app.get("/global-stats")
async def get_global_stats():
    try:
        # Get total number of unique forms
        forms = len(await form_submissions_collection.distinct("form_id"))
        
        # Get total number of responses
        responses = await form_submissions_collection.count_documents({})
        
        # Calculate satisfaction percentage (positive responses)
        positive_responses = await form_submissions_collection.count_documents({"sentiment": "positive"})
        satisfaction = round((positive_responses / responses * 100) if responses > 0 else 0)
        
        return {
            "forms": forms,
            "responses": responses,
            "satisfaction": satisfaction
        }
        
    except Exception as e:
        logger.error(f"Global Stats Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching global statistics: {str(e)}")

# --- Startup Event ---
@app.on_event("startup")
async def startup_event():
    await create_indexes()
