import { sql } from '../config/db';

export interface User {
  id: number;
  email: string;
  password: string;
  name?: string;
  profile_photo?: string;
  theme?: string;
  created_at?: Date;
}

export class UserModel {
  static async findByEmail(email: string): Promise<User | null> {
    const result = await sql`SELECT * FROM users WHERE email = ${email}`;
    return (result[0] as User) || null;
  }

  static async findById(id: string): Promise<User | null> {
    const result = await sql`SELECT * FROM users WHERE id = ${id}`;
    return (result[0] as User) || null;
  }

  static async create(email: string, hashedPassword: string): Promise<User> {
    const result = await sql`
      INSERT INTO users (email, password) 
      VALUES (${email}, ${hashedPassword}) 
      RETURNING *
    `;
    return result[0] as User;
  }

  static async updateProfile(
    userId: string,
    updates: { name?: string; profile_photo?: string; theme?: string }
  ): Promise<User> {
    let result;
    if (updates.name !== undefined && updates.profile_photo === undefined && updates.theme === undefined) {
      result = await sql`UPDATE users SET name = ${updates.name} WHERE id = ${userId} RETURNING *`;
    } else if (updates.profile_photo !== undefined && updates.name === undefined && updates.theme === undefined) {
      result = await sql`UPDATE users SET profile_photo = ${updates.profile_photo} WHERE id = ${userId} RETURNING *`;
    } else if (updates.theme !== undefined && updates.name === undefined && updates.profile_photo === undefined) {
      result = await sql`UPDATE users SET theme = ${updates.theme} WHERE id = ${userId} RETURNING *`;
    } else if (updates.name !== undefined && updates.profile_photo !== undefined && updates.theme === undefined) {
      result = await sql`UPDATE users SET name = ${updates.name}, profile_photo = ${updates.profile_photo} WHERE id = ${userId} RETURNING *`;
    } else if (updates.name !== undefined && updates.theme !== undefined && updates.profile_photo === undefined) {
      result = await sql`UPDATE users SET name = ${updates.name}, theme = ${updates.theme} WHERE id = ${userId} RETURNING *`;
    } else if (updates.profile_photo !== undefined && updates.theme !== undefined && updates.name === undefined) {
      result = await sql`UPDATE users SET profile_photo = ${updates.profile_photo}, theme = ${updates.theme} WHERE id = ${userId} RETURNING *`;
    } else {
      result = await sql`UPDATE users SET name = ${updates.name}, profile_photo = ${updates.profile_photo}, theme = ${updates.theme} WHERE id = ${userId} RETURNING *`;
    }

    return result[0] as User;
  }
}
