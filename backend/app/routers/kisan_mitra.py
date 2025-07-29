# routers/kisan_mitra.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from ..db import get_db
from ..services.language_service import translate_text

router = APIRouter(
    prefix="/kisan-mitra",
    tags=["Kisan Mitra"],
    responses={404: {"description": "Not found"}},
)

# User query model
class AdviceRequest(BaseModel):
    question: str
    language: str = "en"  # or 'mr' for Marathi
    user_id: Optional[int] = None
    location: Optional[str] = None
    crop_type: Optional[str] = None

class AdviceResponse(BaseModel):
    question: str
    response: str
    language: str
    timestamp: datetime
    related_topics: List[str] = []

# Dictionary of common agricultural questions and answers
COMMON_QUESTIONS = {
    "water": {
        "en": "Water your crops regularly, preferably in the early morning or evening. Ensure proper drainage to prevent waterlogging.",
        "mr": "आपल्या पिकांना नियमितपणे पाणी द्या, विशेषतः सकाळी लवकर किंवा संध्याकाळी. पाणी साचणे टाळण्यासाठी योग्य निचरा सुनिश्चित करा."
    },
    "fertilizer": {
        "en": "Use balanced NPK fertilizers based on soil testing results. Apply organic fertilizers for sustainable farming.",
        "mr": "मातीच्या चाचणी निकालांवर आधारित संतुलित NPK खते वापरा. शाश्वत शेतीसाठी सेंद्रिय खते वापरा."
    },
    "pest": {
        "en": "Implement Integrated Pest Management (IPM). Use neem-based pesticides for organic control. Monitor fields regularly.",
        "mr": "एकात्मिक कीड व्यवस्थापन (IPM) अंमलात आणा. सेंद्रिय नियंत्रणासाठी निंबोळी आधारित कीटकनाशके वापरा. शेतांचे नियमितपणे निरीक्षण करा."
    },
    "crop": {
        "en": "Choose crops suitable for your region's climate and soil type. Practice crop rotation to maintain soil health.",
        "mr": "आपल्या प्रदेशाच्या हवामान आणि माती प्रकारासाठी योग्य पिके निवडा. मातीचे आरोग्य टिकवण्यासाठी पीक फेरपालट करा."
    },
    "weather": {
        "en": "Stay updated with weather forecasts. Prepare for extreme weather conditions by implementing protective measures.",
        "mr": "हवामान अंदाजांसह अद्ययावत रहा. संरक्षणात्मक उपाय अंमलात आणून अत्यंत हवामान परिस्थितीसाठी तयार रहा."
    }
}

@router.post("/ask", response_model=AdviceResponse)
async def get_advice(req: AdviceRequest, db: Session = Depends(get_db)):
    """
    Get agricultural advice based on the farmer's question.
    Supports both English and Marathi languages.
    """
    question = req.question.lower()
    lang = req.language
    
    # In a real implementation, this would use NLP to understand the question
    # and generate a contextually relevant response
    
    # Simple keyword matching for demo purposes
    response = ""
    related_topics = []
    
    # Check for keywords in the question
    if any(word in question for word in ["water", "irrigation", "rain", "पाणी", "सिंचन"]):
        response = COMMON_QUESTIONS["water"][lang]
        related_topics = ["irrigation", "water conservation", "drainage"]
    
    elif any(word in question for word in ["fertilizer", "nutrient", "खत", "पोषक"]):
        response = COMMON_QUESTIONS["fertilizer"][lang]
        related_topics = ["organic farming", "soil health", "composting"]
    
    elif any(word in question for word in ["pest", "insect", "disease", "कीड", "रोग"]):
        response = COMMON_QUESTIONS["pest"][lang]
        related_topics = ["organic pesticides", "crop diseases", "beneficial insects"]
    
    elif any(word in question for word in ["crop", "plant", "seed", "पीक", "बियाणे"]):
        response = COMMON_QUESTIONS["crop"][lang]
        related_topics = ["crop selection", "seed treatment", "crop rotation"]
    
    elif any(word in question for word in ["weather", "climate", "rain", "हवामान", "पाऊस"]):
        response = COMMON_QUESTIONS["weather"][lang]
        related_topics = ["weather forecasting", "climate adaptation", "seasonal planning"]
    
    else:
        # Default response if no keywords match
        if lang == "mr":
            response = f"तुमचा प्रश्न: '{question}' – ह्याबद्दल पुढील सल्ला घ्या: पाणी वेळेवर द्या आणि योग्य खते वापरा."
        else:
            response = f"Your question: '{question}' – Suggested advice: Water the crops timely and use recommended fertilizers."
        related_topics = ["general farming", "best practices"]
    
    # In a real implementation, log the question and response to the database
    # new_query = FarmerQuery(
    #     user_id=req.user_id,
    #     question=question,
    #     response=response,
    #     language=lang,
    #     timestamp=datetime.now(),
    #     location=req.location,
    #     crop_type=req.crop_type
    # )
    # db.add(new_query)
    # db.commit()
    
    return {
        "question": question,
        "response": response,
        "language": lang,
        "timestamp": datetime.now(),
        "related_topics": related_topics
    }

@router.get("/faq", response_model=List[dict])
async def get_faqs(language: str = "en"):
    """
    Get a list of frequently asked questions and answers.
    """
    faqs = [
        {
            "question": "How often should I water my crops?" if language == "en" else "मी माझ्या पिकांना किती वेळा पाणी द्यावे?",
            "answer": COMMON_QUESTIONS["water"][language],
            "category": "Irrigation" if language == "en" else "सिंचन"
        },
        {
            "question": "What fertilizers should I use?" if language == "en" else "मी कोणती खते वापरावीत?",
            "answer": COMMON_QUESTIONS["fertilizer"][language],
            "category": "Soil Health" if language == "en" else "माती आरोग्य"
        },
        {
            "question": "How do I control pests organically?" if language == "en" else "मी सेंद्रिय पद्धतीने कीड कशी नियंत्रित करू?",
            "answer": COMMON_QUESTIONS["pest"][language],
            "category": "Pest Management" if language == "en" else "कीड व्यवस्थापन"
        },
        {
            "question": "Which crops are suitable for my region?" if language == "en" else "माझ्या प्रदेशासाठी कोणती पिके योग्य आहेत?",
            "answer": COMMON_QUESTIONS["crop"][language],
            "category": "Crop Selection" if language == "en" else "पीक निवड"
        },
        {
            "question": "How can I prepare for monsoon season?" if language == "en" else "मी पावसाळ्यासाठी कशी तयारी करू शकतो?",
            "answer": COMMON_QUESTIONS["weather"][language],
            "category": "Weather Preparation" if language == "en" else "हवामान तयारी"
        }
    ]
    
    return faqs