from fastapi import APIRouter, Depends, HTTPException, status, Query, File, UploadFile
from sqlalchemy.orm import Session
from typing import List, Optional
from geopy.distance import geodesic
import os
from datetime import datetime

from ..db import get_db
from ..models.location import AgriService, ServiceReview
from ..models.user import User
from .user import get_current_user

router = APIRouter(
    prefix="/agriconnect",
    tags=["agriconnect"],
    responses={404: {"description": "Not found"}},
)

# Pydantic models
from pydantic import BaseModel, Field, EmailStr

class ServiceBase(BaseModel):
    name: str
    name_marathi: Optional[str] = None
    service_type: str
    description: Optional[str] = None
    description_marathi: Optional[str] = None
    address: str
    district: str
    state: str
    latitude: float
    longitude: float
    contact_phone: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    website: Optional[str] = None
    opening_hours: Optional[str] = None
    services_offered: Optional[List[str]] = None
    image_urls: Optional[List[str]] = None

class ServiceCreate(ServiceBase):
    pass

class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    name_marathi: Optional[str] = None
    service_type: Optional[str] = None
    description: Optional[str] = None
    description_marathi: Optional[str] = None
    address: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    website: Optional[str] = None
    opening_hours: Optional[str] = None
    services_offered: Optional[List[str]] = None
    image_urls: Optional[List[str]] = None
    is_verified: Optional[bool] = None
    is_active: Optional[bool] = None

class ServiceResponse(ServiceBase):
    id: int
    is_verified: bool
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ReviewBase(BaseModel):
    service_id: int
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None

class ReviewCreate(ReviewBase):
    pass

class ReviewResponse(ReviewBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class ServiceWithReviews(ServiceResponse):
    reviews: List[ReviewResponse] = []
    average_rating: Optional[float] = None

# Routes
@router.post("/services/", response_model=ServiceResponse)
def create_service(
    service: ServiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only officers and experts can add services directly
    if current_user.role not in ["officer", "expert"] and current_user.verified is not True:
        # If a farmer is adding a service, mark it as unverified
        is_verified = False
    else:
        is_verified = True
    
    db_service = AgriService(
        **service.model_dump(),
        is_verified=is_verified
    )
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service

@router.get("/services/", response_model=List[ServiceResponse])
def get_services(
    skip: int = 0,
    limit: int = 100,
    service_type: Optional[str] = None,
    district: Optional[str] = None,
    verified_only: bool = False,
    db: Session = Depends(get_db)
):
    query = db.query(AgriService)
    
    if service_type:
        query = query.filter(AgriService.service_type == service_type)
    
    if district:
        query = query.filter(AgriService.district == district)
    
    if verified_only:
        query = query.filter(AgriService.is_verified == True)
    
    query = query.filter(AgriService.is_active == True)
    
    services = query.offset(skip).limit(limit).all()
    return services

@router.get("/services/nearby", response_model=List[ServiceResponse])
def get_nearby_services(
    latitude: float = Query(..., description="User's current latitude"),
    longitude: float = Query(..., description="User's current longitude"),
    radius: float = Query(10.0, description="Search radius in kilometers"),
    service_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    # Get all services (we'll filter by distance later)
    query = db.query(AgriService).filter(AgriService.is_active == True)
    
    if service_type:
        query = query.filter(AgriService.service_type == service_type)
    
    all_services = query.all()
    
    # Filter services by distance
    user_location = (latitude, longitude)
    nearby_services = []
    
    for service in all_services:
        # Ensure we're working with Python float values, not SQLAlchemy Column objects
        service_lat = float(service.latitude) if service.latitude is not None else 0.0
        service_lng = float(service.longitude) if service.longitude is not None else 0.0
        service_location = (service_lat, service_lng)
        
        distance = geodesic(user_location, service_location).kilometers
        
        if distance <= radius:
            nearby_services.append(service)
    
    return nearby_services

@router.get("/services/{service_id}", response_model=ServiceWithReviews)
def get_service(service_id: int, db: Session = Depends(get_db)):
    service = db.query(AgriService).filter(AgriService.id == service_id).first()
    
    if service is None:
        raise HTTPException(status_code=404, detail="Service not found")
    
    # Get reviews for this service
    reviews = db.query(ServiceReview).filter(ServiceReview.service_id == service_id).all()
    
    # Calculate average rating
    if len(reviews) > 0:
        average_rating = float(sum(review.rating for review in reviews) / len(reviews))
    else:
        average_rating = None
    
    # Create response with reviews and average rating
    response = ServiceWithReviews.from_orm(service)
    response.reviews = [ReviewResponse.from_orm(review) for review in reviews]
    response.average_rating = average_rating
    
    return response

@router.put("/services/{service_id}", response_model=ServiceResponse)
def update_service(
    service_id: int,
    service_update: ServiceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_service = db.query(AgriService).filter(AgriService.id == service_id).first()
    
    if db_service is None:
        raise HTTPException(status_code=404, detail="Service not found")
    
    # Only officers and verified experts can update services
    if current_user.role not in ["officer", "expert"] and current_user.verified is not True:
        raise HTTPException(status_code=403, detail="Not authorized to update services")
    
    # Update service attributes
    for key, value in service_update.model_dump(exclude_unset=True).items():
        setattr(db_service, key, value)
    
    db.commit()
    db.refresh(db_service)
    return db_service

@router.delete("/services/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_service(
    service_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only officers can delete services
    if current_user.role != "officer":
        raise HTTPException(status_code=403, detail="Not authorized to delete services")
    
    db_service = db.query(AgriService).filter(AgriService.id == service_id).first()
    
    if db_service is None:
        raise HTTPException(status_code=404, detail="Service not found")
    
    # Soft delete by setting is_active to False
    setattr(db_service, "is_active", False)
    db.commit()
    
    return {"status": "success"}

@router.post("/reviews/", response_model=ReviewResponse)
def create_review(
    review: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if service exists
    service = db.query(AgriService).filter(AgriService.id == review.service_id).first()
    if service is None:
        raise HTTPException(status_code=404, detail="Service not found")
    
    # Check if user already reviewed this service
    existing_review = db.query(ServiceReview).filter(
        ServiceReview.service_id == review.service_id,
        ServiceReview.user_id == current_user.id
    ).first()
    
    if existing_review is not None:
        raise HTTPException(status_code=400, detail="You have already reviewed this service")
    
    # Create new review
    db_review = ServiceReview(
        **review.model_dump(),
        user_id=current_user.id
    )
    
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    
    return db_review

@router.get("/reviews/service/{service_id}", response_model=List[ReviewResponse])
def get_service_reviews(
    service_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    # Check if service exists
    service = db.query(AgriService).filter(AgriService.id == service_id).first()
    if service is None:
        raise HTTPException(status_code=404, detail="Service not found")
    
    reviews = db.query(ServiceReview).filter(
        ServiceReview.service_id == service_id
    ).offset(skip).limit(limit).all()
    
    return reviews

@router.get("/service-types", response_model=List[str])
def get_service_types():
    # Return predefined service types
    return [
        "veterinary",
        "fertilizer_shop",
        "seed_shop",
        "irrigation_service",
        "equipment_rental",
        "agricultural_bank",
        "government_office",
        "cooperative_society",
        "cold_storage",
        "processing_unit",
        "market_yard"
    ]