import express from "express";
import { getProfile, updateProfile } from '../controllers/profileController';

const router = express.Router();

router.get("/:user_id", getProfile);
router.put("/:user_id", updateProfile);

export default router;
