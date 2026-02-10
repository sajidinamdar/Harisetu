from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
import httpx
import os
from datetime import datetime, timedelta
import json

from ..db import get_db
from ..models.user import User
from .user import get_current_user

router = APIRouter(
    prefix="/weather",
    tags=["weather"],
    responses={404: {"description": "Not found"}},
)

# Pydantic models
from pydantic import BaseModel

class WeatherData(BaseModel):
    date: str
    temperature: float
    feels_like: float
    temp_min: float
    temp_max: float
    pressure: int
    humidity: int
    weather_main: str
    weather_description: str
    wind_speed: float
    wind_direction: int
    clouds: int
    rain_1h: Optional[float] = None
    rain_3h: Optional[float] = None
    icon: str

class WeatherForecast(BaseModel):
    city: str
    state: Optional[str] = None
    country: str
    lat: float
    lon: float
    current: WeatherData
    hourly: List[WeatherData]
    daily: List[WeatherData]
    agricultural_advice: Dict[str, Any]

class LocationRequest(BaseModel):
    lat: float
    lon: float

class CityRequest(BaseModel):
    city: str
    state: Optional[str] = None
    country: Optional[str] = "IN"

# Mock API key - in a real app, this would be stored in environment variables
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY", "mock_api_key")
WEATHER_API_URL = "https://api.openweathermap.org/data/2.5"

