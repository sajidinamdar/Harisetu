from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Table
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship
from datetime import datetime
import json
from ..db import Base, engine

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True)
    name = Column(String(255))
    phone = Column(String(20))
    hashed_password = Column(String(255))
    role = Column(String(50))  # 'farmer', 'officer', 'expert'
    village = Column(String(255), nullable=True)
    district = Column(String(255), nullable=True)
    # Store expertise as JSON string for SQLite compatibility
    _expertise = Column(String(1000), nullable=True, name="expertise")
    department = Column(String(255), nullable=True)
    verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    complaints = relationship("Complaint", foreign_keys="Complaint.user_id", back_populates="user", cascade="all, delete-orphan")
    agri_documents = relationship("AgriDocument", back_populates="user", cascade="all, delete-orphan")
    queries = relationship("FarmerQuery", back_populates="user", cascade="all, delete-orphan")
    
    @property
    def expertise(self):
        if self._expertise:
            return json.loads(self._expertise)
        return None
        
    @expertise.setter
    def expertise(self, value):
        if value:
            self._expertise = json.dumps(value)
        else:
            self._expertise = None

# Create all tables
Base.metadata.create_all(bind=engine)