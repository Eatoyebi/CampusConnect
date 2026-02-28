import express from "express";
import { login, me, logout } from "../controllers/authController.js";
import requireAuth from "../../middleware/requireAuth.js";

const router = express.Router();

router.post("/login", login);
router.get("/me", requireAuth, me);
router.post("/logout", logout);

export default router;