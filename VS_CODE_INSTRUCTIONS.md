# Running the Project in VS Code Terminal

## Option 1: Using the Batch File

Simply run the batch file in the VS Code terminal:

```
.\run-in-vscode.bat
```

## Option 2: Running Components Individually

If you prefer to run each component in a separate terminal, follow these steps:

1. Open VS Code
2. Open the project folder (c:/Users/Sajid/Desktop/project)
3. Open multiple terminals in VS Code (Terminal > New Terminal for each)

### Terminal 1: Start OTP Server
```
cd backend
node otp-server.js
```

### Terminal 2: Start Node.js Backend
```
cd backend
npm run dev
```

### Terminal 3: Start Python Backend
```
cd backend
python run.py
```

### Terminal 4: Start Frontend
```
npm run dev
```

## Accessing the Application

Once all servers are running, you can access the application at:

- Frontend: http://localhost:5173
- OTP Server: http://localhost:3001
- Node.js Backend: http://localhost:3000
- Python Backend: http://localhost:8000

## Testing OTP Functionality

1. Navigate to the OTP login/registration page
2. Enter a phone number (e.g., 9876543210 for the demo user)
3. Request an OTP
4. Check the OTP Server terminal to see the generated OTP
5. Enter the OTP in the verification screen

## Stopping the Servers

To stop all servers, press Ctrl+C in each terminal window.