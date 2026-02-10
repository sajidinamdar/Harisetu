from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, JSON, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from ..db import Base
import enum

class DocumentType(str, enum.Enum):
    SUBSIDY_APPLICATION = "subsidy_application"
    CROP_LOSS_REPORT = "crop_loss_report"
    LOAN_APPLICATION = "loan_application"
    INSURANCE_CLAIM = "insurance_claim"
    LAND_RECORD = "land_record"
    OTHER = "other"

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(50), ForeignKey("users.id"))
    title = Column(String(255))
    document_type = Column(String(50))
    content = Column(Text)
    content_marathi = Column(Text, nullable=True)
    doc_metadata = Column(JSON, nullable=True, name="metadata")  # Additional data used to generate the document
    file_url = Column(String(255), nullable=True)  # URL to the generated PDF
    is_draft = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User")

class DocumentTemplate(Base):
    __tablename__ = "document_templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    document_type = Column(String(50))
    template_content = Column(Text)
    template_content_marathi = Column(Text, nullable=True)
    required_fields = Column(JSON)  # List of fields that need to be filled
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)