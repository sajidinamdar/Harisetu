from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from ..db import Base

class CropDisease(Base):
    __tablename__ = "crop_diseases"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    name_marathi = Column(String(255), nullable=True)
    crop_type = Column(String(100))
    symptoms = Column(Text)
    symptoms_marathi = Column(Text, nullable=True)
    treatment = Column(Text)
    treatment_marathi = Column(Text, nullable=True)
    prevention = Column(Text)
    prevention_marathi = Column(Text, nullable=True)
    image_urls = Column(JSON, nullable=True)  # Store as JSON array
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class DiseaseDetection(Base):
    __tablename__ = "disease_detections"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(50), ForeignKey("users.id"))
    image_url = Column(String(255))
    crop_type = Column(String(100), nullable=True)
    detected_disease_id = Column(Integer, ForeignKey("crop_diseases.id"), nullable=True)
    confidence_score = Column(Float, nullable=True)
    additional_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User")
    disease = relationship("CropDisease")