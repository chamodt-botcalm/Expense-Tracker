# OTP Passkey Authentication Implementation

## Overview
Email + OTP-based signup with 6-digit passkey verification. No passwords required.

## Backend Files Created

### 1. `src/config/otp.ts`
- Generates 6-digit OTP codes
- Stores OTP with hash, expiry (5 min), attempt tracking (max 5)
- Resend cooldown (30 sec)
- In-memory storage (replace with Redis/DB for production)

### 2. `src/config/email.ts`
- Mock email sender (logs to console)
- Replace with SendGrid/Nodemailer for production

### 3. `src/controllers/otpController.ts`
- `sendOTP`: Generates OTP, stores it, sends email
- `verifyOTPAndSignUp`: Verifies OTP, creates user if needed, returns JWT token

### 4. `src/routes/otpRoutes.ts`
- POST `/api/otp/send` - Send OTP to email
- POST `/api/otp/verify` - Verify OTP and create/login user

### 5. `src/server.ts` (Updated)
- Added OTP routes

## Mobile Files Created

### 1. `src/components/OTPInput.tsx`
- 6-digit input component
- Auto-focus between fields
- Backspace navigation

### 2. `src/config/otpApi.ts`
- API client for OTP endpoints
- `sendOTP(email)` - Request OTP
- `verifyOTP(email, otp)` - Verify and authenticate

### 3. `src/screens/auth/OTPSignUpScreen.tsx`
- Email input screen
- "Send Passkey" button
- Navigates to verification screen

### 4. `src/screens/auth/OTPVerifyScreen.tsx`
- 6-digit OTP input
- Verify button
- Resend button with 30s cooldown
- Shows expiry info (5 minutes)

### 5. `src/store/auth.tsx` (Updated)
- Added `token` state
- Added `setAuthToken()` method for OTP flow
- Persists token to AsyncStorage

### 6. `src/navigation/AuthStack.tsx` (Updated)
- Added `OTPSignUp` screen
- Added `OTPVerify` screen with email param

### 7. `src/screens/auth/SignInScreen.tsx` (Updated)
- Added link to "Create with passkey"

## Flow

1. User taps "Create with passkey" on SignIn screen
2. Enters email on OTPSignUpScreen
3. Taps "Send Passkey" → Backend generates OTP, sends email
4. Navigates to OTPVerifyScreen
5. User enters 6-digit code
6. Backend verifies OTP:
   - If valid: Creates user (if new), returns JWT token
   - If invalid: Shows error, allows retry (max 5)
7. App stores token + user data in AsyncStorage
8. User is logged in and navigates to AppStack

## Rules Implemented

✅ OTP expires in 5 minutes
✅ Max 5 verification attempts
✅ 30-second resend cooldown
✅ OTP hashed before storage
✅ Auto-creates user on first verification
✅ Returns JWT token for session management

## Testing

### Backend
```bash
# Send OTP
curl -X POST http://localhost:5001/api/otp/send \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Verify OTP (check console for code)
curl -X POST http://localhost:5001/api/otp/verify \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}'
```

### Mobile
1. Run app
2. Tap "Create with passkey"
3. Enter email
4. Check backend console for OTP
5. Enter OTP in app
6. Should be logged in

## Production Checklist

- [ ] Replace mock email with real service (SendGrid, Nodemailer)
- [ ] Replace in-memory OTP store with Redis/Database
- [ ] Implement proper JWT signing/verification
- [ ] Add rate limiting per IP
- [ ] Add CAPTCHA for repeated failures
- [ ] Use HTTPS only
- [ ] Add email verification before OTP
- [ ] Implement token refresh mechanism
