# models/kisan_mitra.py
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime

from ..db import Base

class FarmerQuery(Base):
    """
    Model for storing farmer questions and AI responses.
    """
    __tablename__ = "kisan_mitra_queries"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    question = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    language = Column(String(10), default="en")
    timestamp = Column(DateTime, default=datetime.now)
    location = Column(String(255), nullable=True)
    crop_type = Column(String(100), nullable=True)
    related_topics = Column(JSON, nullable=True)  # Store as JSON array
    
    # Relationships
    user = relationship("User", back_populates="queries")

class FAQ(Base):
    """
    Model for storing frequently asked questions.
    """
    __tablename__ = "kisan_mitra_faqs"
    
    id = Column(Integer, primary_key=True, index=True)
    question_en = Column(Text, nullable=False)
    question_mr = Column(Text, nullable=False)
    answer_en = Column(Text, nullable=False)
    answer_mr = Column(Text, nullable=False)
    category = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)