# Helper function to get weather data from OpenWeatherMap API
async def get_weather_data(lat: float, lon: float):
    """
    Fetch live weather data from OpenWeatherMap API.
    """
    async with httpx.AsyncClient() as client:
        # Get onecall data (current, hourly, daily)
        # Note: OpenWeatherMap One Call 3.0 requires a subscription, 
        # but 2.5 is often still used. We'll use 2.5/onecall if possible, 
        # or separate calls if One Call 3.0 is not available.
        # Given the API key provided, we'll try to use the One Call 1.0/2.5 or 3.0 endpoint.
        
        try:
            # Try One Call 3.0 (most modern)
            response = await client.get(
                "https://api.openweathermap.org/data/3.0/onecall",
                params={
                    "lat": lat,
                    "lon": lon,
                    "exclude": "minutely",
                    "units": "metric",
                    "appid": WEATHER_API_KEY
                }
            )
            
            if response.status_code != 200:
                # Fallback to 2.5 if 3.0 fails (often due to subscription differences)
                response = await client.get(
                    "https://api.openweathermap.org/data/2.5/onecall",
                    params={
                        "lat": lat,
                        "lon": lon,
                        "exclude": "minutely",
                        "units": "metric",
                        "appid": WEATHER_API_KEY
                    }
                )
            
            if response.status_code != 200:
                # If both One Call versions fail, we could try getting current weather + forecast separately,
                # but for this implementation we'll assume one of the One Call versions works or raise the error.
                error_detail = response.json().get("message", "Unknown error")
                raise HTTPException(status_code=response.status_code, detail=f"OpenWeatherMap API error: {error_detail}")
            
            data = response.json()
            
            # Extract and format the data to match our pydantic models
            # Current
            current_raw = data.get("current", {})
            current = {
                "date": datetime.fromtimestamp(current_raw.get("dt")).isoformat(),
                "temperature": current_raw.get("temp"),
                "feels_like": current_raw.get("feels_like"),
                "temp_min": current_raw.get("temp"),  # OneCall current doesn't have min/max
                "temp_max": current_raw.get("temp"),
                "pressure": current_raw.get("pressure"),
                "humidity": current_raw.get("humidity"),
                "weather_main": current_raw.get("weather")[0].get("main"),
                "weather_description": current_raw.get("weather")[0].get("description"),
                "wind_speed": current_raw.get("wind_speed"),
                "wind_direction": current_raw.get("wind_deg"),
                "clouds": current_raw.get("clouds"),
                "rain_1h": current_raw.get("rain", {}).get("1h"),
                "icon": current_raw.get("weather")[0].get("icon")
            }
            
            # Hourly (next 24 hours)
            hourly = []
            for h in data.get("hourly", [])[:24]:
                hourly.append({
                    "date": datetime.fromtimestamp(h.get("dt")).isoformat(),
                    "temperature": h.get("temp"),
                    "feels_like": h.get("feels_like"),
                    "temp_min": h.get("temp"),
                    "temp_max": h.get("temp"),
                    "pressure": h.get("pressure"),
                    "humidity": h.get("humidity"),
                    "weather_main": h.get("weather")[0].get("main"),
                    "weather_description": h.get("weather")[0].get("description"),
                    "wind_speed": h.get("wind_speed"),
                    "wind_direction": h.get("wind_deg"),
                    "clouds": h.get("clouds"),
                    "rain_1h": h.get("rain", {}).get("1h"),
                    "icon": h.get("weather")[0].get("icon")
                })
            
            # Daily (next 7 days)
            daily = []
            for d in data.get("daily", [])[:7]:
                temp = d.get("temp", {})
                daily.append({
                    "date": datetime.fromtimestamp(d.get("dt")).isoformat(),
                    "temperature": temp.get("day"),
                    "feels_like": d.get("feels_like", {}).get("day"),
                    "temp_min": temp.get("min"),
                    "temp_max": temp.get("max"),
                    "pressure": d.get("pressure"),
                    "humidity": d.get("humidity"),
                    "weather_main": d.get("weather")[0].get("main"),
                    "weather_description": d.get("weather")[0].get("description"),
                    "wind_speed": d.get("wind_speed"),
                    "wind_direction": d.get("wind_deg"),
                    "clouds": d.get("clouds"),
                    "rain_1h": d.get("rain"), # Daily rain is often just 'rain' or 'snow'
                    "icon": d.get("weather")[0].get("icon")
                })
            
            # Generate agricultural advice based on live weather
            agricultural_advice = generate_agricultural_advice(current, daily)
            
            # Get city name from coordinates (OpenWeatherMap doesn't provide it in One Call)
            # For simplicity, we'll keep the placeholders or return coordinates
            return {
                "city": "Coordinates Location",
                "state": None,
                "country": "IN",
                "lat": lat,
                "lon": lon,
                "current": current,
                "hourly": hourly,
                "daily": daily,
                "agricultural_advice": agricultural_advice
            }
            
        except Exception as e:
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(status_code=500, detail=f"Unexpected error fetching weather data: {str(e)}")

