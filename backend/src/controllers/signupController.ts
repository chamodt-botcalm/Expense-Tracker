import { sql } from '../config/db';
import { sendPasskeyEmail } from '../config/nodemailer';
import {
  generateOTP,
  storeOTP,
  verifyOTP,
  verifySignupToken,
  clearSignupSession,
  canResendOTP,
  validatePassword,
} from '../config/signupAuth';
import bcrypt from 'bcrypt';

export async function sendPasskey(req: any, res: any) {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'Valid email is required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existing = await sql`SELECT id FROM users WHERE email = ${normalizedEmail}`;
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const { allowed, waitSeconds } = canResendOTP(normalizedEmail);
    if (!allowed) {
      return res.status(429).json({ message: `Please wait ${waitSeconds}s before resending` });
    }

    const otp = generateOTP();
    storeOTP(normalizedEmail, otp);

    await sendPasskeyEmail(normalizedEmail, otp);

    res.status(200).json({ message: 'Passkey sent to email' });
  } catch (error) {
    console.error('Error sending passkey:', error);
    res.status(500).json({ message: 'Failed to send passkey' });
  }
}

export async function verifyPasskey(req: any, res: any) {
  try {
    const { email, passkey } = req.body;

    if (!email || !passkey) {
      return res.status(400).json({ message: 'Email and passkey are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const { valid, message, signupToken } = verifyOTP(normalizedEmail, passkey);

    if (!valid) {
      return res.status(401).json({ message });
    }

    res.status(200).json({
      message: 'Passkey verified',
      signupToken,
    });
  } catch (error) {
    console.error('Error verifying passkey:', error);
    res.status(500).json({ message: 'Verification failed' });
  }
}

export async function setPassword(req: any, res: any) {
  try {
    const { email, password, signupToken } = req.body;

    if (!email || !password || !signupToken) {
      return res.status(400).json({ message: 'Email, password, and signup token are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Validate signup token
    const tokenCheck = verifySignupToken(normalizedEmail, signupToken);
    if (!tokenCheck.valid) {
      return res.status(401).json({ message: tokenCheck.message });
    }

    // Validate password
    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
      return res.status(400).json({ message: passwordCheck.message });
    }

    // Check if user already exists
    const existing = await sql`SELECT id FROM users WHERE email = ${normalizedEmail}`;
    if (existing.length > 0) {
      clearSignupSession(normalizedEmail);
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const result = await sql`
      INSERT INTO users (email, password)
      VALUES (${normalizedEmail}, ${passwordHash})
      RETURNING id, email, created_at
    `;

    // Clear signup session
    clearSignupSession(normalizedEmail);

    res.status(201).json({
      message: 'Account created successfully',
      user: {
        id: result[0].id,
        email: result[0].email,
        createdAt: result[0].created_at,
      },
    });
  } catch (error) {
    console.error('Error setting password:', error);
    res.status(500).json({ message: 'Failed to create account' });
  }
}
