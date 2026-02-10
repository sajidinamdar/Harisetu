from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, Enum, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from ..db import Base
import enum

class ProductCategory(str, enum.Enum):
    SEEDS = "seeds"
    FERTILIZERS = "fertilizers"
    PESTICIDES = "pesticides"
    TOOLS = "tools"
    MACHINERY = "machinery"
    PRODUCE = "produce"
    OTHER = "other"

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    description = Column(Text)
    category = Column(String(50))
    price = Column(Float)
    quantity = Column(Float)
    unit = Column(String(20))  # kg, g, piece, etc.
    location = Column(String(255))
    images = Column(JSON, nullable=True)  # Store as JSON array
    seller_id = Column(String(50), ForeignKey("users.id"))
    is_active = Column(Boolean, default=True)
    has_subsidy = Column(Boolean, default=False)
    subsidy_details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    seller = relationship("User")
    
class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    buyer_id = Column(String(50), ForeignKey("users.id"))
    total_amount = Column(Float)
    status = Column(String(20))  # pending, confirmed, shipped, delivered, cancelled
    shipping_address = Column(Text)
    contact_phone = Column(String(20))
    payment_method = Column(String(50))
    payment_status = Column(String(20))  # pending, completed, failed
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    buyer = relationship("User")
    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Float)
    unit_price = Column(Float)
    total_price = Column(Float)
    
    # Relationships
    order = relationship("Order", back_populates="items")
    product = relationship("Product")