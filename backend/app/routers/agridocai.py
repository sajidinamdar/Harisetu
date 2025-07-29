# routers/agridocai.py
from fastapi import APIRouter, File, UploadFile, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid
import os
import shutil
from datetime import datetime
from typing import List, Optional

from ..db import get_db
from ..models.agridocai import AgriDocument, DocumentAnalysis
from ..services.agridocai_service import analyze_document_content

router = APIRouter(
    prefix="/agridocai",
    tags=["AgriDocAI"],
    responses={404: {"description": "Not found"}},
)

# Create upload directory if it doesn't exist
UPLOAD_DIR = "uploads/agridocai"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/analyze", response_model=dict)
async def analyze_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload and analyze an agricultural document (PDF, image, or docx).
    Returns analysis including summary and keywords.
    """
    # Validate file type
    allowed_extensions = ['.pdf', '.jpg', '.jpeg', '.png', '.docx', '.doc']
    
    # Check if filename exists
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No filename provided"
        )
    
    file_ext = os.path.splitext(file.filename)[1].lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"File type not supported. Allowed types: {', '.join(allowed_extensions)}"
        )
    
    # Generate unique file ID and path
    file_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}{file_ext}")
    
    # Save uploaded file
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save file: {str(e)}"
        )
    
    # In a real implementation, this would call an actual document analysis service
    # For now, we'll use a dummy analysis based on file type
    
    # Dummy analysis (in production, replace with actual AI analysis)
    analysis = {
        "file_name": file.filename,
        "file_id": file_id,
        "file_path": file_path,
        "file_type": file_ext[1:],  # Remove the dot
        "upload_date": datetime.now().isoformat(),
        "summary": "This document appears to contain details about organic pesticide usage and subsidy eligibility.",
        "keywords": ["Organic", "Pesticide", "Subsidy", "Eligibility"],
        "recommendations": [
            "Check eligibility criteria for organic farming subsidies",
            "Verify pesticide certification requirements",
            "Submit application before deadline"
        ]
    }
    
    # In a real implementation, save document and analysis to database
    # new_doc = Document(
    #     file_id=file_id,
    #     filename=file.filename,
    #     file_path=file_path,
    #     file_type=file_ext[1:],
    #     upload_date=datetime.now()
    # )
    # db.add(new_doc)
    # db.commit()
    # db.refresh(new_doc)
    
    return {"analysis": analysis}

@router.get("/documents", response_model=List[dict])
async def get_documents(db: Session = Depends(get_db)):
    """
    Get a list of all analyzed documents.
    """
    # In a real implementation, fetch from database
    # documents = db.query(Document).all()
    
    # Dummy response for now
    documents = [
        {
            "file_id": "123e4567-e89b-12d3-a456-426614174000",
            "filename": "subsidy_guidelines.pdf",
            "file_type": "pdf",
            "upload_date": "2023-06-15T10:30:00",
            "summary": "Guidelines for organic farming subsidies"
        }
    ]
    
    return documents

@router.get("/documents/{file_id}", response_model=dict)
async def get_document(file_id: str, db: Session = Depends(get_db)):
    """
    Get details of a specific document by ID.
    """
    # In a real implementation, fetch from database
    # document = db.query(Document).filter(Document.file_id == file_id).first()
    # if not document:
    #     raise HTTPException(status_code=404, detail="Document not found")
    
    # Dummy response for now
    document = {
        "file_id": file_id,
        "filename": "subsidy_guidelines.pdf",
        "file_type": "pdf",
        "upload_date": "2023-06-15T10:30:00",
        "summary": "Guidelines for organic farming subsidies",
        "keywords": ["Organic", "Subsidy", "Guidelines", "Eligibility"],
        "recommendations": [
            "Check eligibility criteria for organic farming subsidies",
            "Submit application before deadline"
        ]
    }
    
    return document