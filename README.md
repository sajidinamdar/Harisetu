# HaritSetu (हरितसेतू)

HaritSetu is a smart, AI-integrated platform developed to empower farmers with access to personalized support, real-time information, expert advice, and grievance redressal. It uses both Marathi and English for broader accessibility.

## Modules

### 1. User Management
Register/login farmers, officers, and experts with multilingual authentication, profile management, and role-based access.

### 2. KrushiBazaar
Marketplace for seeds, tools, fertilizers, etc. with search, buy/sell, price comparison, and government subsidies information.

### 3. HaritSetu Chat
Real-time chatbot and human expert chat in Marathi/English.

### 4. AgroAlert
Alerts for pests, weather, crop issues with push notifications, SMS alerts, and risk analysis.

### 5. AgriScan
Crop disease detection from images with diagnosis and solutions in Marathi/English:
- Upload crop images for AI-based disease detection
- Get detailed information about detected diseases
- View treatment and prevention recommendations
- Access scan history for reference
- Multilingual support (English and Marathi)

### 6. AgriConnect
Connect farmers with nearby agricultural services:
- Find veterinarians, fertilizer shops, irrigation services, banks, etc.
- GPS-based discovery with Google Maps integration
- Service ratings and reviews
- Contact information and opening hours
- Verified service providers

### 7. Grievance360
Register and track farming-related issues with priority-based officer assignment:
- File complaints across various agricultural categories
- Track complaint status and updates in real-time
- Priority-based handling (low, medium, high, urgent)
- Officer assignment and resolution tracking
- Comment system for updates and clarifications
- Multilingual interface for broader accessibility

### 8. AgriDocAI
Generate documents, letters, and reports using AI for subsidies, crop loss reports, and loan forms.

### 9. Kisan Mitra
Voice-based personal assistant in Marathi for crop advice and training schedules.

### 10. Marathi AI Tutor
Educates farmers on digital, legal, and agriculture topics with quizzes and gamification.

### 11. WeatherGuard
Real-time weather forecasting for agricultural decisions:
- 7-day and hourly weather forecasts
- Crop-specific weather advice and risk assessment
- Agricultural recommendations based on weather conditions
- Planting suggestions based on current and forecasted weather
- Weather alerts for extreme conditions
- Location-based forecasts with GPS integration

## Technology Stack

### Frontend
- HTML, CSS, JavaScript
- React with TypeScript
- Bootstrap/Tailwind CSS
- Jinja2 templates

### Backend
- Node.js with Express
- MySQL database
- REST APIs for each module

### AI Features
- AI Chat Assistant in Marathi/English
- Voice Command Interface
- Image-based Disease Detection
- Auto Document Generation
- Smart Prioritization for Issues

### Multilingual Support
- English + Marathi (via Google Translate API / manual)

### APIs
- Google Maps
- Weather API
- SMS Gateway

## Getting Started

### Prerequisites
- Node.js 14+
- npm or yarn
- MySQL 5.7+ or MariaDB 10.2+

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/haritsetu.git
cd haritsetu
```

2. Install frontend dependencies
```
npm install
```

3. Install backend dependencies
```
cd backend
npm install
cd ..
```

4. Set up the database
```
cd database
npm install mysql2 dotenv
node setup.js
cd ..
```

### Running the Application

#### Option 1: Using the start script (Windows)
Simply run the start.bat file:
```
start.bat
```

#### Option 2: Manual startup

1. Start the backend server:
```
cd backend
node server.js
```

2. In a new terminal, start the frontend development server:
```
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:5173
```

### Demo Accounts

You can use the following demo accounts to test the application:

- **Farmer**: 
  - Email: farmer@demo.com
  - Password: demo123

- **Officer**: 
  - Email: officer@demo.com
  - Password: demo123

- **Expert**: 
  - Email: expert@demo.com
  - Password: demo123

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.