import express from "express";
import { sql } from "../config/db";

const router = express.Router();

// Save user's FCM token
router.post("/save-token", async (req, res) => {
  try {
    const { user_id, fcm_token } = req.body;

    if (!user_id || !fcm_token) {
      return res.status(400).json({ message: "user_id and fcm_token required" });
    }

    await sql`UPDATE users SET fcm_token = ${fcm_token} WHERE id = ${user_id}`;
    return res.json({ status: 200, message: "Token saved" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
