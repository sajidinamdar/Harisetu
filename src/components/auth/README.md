# OTP Authentication Components

This directory contains React components for OTP-based authentication using Twilio Verify Service.

## Components

### OTPAuthModal

The main component that switches between login and registration modes.

```tsx
import OTPAuthModal from './components/auth/OTPAuthModal';

// In your component
<OTPAuthModal
  isOpen={isModalOpen}
  onClose={handleCloseModal}
  initialMode="login" // or "register"
  language="en" // or "mr" for Marathi
/>
```

### OTPLoginModal

Component for OTP-based login.

```tsx
import OTPLoginModal from './components/auth/OTPLoginModal';

// In your component
<OTPLoginModal
  isOpen={isModalOpen}
  onClose={handleCloseModal}
  onSwitchToRegister={handleSwitchToRegister}
  language="en" // or "mr" for Marathi
/>
```

### OTPRegisterModal

Component for OTP-based registration.

```tsx
import OTPRegisterModal from './components/auth/OTPRegisterModal';

// In your component
<OTPRegisterModal
  isOpen={isModalOpen}
  onClose={handleCloseModal}
  onSwitchToLogin={handleSwitchToLogin}
  language="en" // or "mr" for Marathi
/>
```

## Authentication Flow

### Login Flow

1. User enters phone number
2. System sends OTP via Twilio Verify Service
3. User enters OTP
4. System verifies OTP and returns user data
5. User is logged in

### Registration Flow

1. User enters phone number
2. System sends OTP via Twilio Verify Service
3. User enters OTP
4. System verifies OTP
5. User enters additional information (name, email, etc.)
6. System creates user account and logs user in

## Usage with AuthContext

These components use the AuthContext for authentication state management. Make sure your AuthContext provides the following methods:

```tsx
// In your AuthContext
const sendOTP = async (phone: string, purpose: 'login' | 'signup') => {
  // Implementation
};

const verifyOTP = async (phone: string, otp: string, purpose: 'login' | 'signup') => {
  // Implementation
};

const registerWithOTP = async (data: any) => {
  // Implementation
};

const setUser = (user: User) => {
  // Implementation
};
```

## Demo Page

A demo page is available at `/otp-auth-demo` to showcase the OTP authentication flow.

## API Endpoints

The components expect the following API endpoints:

- `POST /api/send-otp` - Send OTP
  - Request: `{ phone: string, purpose: 'login' | 'signup' }`
  - Response: `{ success: boolean, message: string }`

- `POST /api/verify-otp` - Verify OTP
  - Request: `{ phone: string, otp: string, purpose: 'login' | 'signup' }`
  - Response: `{ success: boolean, message: string, user?: User }` (user object returned for login)

- `POST /api/register` - Complete registration
  - Request: `{ phone: string, name: string, email?: string, ... }`
  - Response: `{ success: boolean, message: string, user: User }`

## Customization

The components support both English and Marathi languages. You can customize the translations in each component file.