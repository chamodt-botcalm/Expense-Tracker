# 3-Step Signup Flow: Email OTP → Password → Login

## Overview
Secure signup flow with email verification via 6-digit passkey, followed by password creation. Users must sign in after account creation.

---

## Backend Implementation

### Dependencies Required
```bash
npm install bcrypt nodemailer
npm install --save-dev @types/bcrypt @types/nodemailer
```

### Environment Variables (.env)
```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=PulseSpend <your-email@gmail.com>
```

**Gmail Setup:**
1. Enable 2FA on your Google account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use App Password as `SMTP_PASS`

---

## API Endpoints

### 1. POST `/api/auth/send-passkey`

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "message": "Passkey sent to email"
}
```

**Error Responses:**
- `400`: Invalid email or email already registered
- `429`: Resend cooldown active (wait X seconds)
- `500`: Failed to send passkey

**Backend Logic:**
- Validates email format
- Checks if email already exists in database
- Enforces 30-second resend cooldown
- Generates 6-digit OTP
- Hashes OTP with SHA256
- Stores: `{ email, otpHash, otpExpiresAt (5 min), otpAttempts: 0, lastResendAt }`
- Sends email via Nodemailer

---

### 2. POST `/api/auth/verify-passkey`

**Request:**
```json
{
  "email": "user@example.com",
  "passkey": "123456"
}
```

**Success Response (200):**
```json
{
  "message": "Passkey verified",
  "signupToken": "a1b2c3d4e5f6..."
}
```

**Error Responses:**
- `400`: Missing email or passkey
- `401`: Invalid passkey, expired, or max attempts exceeded
- `500`: Verification failed

**Backend Logic:**
- Retrieves signup session by email
- Checks OTP expiry (5 minutes)
- Checks attempt count (max 5)
- Increments attempt counter
- Compares hashed passkey
- If valid:
  - Generates `signupToken` (64-char hex)
  - Hashes and stores token with 10-minute expiry
  - Returns token to client

---

### 3. POST `/api/auth/set-password`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "signupToken": "a1b2c3d4e5f6..."
}
```

**Success Response (201):**
```json
{
  "message": "Account created successfully",
  "user": {
    "id": 42,
    "email": "user@example.com",
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `400`: Missing fields, invalid password, or email already registered
- `401`: Invalid or expired signup token
- `500`: Failed to create account

**Password Validation:**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 number

**Backend Logic:**
- Verifies signup token (hash match + not expired)
- Validates password requirements
- Checks if email already exists
- Hashes password with bcrypt (10 rounds)
- Creates user record in database
- Clears signup session
- Returns user data (NO auto-login)

---

## Database Schema

### PostgreSQL Table Structure

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
```

**Note:** OTP and signup token data stored in-memory (Map). For production, use Redis with TTL.

---

## Mobile Implementation

### Files Created

1. **`src/config/signupApi.ts`** - API client
2. **`src/screens/auth/SignupEmailScreen.tsx`** - Step 1: Email input
3. **`src/screens/auth/PasskeyVerifyScreen.tsx`** - Step 2: OTP verification
4. **`src/screens/auth/PasswordCreateScreen.tsx`** - Step 3: Password creation
5. **`src/navigation/AuthStack.tsx`** - Updated navigation
6. **`src/screens/auth/SignInScreen.tsx`** - Updated with signup link

### Screen Flow

```
SignInScreen
    ↓ (tap "Create account")
SignupEmailScreen
    ↓ (enter email → send passkey)
PasskeyVerifyScreen
    ↓ (enter 6-digit code → verify)
PasswordCreateScreen
    ↓ (set password → create account)
SignInScreen (with success alert)
```

---

## Security Features

### OTP Security
- ✅ 6-digit random code
- ✅ SHA256 hashed storage
- ✅ 5-minute expiry
- ✅ Max 5 verification attempts
- ✅ 30-second resend cooldown
- ✅ Single-use (deleted after verification)

