@echo off
echo ======================================================
echo Starting HaritSetu application...
echo ======================================================
echo.

echo Starting Node.js backend server (KrushiBazaar)...
start cmd /k "cd backend && npm run dev"

echo Starting Python FastAPI backend server (Other modules)...
start cmd /k "cd backend && python run.py"

echo Starting frontend server...
start cmd /k "npm run dev"

echo.
echo ======================================================
echo HaritSetu application started!
echo.
echo Node.js Backend: http://localhost:3000
echo Python Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo IMPORTANT NOTES:
echo 1. All module buttons have been updated with Marathi translations.
echo 2. The following modules are functional:
echo    - AgriScan (एग्री स्कॅन)
echo    - Grievance360 (तक्रार ३६०)
echo    - AgriConnect (एग्री कनेक्ट)
echo    - KrushiBazaar (कृषीबाज़ार)
echo 3. WeatherGuard and Marathi AI Tutor modules have been removed.
echo 4. Click on "मॉड्यूल उघडा (Open Module)" to access a module.
echo ======================================================
echo.