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
    updates: { name?: string; profile_photo?: string; theme?: string; currency?: string; date_format?: string }
  ): Promise<User> {
    const fields: string[] = [];
    const values: any[] = [];
    
    if (updates.name !== undefined) {
      fields.push('name');
      values.push(updates.name);
    }
    if (updates.profile_photo !== undefined) {
      fields.push('profile_photo');
      values.push(updates.profile_photo);
    }
    if (updates.theme !== undefined) {
      fields.push('theme');
      values.push(updates.theme);
    }
    if (updates.currency !== undefined) {
      fields.push('currency');
      values.push(updates.currency);
    }
    if (updates.date_format !== undefined) {
      fields.push('date_format');
      values.push(updates.date_format);
    }

    if (fields.length === 0) {
      const result = await sql`SELECT * FROM users WHERE id = ${userId}`;
      return result[0] as User;
    }

    const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
    values.push(userId);
    
    const result = await sql.unsafe(`UPDATE users SET ${setClause} WHERE id = $${values.length} RETURNING *`, values);
    return result[0] as User;
  }

  static async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await sql`UPDATE users SET password = ${hashedPassword} WHERE id = ${userId}`;
  }
}