### Signup Token Security
- ✅ 64-character random hex
- ✅ SHA256 hashed storage
- ✅ 10-minute expiry
- ✅ Single-use (deleted after password set)
- ✅ Tied to specific email

### Password Security
- ✅ Bcrypt hashing (10 rounds)
- ✅ Minimum 8 characters
- ✅ Requires 1 uppercase letter
- ✅ Requires 1 number
- ✅ Confirmation required

---

## Testing

### Backend Testing

```bash
# 1. Send Passkey
curl -X POST http://localhost:5001/api/auth/send-passkey \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Check email or backend console for passkey

# 2. Verify Passkey
curl -X POST http://localhost:5001/api/auth/verify-passkey \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","passkey":"123456"}'

# Save signupToken from response

# 3. Set Password
curl -X POST http://localhost:5001/api/auth/set-password \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"SecurePass123",
    "signupToken":"YOUR_SIGNUP_TOKEN"
  }'
```

### Mobile Testing

1. Run backend: `npm run dev`
2. Run mobile app
3. Tap "Create account"
4. Enter email → Check email for passkey
5. Enter 6-digit passkey
6. Create password (min 8 chars, 1 uppercase, 1 number)
7. Verify redirect to SignIn screen
8. Sign in with new credentials

---

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Email already registered" | User exists | Use different email or sign in |
| "Please wait Xs before resending" | Resend cooldown | Wait for cooldown |
| "Passkey expired" | 5 minutes passed | Request new passkey |
| "Max attempts exceeded" | 5 failed attempts | Request new passkey |
| "Invalid passkey" | Wrong code | Check email, try again |
| "Invalid or expired signup session" | Token expired | Start signup again |
| "Password must be at least 8 characters" | Weak password | Use stronger password |

---

## Production Checklist

### Backend
- [ ] Replace in-memory store with Redis (with TTL)
- [ ] Add rate limiting per IP (already implemented)
- [ ] Use proper SMTP service (SendGrid, AWS SES)
- [ ] Add email template with branding
- [ ] Implement CAPTCHA for repeated failures
- [ ] Add logging and monitoring
- [ ] Use HTTPS only
- [ ] Add database indexes
- [ ] Implement proper error tracking

### Mobile
- [ ] Add loading states for all API calls
- [ ] Implement offline handling
- [ ] Add analytics tracking
- [ ] Test on multiple devices
- [ ] Add accessibility features
- [ ] Implement deep linking for email verification

### Security
- [ ] Implement JWT with refresh tokens
- [ ] Add device fingerprinting
- [ ] Implement account lockout after multiple failures
- [ ] Add email verification link as alternative
- [ ] Implement 2FA for sensitive operations
- [ ] Add password strength meter
- [ ] Implement password reset flow

---

## File Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── nodemailer.ts       # Email sending
│   │   ├── signupAuth.ts       # OTP & token logic
│   │   └── db.ts               # Database
│   ├── controllers/
│   │   └── signupController.ts # 3 endpoints
│   └── routes/
│       └── signupRoutes.ts     # Route definitions

mobile/
├── src/
│   ├── config/
│   │   └── signupApi.ts        # API client
│   ├── screens/auth/
│   │   ├── SignupEmailScreen.tsx
│   │   ├── PasskeyVerifyScreen.tsx
│   │   ├── PasswordCreateScreen.tsx
│   │   └── SignInScreen.tsx
│   └── navigation/
│       └── AuthStack.tsx       # Navigation
```

---

## Example Email Template

```html
Subject: Your PulseSpend Passkey

Your verification passkey is:

123456

This passkey will expire in 5 minutes.

If you didn't request this, please ignore this email.

---
PulseSpend - Track • Control • Grow
```

---

## Notes

- **No auto-login**: Users must sign in after account creation for security
- **Single-use tokens**: Both OTP and signup token are deleted after use
- **Time-limited**: OTP (5 min), signup token (10 min)
- **Attempt-limited**: Max 5 OTP verification attempts
- **Cooldown**: 30-second resend cooldown prevents spam
