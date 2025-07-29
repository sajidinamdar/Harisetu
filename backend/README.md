# HaritSetu OTP Authentication for Login & Signup

Mobile OTP authentication service using Twilio Verify Service for the HaritSetu agricultural platform's login and signup forms.

## Features

- Mobile OTP authentication via Twilio Verify Service
- Support for both login and signup flows
- Simple API endpoints for the entire authentication flow
- Standalone OTP server option

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- Twilio account with Verify Service

### Installation

1. Navigate to the backend directory
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Update the `.env` file with your Twilio credentials if needed

### Running the Server

Main server with integrated OTP endpoints:

```bash
npm start
```

or in development mode:

```bash
npm run dev
```

Standalone OTP server:

```bash
npm run otp-server
```

## API Endpoints

### Main Server

- `POST /api/send-otp` - Send OTP via Twilio Verify
  - Request body: `{ "phone": "+919876543210", "purpose": "signup" }` or `{ "phone": "+919876543210", "purpose": "login" }`
  - Response: `{ "success": true, "message": "OTP sent", "sid": "verification_sid", "phone": "+919876543210" }`

- `POST /api/verify-otp` - Verify OTP via Twilio Verify
  - Request body: `{ "phone": "+919876543210", "otp": "123456", "purpose": "signup" }` or `{ "phone": "+919876543210", "otp": "123456", "purpose": "login" }`
  - For signup: `{ "success": true, "message": "OTP verified successfully. You can now complete registration.", "verified": true, "phone": "+919876543210" }`
  - For login: `{ "success": true, "message": "Login successful", "user": {...} }`

- `POST /api/register` - Complete user registration after OTP verification
  - Request body: `{ "phone": "+919876543210", "name": "John Doe", "email": "john@example.com", "district": "Pune", "taluka": "Haveli", "village": "Kothrud" }`
  - Response: `{ "success": true, "message": "User registered successfully", "user": {...} }`

### Standalone OTP Server

- `POST /send-otp` - Send OTP via Twilio Verify (same as main server)
- `POST /verify-otp` - Verify OTP via Twilio Verify (same as main server)
- `POST /register` - Complete user registration after OTP verification (same as main server)

## Authentication Flows

### Signup Flow:
1. Send OTP with purpose "signup"
2. Verify OTP with purpose "signup"
3. Complete registration with user details

### Login Flow:
1. Send OTP with purpose "login"
2. Verify OTP with purpose "login"
3. User is logged in and user data is returned

## Phone Number Format

The API automatically formats phone numbers to international format:
- If a number starts with "+", it's used as is
- Otherwise, Indian format (+91) is assumed and the number is formatted accordingly

## Twilio Verify Service

This implementation uses Twilio Verify Service which:
- Handles OTP generation, delivery, and verification
- Provides built-in security features
- Supports multiple channels (SMS, call, email)
- Manages OTP expiration automatically