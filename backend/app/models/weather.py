from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from ..db import Base

class WeatherData(Base):
    __tablename__ = "weather_data"

    id = Column(Integer, primary_key=True, index=True)
    location = Column(String(255))
    district = Column(String(100))
    state = Column(String(100))
    temperature = Column(Float)
    humidity = Column(Float)
    wind_speed = Column(Float)
    precipitation = Column(Float)
    forecast = Column(JSON)  # Stores 7-day forecast data
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class WeatherAlert(Base):
    __tablename__ = "weather_alerts"

    id = Column(Integer, primary_key=True, index=True)
    alert_type = Column(String(50))  # heavy_rain, drought, frost, etc.
    severity = Column(String(20))  # low, medium, high, critical
    message = Column(Text)
    message_marathi = Column(Text, nullable=True)
    location = Column(String(255))
    district = Column(String(100))
    state = Column(String(100))
    start_time = Column(DateTime)
    end_time = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
class UserWeatherPreference(Base):
    __tablename__ = "user_weather_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    location = Column(String(255))
    alert_types = Column(JSON)  # Array of alert types the user wants to receive
    notification_method = Column(String(20))  # sms, push, email, all
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User")