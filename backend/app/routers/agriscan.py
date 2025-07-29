from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form, BackgroundTasks
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import shutil
import uuid
from datetime import datetime
import numpy as np
from PIL import Image
import io
import base64

from ..db import get_db, SessionLocal
from ..models.disease_detection import CropDisease, DiseaseDetection
from ..models.user import User
from .user import get_current_user

router = APIRouter(
    prefix="/agriscan",
    tags=["agriscan"],
    responses={404: {"description": "Not found"}},
)

# Pydantic models
from pydantic import BaseModel, Field

class DiseaseBase(BaseModel):
    name: str
    name_marathi: Optional[str] = None
    crop_type: str
    symptoms: str
    symptoms_marathi: Optional[str] = None
    treatment: str
    treatment_marathi: Optional[str] = None
    prevention: str
    prevention_marathi: Optional[str] = None
    image_urls: Optional[List[str]] = None

class DiseaseCreate(DiseaseBase):
    pass

class DiseaseResponse(DiseaseBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class DetectionBase(BaseModel):
    crop_type: Optional[str] = None
    additional_notes: Optional[str] = None

class DetectionCreate(DetectionBase):
    image_url: str

class DetectionResponse(DetectionBase):
    id: int
    user_id: int
    image_url: str
    detected_disease_id: Optional[int] = None
    confidence_score: Optional[float] = None
    created_at: datetime
    disease: Optional[DiseaseResponse] = None

    class Config:
        from_attributes = True

class DetectionResult(BaseModel):
    detection_id: int
    disease: Optional[DiseaseResponse] = None
    confidence_score: Optional[float] = None
    message: str

# Mock AI model for disease detection
# In a real implementation, this would use a trained ML model
def detect_disease(image_path: str, crop_type: Optional[str] = None, db: Optional[Session] = None):
    """
    Mock function to simulate disease detection using AI.
    In a real implementation, this would use a trained ML model.
    """
    # For demo purposes, randomly select a disease from the database
    # or return None to simulate no disease detected
    import random
    
    if db:
        query = db.query(CropDisease)
        if crop_type:
            query = query.filter(CropDisease.crop_type == crop_type)
        
        diseases = query.all()
        
        if diseases:
            # 80% chance to detect a disease, 20% chance to find nothing
            if random.random() < 0.8:
                disease = random.choice(diseases)
                confidence = random.uniform(0.6, 0.98)
                return disease.id, confidence
    
    # No disease detected or no diseases in database
    return None, None

# Helper function to save uploaded image
async def save_upload_file(upload_file: UploadFile, folder: str = "uploads"):
    # Create folder if it doesn't exist
    os.makedirs(folder, exist_ok=True)
    
    # Generate unique filename
    # Handle case where filename might be None
    if upload_file.filename:
        file_extension = os.path.splitext(upload_file.filename)[1]
    else:
        # Default to .jpg if no filename is provided
        file_extension = ".jpg"
    
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(folder, unique_filename)
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
    
    return file_path, f"/uploads/{unique_filename}"

# Routes
@router.post("/diseases/", response_model=DiseaseResponse)
def create_disease(
    disease: DiseaseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only officers and experts can add diseases
    if current_user.role not in ["officer", "expert"]:
        raise HTTPException(status_code=403, detail="Not authorized to add diseases")
    
    # Use model_dump() for newer Pydantic versions, fallback to dict() for older versions
    try:
        disease_data = disease.model_dump()
    except AttributeError:
        disease_data = disease.dict()
    
    db_disease = CropDisease(**disease_data)
    db.add(db_disease)
    db.commit()
    db.refresh(db_disease)
    return db_disease

@router.get("/diseases/", response_model=List[DiseaseResponse])
def get_diseases(
    skip: int = 0,
    limit: int = 100,
    crop_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(CropDisease)
    
    if crop_type:
        query = query.filter(CropDisease.crop_type == crop_type)
    
    diseases = query.offset(skip).limit(limit).all()
    return diseases

@router.get("/diseases/{disease_id}", response_model=DiseaseResponse)
def get_disease(
    disease_id: int,
    db: Session = Depends(get_db)
):
    disease = db.query(CropDisease).filter(CropDisease.id == disease_id).first()
    
    if not disease:
        raise HTTPException(status_code=404, detail="Disease not found")
    
    return disease

@router.post("/detect/", response_model=DetectionResult)
async def detect_crop_disease(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    crop_type: Optional[str] = Form(None),
    notes: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Validate file type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Please upload an image."
        )
    
    try:
        # Save uploaded image
        file_path, file_url = await save_upload_file(file, folder="uploads")
        
        # Create detection record
        db_detection = DiseaseDetection(
            user_id=current_user.id,
            image_url=file_url,
            crop_type=crop_type,
            additional_notes=notes
        )
        db.add(db_detection)
        db.commit()
        db.refresh(db_detection)
        
        # Run disease detection in background
        # In a real app, this would be a more complex ML task
        # Get the actual integer value from the SQLAlchemy model instance
        detection_id_int = db_detection.id
        background_tasks.add_task(process_detection, detection_id_int, file_path, crop_type, db)
        
        return {
            "detection_id": detection_id_int,
            "disease": None,
            "confidence_score": None,
            "message": "Image uploaded successfully. Processing has started."
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred during file upload: {str(e)}"
        )

def process_detection(detection_id: int, image_path: str, crop_type: Optional[str], db: Session):
    """
    Process the detection in the background.
    In a real app, this would call a machine learning model.
    """
    db_session = SessionLocal()
    try:
        # Get the detection record
        detection = db_session.query(DiseaseDetection).filter(DiseaseDetection.id == detection_id).first()
        
        if not detection:
            return
        
        # Run disease detection
        disease_id, confidence = detect_disease(image_path, crop_type, db_session)
        
        # Update detection record with results
        # Handle the case where disease_id might be None
        detection.detected_disease_id = disease_id  # SQLAlchemy will handle None values correctly
        detection.confidence_score = confidence  # SQLAlchemy will handle None values correctly
        
        db_session.commit()
    
    except Exception as e:
        print(f"Error processing detection {detection_id}: {str(e)}")
    
    finally:
        db_session.close()

@router.get("/detections/", response_model=List[DetectionResponse])
def get_user_detections(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    detections = db.query(DiseaseDetection).filter(
        DiseaseDetection.user_id == current_user.id
    ).order_by(DiseaseDetection.created_at.desc()).offset(skip).limit(limit).all()
    
    return detections

@router.get("/detections/{detection_id}", response_model=DetectionResponse)
def get_detection(
    detection_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    detection = db.query(DiseaseDetection).filter(
        DiseaseDetection.id == detection_id
    ).first()
    
    if not detection:
        raise HTTPException(status_code=404, detail="Detection not found")
    
    # Check if user owns this detection or is an officer/expert
    if int(detection.user_id) != int(current_user.id) and current_user.role not in ["officer", "expert"]:
        raise HTTPException(status_code=403, detail="Not authorized to view this detection")
    
    return detection

@router.get("/crop-types", response_model=List[str])
def get_crop_types():
    # Return predefined crop types
    return [
        "rice",
        "wheat",
        "cotton",
        "sugarcane",
        "pulses",
        "vegetables",
        "fruits",
        "maize",
        "soybean",
        "groundnut"
    ]

# SessionLocal is now imported at the top of the file