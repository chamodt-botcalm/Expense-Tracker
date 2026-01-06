import { sql } from '../config/db';
import crypto from 'crypto';

const hashPassword = (password: string): string => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

export async function signUp(req: any, res: any) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await sql`SELECT * FROM users WHERE email = ${email.toLowerCase()}`;
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = hashPassword(password);
    const result = await sql`
      INSERT INTO users (email, password)
      VALUES (${email.toLowerCase()}, ${hashedPassword})
      RETURNING id, email
    `;

    res.status(201).json({ 
      message: "User created successfully", 
      user: { id: result[0].id, email: result[0].email }
    });
  } catch (error) {
    console.error("Error in signUp:", error);
    res.status(500).json({ message: "Server Error" });
  }
}

export async function signIn(req: any, res: any) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const hashedPassword = hashPassword(password);
    const result = await sql`
      SELECT id, email FROM users 
      WHERE email = ${email.toLowerCase()} AND password = ${hashedPassword}
    `;

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({ 
      message: "Sign in successful", 
      user: { id: result[0].id, email: result[0].email }
    });
  } catch (error) {
    console.error("Error in signIn:", error);
    res.status(500).json({ message: "Server Error" });
  }
}
