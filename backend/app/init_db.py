from sqlalchemy.orm import Session
from .db import SessionLocal, engine, Base
from .models.user import User
from .models.complaint import Complaint, ComplaintUpdate
from .models.disease_detection import CropDisease
from passlib.context import CryptContext
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create all tables
Base.metadata.create_all(bind=engine)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def init_db():
    db = SessionLocal()
    try:
        # Check if we already have users
        user_count = db.query(User).count()
        if user_count == 0:
            print("Creating demo users...")
            
            # Create demo farmer
            farmer = User(
                email="farmer@demo.com",
                name="राम पाटील",
                phone="+91-9876543210",
                hashed_password=get_password_hash("demo123"),
                role="farmer",
                village="पुणे",
                district="पुणे",
                expertise=None,
                department=None,
                verified=True
            )
            db.add(farmer)
            
            # Create demo officer
            officer = User(
                email="officer@demo.com",
                name="Dr. Priya Sharma",
                phone="+91-9876543211",
                hashed_password=get_password_hash("demo123"),
                role="officer",
                village=None,
                district="पुणे",
                expertise=None,
                department="Agriculture Department",
                verified=True
            )
            db.add(officer)
            
            # Create demo expert
            expert = User(
                email="expert@demo.com",
                name="Prof. Suresh Kumar",
                phone="+91-9876543212",
                hashed_password=get_password_hash("demo123"),
                role="expert",
                village=None,
                district=None,
                expertise=["Crop Disease", "Soil Management"],
                department="Agricultural University",
                verified=True
            )
            db.add(expert)
            
            db.commit()
            print("Demo users created successfully!")
            
            # Create some sample complaints
            print("Creating sample complaints...")
            
            complaint1 = Complaint(
                title="Water shortage in irrigation canal",
                description="The irrigation canal in our village has been dry for the past week. We need urgent assistance.",
                category="Irrigation",
                location="पुणे",
                status="pending",
                priority="high",
                user_id=1  # Farmer
            )
            db.add(complaint1)
            
            complaint2 = Complaint(
                title="Pest infestation in wheat crop",
                description="My wheat crop is showing signs of pest infestation. Need guidance on pesticide application.",
                category="Pest Control",
                location="पुणे",
                status="assigned",
                priority="medium",
                user_id=1,  # Farmer
                assigned_to=3  # Expert
            )
            db.add(complaint2)
            
            db.commit()
            
            # Add updates to the second complaint
            update1 = ComplaintUpdate(
                complaint_id=2,
                user_id=3,  # Expert
                comment="I've reviewed your case. Please send some pictures of the affected crop for better diagnosis.",
                status_change="assigned"
            )
            db.add(update1)
            
            db.commit()
            print("Sample complaints created successfully!")
            
            # Create sample crop diseases for AgriScan
            print("Creating sample crop diseases...")
            
            disease1 = CropDisease(
                name="Leaf Blast",
                name_marathi="पान करपा",
                crop_type="rice",
                symptoms="Diamond-shaped lesions with gray centers and brown borders. Lesions can enlarge and kill entire leaves.",
                symptoms_marathi="हिरे आकाराचे घाव ज्यांचे मध्य भाग राखाडी आणि किनारी तपकिरी असतात. घाव वाढू शकतात आणि संपूर्ण पाने मारू शकतात.",
                treatment="Apply fungicides containing tricyclazole, propiconazole, or azoxystrobin. Ensure proper spacing between plants for good air circulation.",
                treatment_marathi="ट्रायसायक्लाझोल, प्रोपिकोनाझोल, किंवा अझोक्सिस्ट्रोबिन असलेली बुरशीनाशके वापरा. चांगल्या हवेच्या संचारासाठी रोपांमध्ये योग्य अंतर ठेवा.",
                prevention="Use resistant varieties. Avoid excessive nitrogen fertilization. Maintain field sanitation by removing crop debris.",
                prevention_marathi="प्रतिरोधक वाण वापरा. अतिरिक्त नायट्रोजन खतांचा वापर टाळा. पीक अवशेष काढून टाकून शेताची स्वच्छता राखा.",
                image_urls=["https://www.plantix.net/en/library/plant-diseases/100001/rice-blast"]
            )
            db.add(disease1)
            
            disease2 = CropDisease(
                name="Powdery Mildew",
                name_marathi="भुरी",
                crop_type="wheat",
                symptoms="White, powdery patches on leaves, stems, and heads. Affected tissues may turn yellow and die.",
                symptoms_marathi="पाने, खोड आणि कणसांवर पांढरे, भुरकट डाग. प्रभावित ऊती पिवळ्या होऊन मरू शकतात.",
                treatment="Apply sulfur-based fungicides or products containing tebuconazole. Treat early when symptoms first appear.",
                treatment_marathi="सल्फर-आधारित बुरशीनाशके किंवा टेब्युकोनाझोल असलेले उत्पादने वापरा. लक्षणे प्रथम दिसताच लवकर उपचार करा.",
                prevention="Plant resistant varieties. Avoid dense planting. Rotate crops with non-susceptible plants.",
                prevention_marathi="प्रतिरोधक वाण लावा. दाट लागवड टाळा. असंवेदनशील वनस्पतींसह पिके फिरवा.",
                image_urls=["https://www.plantix.net/en/library/plant-diseases/100057/powdery-mildew-of-cereals"]
            )
            db.add(disease2)
            
            disease3 = CropDisease(
                name="Bacterial Leaf Blight",
                name_marathi="करपा",
                crop_type="rice",
                symptoms="Water-soaked lesions on leaf margins that turn yellow and then grayish-white as they expand.",
                symptoms_marathi="पानांच्या किनारींवर पाण्याने भिजलेले घाव जे वाढत असताना पिवळे आणि नंतर राखाडी-पांढरे होतात.",
                treatment="No effective chemical control. Remove and destroy infected plants. Use copper-based bactericides preventively.",
                treatment_marathi="प्रभावी रासायनिक नियंत्रण नाही. संक्रमित रोपे काढून नष्ट करा. प्रतिबंधात्मकरित्या तांबे-आधारित जीवाणुनाशके वापरा.",
                prevention="Use resistant varieties. Practice crop rotation. Use disease-free seeds and maintain field sanitation.",
                prevention_marathi="प्रतिरोधक वाण वापरा. पीक फेरपालट करा. रोगमुक्त बियाणे वापरा आणि शेताची स्वच्छता राखा.",
                image_urls=["https://www.plantix.net/en/library/plant-diseases/100029/bacterial-leaf-blight"]
            )
            db.add(disease3)
            
            db.commit()
            print("Sample crop diseases created successfully!")
        else:
            print("Database already contains users, skipping initialization.")
    finally:
        db.close()

if __name__ == "__main__":
    init_db()