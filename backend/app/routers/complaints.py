from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

from ..db import get_db
from ..models.complaint import Complaint, ComplaintUpdate, ComplaintStatus, ComplaintPriority
from ..models.user import User
from .user import get_current_user

router = APIRouter(
    prefix="/complaints",
    tags=["complaints"],
    responses={404: {"description": "Not found"}},
)

# Pydantic models
class ComplaintBase(BaseModel):
    title: str
    description: str
    category: str
    location: str

class ComplaintCreate(ComplaintBase):
    pass

class ComplaintUpdateRequest(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None
    assigned_to: Optional[int] = None

class ComplaintUpdateCommentCreate(BaseModel):
    comment: str
    status_change: Optional[str] = None

class ComplaintUpdateResponse(BaseModel):
    id: int
    complaint_id: int
    user_id: int
    comment: str
    status_change: Optional[str] = None
    created_at: datetime
    
    class Config:
        orm_mode = True

class ComplaintResponse(ComplaintBase):
    id: int
    status: str
    priority: str
    user_id: int
    assigned_to: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    updates: List[ComplaintUpdateResponse] = []
    
    class Config:
        orm_mode = True

# Routes
@router.post("/", response_model=ComplaintResponse)
def create_complaint(
    complaint: ComplaintCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_complaint = Complaint(
        title=complaint.title,
        description=complaint.description,
        category=complaint.category,
        location=complaint.location,
        user_id=current_user.id
    )
    db.add(db_complaint)
    db.commit()
    db.refresh(db_complaint)
    return db_complaint

@router.get("/", response_model=List[ComplaintResponse])
def read_complaints(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Complaint)
    
    # Filter based on user role
    if current_user.role == "farmer":
        # Farmers can only see their own complaints
        query = query.filter(Complaint.user_id == current_user.id)
    elif current_user.role == "officer":
        # Officers can see complaints assigned to them or unassigned
        query = query.filter((Complaint.assigned_to == current_user.id) | 
                            (Complaint.assigned_to == None))
    
    # Apply filters
    if status:
        query = query.filter(Complaint.status == status)
    if category:
        query = query.filter(Complaint.category == category)
    
    complaints = query.order_by(Complaint.created_at.desc()).offset(skip).limit(limit).all()
    return complaints

@router.get("/{complaint_id}", response_model=ComplaintResponse)
def read_complaint(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if complaint is None:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    # Check if user has permission to view this complaint
    if current_user.role == "farmer" and complaint.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this complaint")
    
    return complaint

@router.put("/{complaint_id}", response_model=ComplaintResponse)
def update_complaint(
    complaint_id: int,
    complaint_update: ComplaintUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only officers can update complaint status, priority, or assignment
    if current_user.role != "officer":
        raise HTTPException(status_code=403, detail="Only officers can update complaints")
    
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if complaint is None:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    # Update fields
    for key, value in complaint_update.dict(exclude_unset=True).items():
        setattr(complaint, key, value)
    
    complaint.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(complaint)
    return complaint

@router.post("/{complaint_id}/comments", response_model=ComplaintUpdateResponse)
def add_complaint_comment(
    complaint_id: int,
    comment: ComplaintUpdateCommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if complaint is None:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    # Check if user has permission to comment on this complaint
    if current_user.role == "farmer" and complaint.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to comment on this complaint")
    
    # Create comment
    db_comment = ComplaintUpdate(
        complaint_id=complaint_id,
        user_id=current_user.id,
        comment=comment.comment,
        status_change=comment.status_change
    )
    
    # If status is being changed, update the complaint status
    if comment.status_change:
        complaint.status = comment.status_change
        complaint.updated_at = datetime.utcnow()
    
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment