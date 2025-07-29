# models/agridocai.py
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from ..db import Base

class AgriDocument(Base):
    """
    Model for storing uploaded agricultural documents.
    """
    __tablename__ = "agridocai_documents"
    
    id = Column(Integer, primary_key=True, index=True)
    file_id = Column(String(36), unique=True, index=True, default=lambda: str(uuid.uuid4()))
    filename = Column(String(255), nullable=False)
    file_path = Column(String(255), nullable=False)
    file_type = Column(String(20), nullable=False)  # pdf, jpg, png, docx, etc.
    upload_date = Column(DateTime, default=datetime.now)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="agri_documents")
    analysis = relationship("DocumentAnalysis", back_populates="document", uselist=False)

class DocumentAnalysis(Base):
    """
    Model for storing AI analysis of agricultural documents.
    """
    __tablename__ = "agridocai_analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("agridocai_documents.id"), unique=True)
    summary = Column(Text, nullable=True)
    keywords = Column(JSON, nullable=True)  # Store as JSON array
    recommendations = Column(JSON, nullable=True)  # Store as JSON array
    analysis_date = Column(DateTime, default=datetime.now)
    language = Column(String(10), default="en")
    
    # Relationships
    document = relationship("AgriDocument", back_populates="analysis")