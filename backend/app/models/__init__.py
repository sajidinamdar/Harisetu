from .document import Document, DocumentTemplate, DocumentType
from .complaint import Complaint, ComplaintUpdate, ComplaintStatus, ComplaintPriority
from .marketplace import Product, Order, OrderItem, ProductCategory
from .chat import ChatSession, ChatMessage, ChatType
from .weather import WeatherData, WeatherAlert, UserWeatherPreference
from .disease_detection import CropDisease, DiseaseDetection
from .education import Course, Lesson, Quiz, QuizQuestion, UserProgress
from .location import AgriService, ServiceReview
from .agridocai import AgriDocument, DocumentAnalysis
from .kisan_mitra import FarmerQuery, FAQ
from .user import User

# Import Base from db to create all tables
from ..db import Base, engine

# Create all tables
def create_tables():
    Base.metadata.create_all(bind=engine)