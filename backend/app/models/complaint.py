from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from ..db import Base
import enum

class ComplaintStatus(str, enum.Enum):
    PENDING = "pending"
    ASSIGNED = "assigned"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"

class ComplaintPriority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    description = Column(Text)
    category = Column(String(100))
    location = Column(String(255))
    status = Column(String(20), default=ComplaintStatus.PENDING)
    priority = Column(String(20), default=ComplaintPriority.MEDIUM)
    user_id = Column(Integer, ForeignKey("users.id"))
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", foreign_keys=[user_id], back_populates="complaints")
    officer = relationship("User", foreign_keys=[assigned_to])
    updates = relationship("ComplaintUpdate", back_populates="complaint")

class ComplaintUpdate(Base):
    __tablename__ = "complaint_updates"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    comment = Column(Text)
    status_change = Column(String(20), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    complaint = relationship("Complaint", back_populates="updates")
    user = relationship("User")