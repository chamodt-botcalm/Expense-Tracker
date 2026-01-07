import { sql } from '../config/db';

export async function getProfile(req: any, res: any) {
  try {
    const result = await sql`
      SELECT id, email, name, profile_photo, theme 
      FROM users 
      WHERE id = ${req.params.user_id}
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ profile: result[0] });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server Error" });
  }
}

export async function updateProfile(req: any, res: any) {
  try {
    const { name, profile_photo, theme } = req.body;
    const userId = req.params.user_id;

    if (name !== undefined) {
      await sql`UPDATE users SET name = ${name} WHERE id = ${userId}`;
    }
    if (profile_photo !== undefined) {
      await sql`UPDATE users SET profile_photo = ${profile_photo} WHERE id = ${userId}`;
    }
    if (theme !== undefined) {
      await sql`UPDATE users SET theme = ${theme} WHERE id = ${userId}`;
    }

    const result = await sql`
      SELECT id, email, name, profile_photo, theme 
      FROM users 
      WHERE id = ${userId}
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated", profile: result[0] });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server Error" });
  }
}
