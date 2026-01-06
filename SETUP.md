# Expense Tracker - Setup Guide

## Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
- Copy `.env.example` to `.env`
- Update with your actual database and Redis credentials

4. Start the server:
```bash
npm run dev
```

Server will run on `http://localhost:5001`

## Mobile Setup

1. Navigate to mobile folder:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
- Copy `.env.example` to `.env`
- For Android Emulator: Use `http://10.0.2.2:5001`
- For iOS Simulator: Use `http://localhost:5001`
- For Physical Device: Use `http://YOUR_LOCAL_IP:5001`

4. Run the app:

**Android:**
```bash
npm run android
```

**iOS:**
```bash
cd ios && pod install && cd ..
npm run ios
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
  - Body: `{ email, password }`
- `POST /api/auth/signin` - Sign in user
  - Body: `{ email, password }`

### Transactions
- `GET /api/transaction/:user_id` - Get user transactions
- `POST /api/transaction` - Create transaction
- `DELETE /api/transaction/:id` - Delete transaction
- `GET /api/transaction/summary/:user_id` - Get transaction summary

## Notes

- Backend uses SHA-256 for password hashing
- Mobile app stores user email in AsyncStorage after successful auth
- CORS is enabled for mobile app communication
- Rate limiting is applied to all endpoints
