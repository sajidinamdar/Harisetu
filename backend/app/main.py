from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from typing import List, Optional
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize database
from .db import engine, Base
from .init_db import init_db

# Create tables and initialize with demo data
Base.metadata.create_all(bind=engine)
init_db()

app = FastAPI(
    title="HaritSetu API",
    description="Backend API for HaritSetu - A smart, AI-integrated platform for farmers",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "Welcome to HaritSetu API",
        "status": "active",
        "version": "0.1.0",
        "modules": [
            "User Management",
            "KrushiBazaar",
            "HaritSetu Chat",
            "AgroAlert",
            "AgriScan",
            "AgriConnect",
            "Grievance360",
            "AgriDocAI",
            "Kisan Mitra",
            "Marathi AI Tutor",
            "WeatherGuard"
        ]
    }

# Import and include routers
from .routers import user, agriconnect, agriscan, complaints
app.include_router(user.router)
app.include_router(agriconnect.router)
app.include_router(agriscan.router)
app.include_router(complaints.router)

# Add weather router
from .routers import weather
app.include_router(weather.router)

# Add AgriDocAI router
from .routers import agridocai
app.include_router(agridocai.router)

# Add Kisan Mitra router
from .routers import kisan_mitra
app.include_router(kisan_mitra.router)

# These will be uncommented as we implement each module
# from .routers import chat, ai_modules
# app.include_router(chat.router)
# app.include_router(ai_modules.router)

if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)