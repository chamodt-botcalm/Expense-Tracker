import express from "express";
import { getProfile, updateProfile } from "../controllers/profileController";
import { validateNumericParam, validateProfileUpdateBody } from "../middleware/validators";
import { requireUserFromParam } from "../middleware/requireUser";

const router = express.Router();

router.get("/:user_id", validateNumericParam("user_id"), requireUserFromParam("user_id"), getProfile);

router.put(
  "/:user_id",
  validateNumericParam("user_id"),
  requireUserFromParam("user_id"),
  validateProfileUpdateBody,
  updateProfile
);

export default router;
