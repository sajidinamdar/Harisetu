from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from ..db import Base

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    title_marathi = Column(String(255), nullable=True)
    description = Column(Text)
    description_marathi = Column(Text, nullable=True)
    category = Column(String(50))  # digital_literacy, agriculture, legal, financial
    difficulty_level = Column(String(20))  # beginner, intermediate, advanced
    image_url = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    lessons = relationship("Lesson", back_populates="course")

class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    title = Column(String(255))
    title_marathi = Column(String(255), nullable=True)
    content = Column(Text)
    content_marathi = Column(Text, nullable=True)
    order = Column(Integer)
    video_url = Column(String(255), nullable=True)
    audio_url = Column(String(255), nullable=True)
    image_urls = Column(JSON, nullable=True)  # Store as JSON array
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    course = relationship("Course", back_populates="lessons")
    quiz = relationship("Quiz", back_populates="lesson", uselist=False)

class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    title = Column(String(255))
    title_marathi = Column(String(255), nullable=True)
    passing_score = Column(Integer, default=70)  # Percentage
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    lesson = relationship("Lesson", back_populates="quiz")
    questions = relationship("QuizQuestion", back_populates="quiz")

class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"))
    question = Column(Text)
    question_marathi = Column(Text, nullable=True)
    options = Column(JSON)  # Array of options
    options_marathi = Column(JSON, nullable=True)
    correct_answer = Column(Integer)  # Index of the correct option
    explanation = Column(Text, nullable=True)
    explanation_marathi = Column(Text, nullable=True)
    
    # Relationships
    quiz = relationship("Quiz", back_populates="questions")

class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    completed_lessons = Column(JSON, default="{}")  # Store as JSON array
    completed_quizzes = Column(JSON, default="{}")  # Store as JSON array
    quiz_scores = Column(JSON, default={})  # Map of quiz_id to score
    last_activity = Column(DateTime, default=datetime.utcnow)
    is_completed = Column(Boolean, default=False)
    completion_date = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User")
    course = relationship("Course")