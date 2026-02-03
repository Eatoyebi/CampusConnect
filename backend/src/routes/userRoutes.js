import express from "express";
import multer from "multer";
import path from "path";
import mongoose from "mongoose";
import User from "../models/User.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

// Helpers and Validation
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateUserInput = (req, res, next) => {
  const { name, email, bio, major, graduationYear } = req.body;
  const errors = [];

  if (!name || typeof name !== "string" || name.trim() === "") {
    errors.push("Name is required and must be a non-empty string");
  }

  if (!email || typeof email !== "string" || email.trim() === "") {
    errors.push("Email is required and must be a non-empty string");
  } else if (!isValidEmail(email)) {
    errors.push("Email must be in a valid format (e.g., user@example.com)");
  }

  if (bio !== undefined && bio !== null && typeof bio !== "string") {
    errors.push("Bio must be a string");
  }

  if (major !== undefined && major !== null && typeof major !== "string") {
    errors.push("Major must be a string");
  }

  if (graduationYear !== undefined && graduationYear !== null) {
    if (typeof graduationYear !== "string") {
      errors.push("Graduation year must be a string");
    } else {
      const year = parseInt(graduationYear);
      if (isNaN(year) || year < 1900 || year > 2100) {
        errors.push("Graduation year must be a valid year between 1900 and 2100");
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Validation failed",
      errors,
    });
  }

  next();
};

const validateUserUpdate = (req, res, next) => {
  const { name, email, bio, major, graduationYear } = req.body;
  const errors = [];

  if (name !== undefined && (typeof name !== "string" || name.trim() === "")) {
    errors.push("Name must be a non-empty string");
  }

  if (email !== undefined) {
    if (typeof email !== "string" || email.trim() === "") {
      errors.push("Email must be a non-empty string");
    } else if (!isValidEmail(email)) {
      errors.push("Email must be in a valid format (e.g., user@example.com)");
    }
  }

  if (bio !== undefined && bio !== null && typeof bio !== "string") {
    errors.push("Bio must be a string");
  }

  if (major !== undefined && major !== null && typeof major !== "string") {
    errors.push("Major must be a string");
  }

  if (graduationYear !== undefined && graduationYear !== null) {
    if (typeof graduationYear !== "string") {
      errors.push("Graduation year must be a string");
    } else {
      const year = parseInt(graduationYear);
      if (isNaN(year) || year < 1900 || year > 2100) {
        errors.push("Graduation year must be a valid year between 1900 and 2100");
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Validation failed",
      errors,
    });
  }

  next();
};

// Multer setup (uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Role guard for admin
const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
};

const attachProfileImageUrl = (req, userDoc) => {
  const data = userDoc.toObject();
  if (data.profileImage) {
    data.profileImage = `${req.protocol}://${req.get("host")}/uploads/${data.profileImage}`;
  }
  return data;
};

// Me routes
router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(attachProfileImageUrl(req, user));
  } catch (error) {
    res.status(500).json({ message: "Error fetching current user profile" });
  }
});

router.put(
  "/me",
  requireAuth,
  upload.single("profileImage"),
  validateUserUpdate,
  async (req, res) => {
    try {
      const { name, email, bio, major, graduationYear } = req.body;

      const updates = {};
      if (name !== undefined) updates.name = name;
      if (email !== undefined) updates.email = email;
      if (bio !== undefined) updates.bio = bio;
      if (major !== undefined) updates.major = major;
      if (graduationYear !== undefined) updates.graduationYear = graduationYear;

      if (req.file) {
        updates.profileImage = req.file.filename;
      } else if (req.body.profileImage === "") {
        updates.profileImage = null;
      }

      const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
      if (!updatedUser) return res.status(404).json({ message: "User not found" });

      res.json(attachProfileImageUrl(req, updatedUser));
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({
          message: "Email already in use by another user",
          errors: ["Email must be unique"],
        });
      }

      res.status(500).json({ message: "Error updating current user profile", error: error.message });
    }
  }
);

// Admin lookup list
router.get("/admin/users", requireAuth, requireAdmin, async (req, res) => {
  try {
    const q = (req.query.q || "").trim();

    const filter = q
      ? {
          $or: [
            { email: new RegExp(q, "i") },
            { name: new RegExp(q, "i") },
            { major: new RegExp(q, "i") },
          ],
        }
      : {};

    const users = await User.find(filter)
      .select("name email role major graduationYear profileImage raAssignment updatedAt")
      .limit(25)
      .sort({ updatedAt: -1 });

    const result = users.map((u) => attachProfileImageUrl(req, u));
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error searching users" });
  }
});

// Admin lookup single user
router.get("/admin/users/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(attachProfileImageUrl(req, user));
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
});

// Create user
router.post("/", upload.single("profileImage"), validateUserInput, async (req, res) => {
  try {
    const { name, email, bio, major, graduationYear } = req.body;

    const newUser = new User({
      name,
      email,
      bio,
      major,
      graduationYear,
    });

    if (req.file) {
      newUser.profileImage = req.file.filename;
    }

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "User with this email already exists",
        errors: ["Email must be unique"],
      });
    }
    res.status(500).json({ message: "Error creating user profile", error: error.message });
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("name email role major graduationYear profileImage raAssignment");
    const result = users.map((u) => attachProfileImageUrl(req, u));
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Public get by id
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(attachProfileImageUrl(req, user));
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile" });
  }
});

// Update by id
router.put("/:id", upload.single("profileImage"), validateUserUpdate, async (req, res) => {
  try {
    const { name, email, bio, major, graduationYear } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (bio !== undefined) updates.bio = bio;
    if (major !== undefined) updates.major = major;
    if (graduationYear !== undefined) updates.graduationYear = graduationYear;

    if (req.file) {
      updates.profileImage = req.file.filename;
    } else if (req.body.profileImage === "") {
      updates.profileImage = null;
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json(attachProfileImageUrl(req, updatedUser));
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email already in use by another user",
        errors: ["Email must be unique"],
      });
    }
    res.status(500).json({ message: "Error updating user profile", error: error.message });
  }
});

// Delete by id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
});

export default router;