def generate_agricultural_advice(current: Dict[str, Any], daily: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Generate agricultural advice based on weather conditions"""
    
    # Check for rain in the forecast
    rain_days = [day for day in daily if day.get("rain_1h")]
    has_rain = len(rain_days) > 0
    
    # Check temperature trends
    avg_temp = sum(day["temperature"] for day in daily) / len(daily)
    high_temp = max(day["temp_max"] for day in daily)
    
    # Generate advice
    general_advice = []
    crop_specific = {}
    alerts = []
    
    # Temperature-based advice
    if high_temp > 35:
        general_advice.append("High temperatures expected. Ensure adequate irrigation for crops.")
        alerts.append({
            "type": "high_temperature",
            "message": "Temperatures above 35°C expected. Take precautions to protect sensitive crops."
        })
    
    # Rain-based advice
    if has_rain:
        rain_dates = [day["date"].split("T")[0] for day in rain_days]
        general_advice.append(f"Rain expected on {', '.join(rain_dates)}. Plan field activities accordingly.")
        
        if any(day.get("rain_1h", 0) > 3.0 for day in rain_days):
            alerts.append({
                "type": "heavy_rain",
                "message": "Heavy rainfall expected. Ensure proper drainage in fields."
            })
    else:
        general_advice.append("No significant rainfall expected in the next 7 days. Plan irrigation accordingly.")
    
    # Wind-based advice
    if any(day["wind_speed"] > 5.0 for day in daily):
        general_advice.append("Strong winds expected. Secure any structures and consider wind protection for young plants.")
    
    # Crop-specific advice (simplified for demo)
    crop_specific = {
        "rice": [
            "Maintain water level in paddy fields" if has_rain else "Ensure regular irrigation",
            "Watch for pest activity in humid conditions" if current["humidity"] > 70 else "Monitor for water stress"
        ],
        "wheat": [
            "Ensure proper drainage during rain" if has_rain else "Provide irrigation as needed",
            "High temperatures may accelerate growth" if avg_temp > 30 else "Growth may be optimal at current temperatures"
        ],
        "cotton": [
            "Protect from heavy rain" if has_rain else "Regular irrigation recommended",
            "Watch for bollworm activity in current conditions"
        ],
        "vegetables": [
            "Protect leafy vegetables from heavy rain" if has_rain else "Regular watering recommended",
            "Consider shade for sensitive vegetables during peak temperatures"
        ]
    }
    
    # Planting recommendations
    if 25 <= avg_temp <= 32 and not has_rain:
        planting_recommendations = ["okra", "cucumber", "pumpkin", "watermelon"]
    elif has_rain and 20 <= avg_temp <= 30:
        planting_recommendations = ["rice", "maize", "soybean"]
    else:
        planting_recommendations = ["wait for more suitable conditions"]
    
    return {
        "general_advice": general_advice,
        "crop_specific": crop_specific,
        "alerts": alerts,
        "planting_recommendations": planting_recommendations
    }

# Routes
@router.get("/forecast/coordinates", response_model=WeatherForecast)
async def get_weather_by_coordinates(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude"),
    current_user: User = Depends(get_current_user)
):
    """Get weather forecast by coordinates"""
    try:
        weather_data = await get_weather_data(lat, lon)
        return weather_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching weather data: {str(e)}")

@router.post("/forecast/coordinates", response_model=WeatherForecast)
async def post_weather_by_coordinates(
    location: LocationRequest,
    current_user: User = Depends(get_current_user)
):
    """Get weather forecast by coordinates (POST method)"""
    try:
        weather_data = await get_weather_data(location.lat, location.lon)
        return weather_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching weather data: {str(e)}")

@router.post("/forecast/city", response_model=WeatherForecast)
async def get_weather_by_city(
    city_request: CityRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Get weather forecast by city name.
    In a real implementation, this would geocode the city name to coordinates.
    For this demo, we'll use fixed coordinates for any city.
    """
    try:
        # In a real app, you would geocode the city name to get coordinates
        # For demo purposes, we'll use fixed coordinates
        lat = 19.0760
        lon = 72.8777
        
        weather_data = await get_weather_data(lat, lon)
        
        # Update city information
        weather_data["city"] = city_request.city
        weather_data["state"] = city_request.state
        weather_data["country"] = city_request.country
        
        return weather_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching weather data: {str(e)}")

@router.get("/crop-recommendations", response_model=Dict[str, List[str]])
async def get_crop_recommendations(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude"),
    current_user: User = Depends(get_current_user)
):
    """Get crop planting recommendations based on weather forecast"""
    try:
        weather_data = await get_weather_data(lat, lon)
        
        # Extract just the recommendations part
        return {
            "recommendations": weather_data["agricultural_advice"]["planting_recommendations"],
            "general_advice": weather_data["agricultural_advice"]["general_advice"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching crop recommendations: {str(e)}")

@router.get("/alerts", response_model=List[Dict[str, Any]])
async def get_weather_alerts(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude"),
    current_user: User = Depends(get_current_user)
):
    """Get weather alerts for a location"""
    try:
        weather_data = await get_weather_data(lat, lon)
        return weather_data["agricultural_advice"]["alerts"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching weather alerts: {str(e)}")