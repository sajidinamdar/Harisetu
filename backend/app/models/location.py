from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from ..db import Base

class AgriService(Base):
    __tablename__ = "agri_services"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    name_marathi = Column(String(255), nullable=True)
    service_type = Column(String(50))  # vet, fertilizer_shop, irrigation, bank, etc.
    description = Column(Text, nullable=True)
    description_marathi = Column(Text, nullable=True)
    address = Column(String(255))
    district = Column(String(100))
    state = Column(String(100))
    latitude = Column(Float)
    longitude = Column(Float)
    contact_phone = Column(String(20), nullable=True)
    contact_email = Column(String(100), nullable=True)
    website = Column(String(255), nullable=True)
    opening_hours = Column(String(100), nullable=True)
    services_offered = Column(JSON, nullable=True)  # Store as JSON array
    image_urls = Column(JSON, nullable=True)  # Store as JSON array
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ServiceReview(Base):
    __tablename__ = "service_reviews"

    id = Column(Integer, primary_key=True, index=True)
    service_id = Column(Integer, ForeignKey("agri_services.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    rating = Column(Integer)  # 1-5
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    service = relationship("AgriService")
    user = relationship("User")