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
    In a real implementation, this would call the OpenWeatherMap API.
    For this demo, we'll return mock data.
    """
    # For demo purposes, we'll return mock data
    # In a real app, you would make an API call like:
    # async with httpx.AsyncClient() as client:
    #     response = await client.get(
    #         f"{WEATHER_API_URL}/onecall",
    #         params={
    #             "lat": lat,
    #             "lon": lon,
    #             "exclude": "minutely",
    #             "units": "metric",
    #             "appid": WEATHER_API_KEY
    #         }
    #     )
    #     if response.status_code != 200:
    #         raise HTTPException(status_code=response.status_code, detail="Weather API error")
    #     return response.json()
    
    # Mock data for demonstration
    current_date = datetime.now()
    
    # Generate mock current weather
    current = {
        "date": current_date.isoformat(),
        "temperature": 28.5,
        "feels_like": 30.2,
        "temp_min": 26.8,
        "temp_max": 31.2,
        "pressure": 1012,
        "humidity": 65,
        "weather_main": "Clear",
        "weather_description": "clear sky",
        "wind_speed": 3.5,
        "wind_direction": 120,
        "clouds": 10,
        "icon": "01d"
    }
    
    # Generate mock hourly forecast (24 hours)
    hourly = []
    for i in range(24):
        hour_date = current_date + timedelta(hours=i)
        temp = 28.5 + (5 * (0.5 - (i % 24) / 24))  # Temperature variation
        
        # Add some rain in the afternoon
        rain_1h = None
        if 13 <= i <= 16:
            rain_1h = 0.5 + (i - 13) * 0.2
        
        hourly.append({
            "date": hour_date.isoformat(),
            "temperature": temp,
            "feels_like": temp + 1.5,
            "temp_min": temp - 1.0,
            "temp_max": temp + 1.0,
            "pressure": 1012 - (i % 5),
            "humidity": 65 + (i % 20),
            "weather_main": "Rain" if rain_1h else "Clear",
            "weather_description": "light rain" if rain_1h else "clear sky",
            "wind_speed": 3.5 + (i % 3),
            "wind_direction": 120 + (i * 5) % 360,
            "clouds": 10 + (i * 3) % 90,
            "rain_1h": rain_1h,
            "icon": "10d" if rain_1h else "01d"
        })
    
    # Generate mock daily forecast (7 days)
    daily = []
    for i in range(7):
        day_date = current_date + timedelta(days=i)
        temp = 28.5 + (3 * (0.5 - (i % 7) / 7))  # Temperature variation
        
        # Add some rain on days 2 and 5
        rain_1h = None
        weather_main = "Clear"
        weather_desc = "clear sky"
        icon = "01d"
        
        if i == 2 or i == 5:
            rain_1h = 2.5 if i == 2 else 5.0
            weather_main = "Rain"
            weather_desc = "moderate rain" if i == 2 else "heavy rain"
            icon = "10d"
        
        daily.append({
            "date": day_date.isoformat(),
            "temperature": temp,
            "feels_like": temp + 1.5,
            "temp_min": temp - 2.0,
            "temp_max": temp + 2.0,
            "pressure": 1012 - (i % 5),
            "humidity": 65 + (i % 20),
            "weather_main": weather_main,
            "weather_description": weather_desc,
            "wind_speed": 3.5 + (i % 3),
            "wind_direction": 120 + (i * 10) % 360,
            "clouds": 10 + (i * 10) % 90,
            "rain_1h": rain_1h,
            "icon": icon
        })
    
    # Generate agricultural advice based on weather
    agricultural_advice = generate_agricultural_advice(current, daily)
    
    return {
        "city": "Sample City",
        "state": "Maharashtra",
        "country": "IN",
        "lat": lat,
        "lon": lon,
        "current": current,
        "hourly": hourly,
        "daily": daily,
        "agricultural_advice": agricultural_advice
    }

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