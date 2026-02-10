import express from "express";
import requireAuth from "../../middleware/requireAuth.js";
import requireAdmin from "../../middleware/requireAdmin.js";
import upload from "../../middleware/upload.js";
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getMe,
  updateMe,
  searchUsers,
  getAdminUser
} from "./controllers/userController.js";
import {
  validateUserInput,
  validateUserUpdate
} from "../../middleware/validation.js";

const router = express.Router();

// Me
router.get("/me", requireAuth, getMe);
router.put("/me", requireAuth, upload.single("profileImage"), validateUserUpdate, updateMe);

// Admin
router.get("/admin/users", requireAuth, requireAdmin, searchUsers);
router.get("/admin/users/:id", requireAuth, requireAdmin, getAdminUser);

// CRUD
router.post("/", upload.single("profileImage"), validateUserInput, createUser);
router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/:id", upload.single("profileImage"), validateUserUpdate, updateUser);
router.delete("/:id", deleteUser);

export default router;