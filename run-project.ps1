Write-Host "Starting HaritSetu Application..." -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green

# Start OTP Server
Write-Host "Starting OTP Server on port 3001..." -ForegroundColor Cyan
Start-Process -NoNewWindow powershell -ArgumentList "-Command cd '$PSScriptRoot/backend'; node otp-server.js"

# Start Node.js Backend
Write-Host "Starting Node.js Backend on port 3000..." -ForegroundColor Cyan
Start-Process -NoNewWindow powershell -ArgumentList "-Command cd '$PSScriptRoot/backend'; npm run dev"

# Start Python Backend
Write-Host "Starting Python Backend on port 8000..." -ForegroundColor Cyan
Start-Process -NoNewWindow powershell -ArgumentList "-Command cd '$PSScriptRoot/backend'; python run.py"

# Start Frontend
Write-Host "Starting Frontend on port 5173..." -ForegroundColor Cyan
Start-Process -NoNewWindow powershell -ArgumentList "-Command cd '$PSScriptRoot'; npm run dev"

Write-Host "======================================================" -ForegroundColor Green
Write-Host "HaritSetu application started!" -ForegroundColor Green
Write-Host ""
Write-Host "OTP Server: http://localhost:3001" -ForegroundColor Yellow
Write-Host "Node.js Backend: http://localhost:3000" -ForegroundColor Yellow
Write-Host "Python Backend: http://localhost:8000" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host ""
Write-Host "To stop all servers, close the terminal windows or press Ctrl+C in each window." -ForegroundColor Red
Write-Host "======================================================" -ForegroundColor Green