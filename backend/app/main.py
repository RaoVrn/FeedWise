from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import google.generativeai as genai
import motor.motor_asyncio
from datetime import datetime

# --- Load environment variables ---
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# --- MongoDB Client Setup ---
mongo_client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
db = mongo_client["feedwise_db"]  # Database name
feedbacks_collection = db["feedbacks"]  # Collection name

# --- Gemini AI Setup ---
genai.configure(api_key=GEMINI_API_KEY)

# --- FastAPI App Initialization ---
app = FastAPI()

# --- CORS Middleware (Allow all origins for development) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Model ---
class Feedback(BaseModel):
    text: str

# --- Helper: Analyze Sentiment using Gemini ---
async def analyze_sentiment(text: str) -> str:
    prompt = f"Classify the sentiment of this feedback: '{text}'. Reply only Positive, Negative, or Neutral."
    models_to_try = ['gemini-1.5-flash-latest', 'gemini-1.5-pro-latest']

    for model_name in models_to_try:
        try:
            model = genai.GenerativeModel(model_name)
            response = model.generate_content(prompt)

            if response and response.text:
                sentiment_candidate = response.text.strip().lower()
                if sentiment_candidate in ["positive", "negative", "neutral"]:
                    return sentiment_candidate
                else:
                    print(f"Invalid sentiment from {model_name}: {sentiment_candidate}")
                    return "neutral"
        except Exception as e:
            print(f"Error with model {model_name}: {e}")
            continue  # Try next model
    
    print("All Gemini models failed, defaulting sentiment to neutral.")
    return "neutral"

# --- POST Feedback Endpoint ---
@app.post("/feedback")
async def submit_feedback(feedback: Feedback):
    try:
        if not feedback.text.strip():
            raise HTTPException(status_code=400, detail="Feedback text cannot be empty")

        # Analyze sentiment
        sentiment = await analyze_sentiment(feedback.text)

        # Insert into MongoDB
        result = await feedbacks_collection.insert_one({
            "text": feedback.text,
            "sentiment": sentiment,
            "created_at": datetime.utcnow()
        })

        return {
            "id": str(result.inserted_id),
            "text": feedback.text,
            "sentiment": sentiment
        }
    
    except HTTPException as http_ex:
        raise http_ex
    except Exception as e:
        print(f"Unexpected error in /feedback: {e}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred while processing your feedback")

# --- GET Feedbacks Endpoint ---
@app.get("/feedback")
async def get_feedback():
    try:
        feedbacks = []
        cursor = feedbacks_collection.find().sort("_id", -1)
        async for document in cursor:
            feedbacks.append({
                "id": str(document["_id"]),
                "text": document["text"],
                "sentiment": document.get("sentiment", "Unknown")
            })
        return feedbacks
    except Exception as e:
        print(f"Unexpected error in /feedback GET: {e}")
        raise HTTPException(status_code=500, detail="Server error while fetching feedbacks")
