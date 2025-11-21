import express from "express";
import multer from "multer";
import path from "path";
import User from "../models/User.js";

const router = express.Router();

// Email validation helper function
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Input validation middleware
const validateUserInput = (req, res, next) => {
  const { name, email, bio, major, graduationYear } = req.body;
  const errors = [];

  // Validate required fields
  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push('Name is required and must be a non-empty string');
  }

  if (!email || typeof email !== 'string' || email.trim() === '') {
    errors.push('Email is required and must be a non-empty string');
  } else if (!isValidEmail(email)) {
    errors.push('Email must be in a valid format (e.g., user@example.com)');
  }

  // Validate optional fields data types
  if (bio !== undefined && bio !== null && typeof bio !== 'string') {
    errors.push('Bio must be a string');
  }

  if (major !== undefined && major !== null && typeof major !== 'string') {
    errors.push('Major must be a string');
  }

  if (graduationYear !== undefined && graduationYear !== null) {
    if (typeof graduationYear !== 'string') {
      errors.push('Graduation year must be a string');
    } else {
      const year = parseInt(graduationYear);
      if (isNaN(year) || year < 1900 || year > 2100) {
        errors.push('Graduation year must be a valid year between 1900 and 2100');
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      message: 'Validation failed', 
      errors 
    });
  }

  next();
};

// Validation for updates (allows partial updates)
const validateUserUpdate = (req, res, next) => {
  const { name, email, bio, major, graduationYear } = req.body;
  const errors = [];

  // Validate name if provided
  if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
    errors.push('Name must be a non-empty string');
  }

  // Validate email if provided
  if (email !== undefined) {
    if (typeof email !== 'string' || email.trim() === '') {
      errors.push('Email must be a non-empty string');
    } else if (!isValidEmail(email)) {
      errors.push('Email must be in a valid format (e.g., user@example.com)');
    }
  }

  // Validate optional fields data types
  if (bio !== undefined && bio !== null && typeof bio !== 'string') {
    errors.push('Bio must be a string');
  }

  if (major !== undefined && major !== null && typeof major !== 'string') {
    errors.push('Major must be a string');
  }

  if (graduationYear !== undefined && graduationYear !== null) {
    if (typeof graduationYear !== 'string') {
      errors.push('Graduation year must be a string');
    } else {
      const year = parseInt(graduationYear);
      if (isNaN(year) || year < 1900 || year > 2100) {
        errors.push('Graduation year must be a valid year between 1900 and 2100');
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      message: 'Validation failed', 
      errors 
    });
  }

  next();
};

// Multer storage
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
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB file size limit
});

// CREATE user (optional)
router.post("/", upload.single("profileImage"), validateUserInput, async (req, res) => {
  try {
    const { name, email, bio, major, graduationYear } = req.body;

    const newUser = new User({
      name,
      email,
      bio,
      major,
      graduationYear,
      profileImage: req.file ? req.file.filename : null,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    // Check for duplicate key errors (e.g., email already exists)
    if (error.code === 11000) {
      return res.status(409).json({ 
        message: "User with this email already exists",
        errors: ["Email must be unique"]
      });
    }
    res.status(500).json({ message: "Error creating user profile", error: error.message });
  }
});

// READ user profile by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const profileData = user.toObject();

    if (user.profileImage) {
      profileData.profileImage = `${req.protocol}://${req.get("host")}/uploads/${user.profileImage}`;
    }

    res.json(profileData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile" });
  }
});

// UPDATE user profile
router.put("/:id", upload.single("profileImage"), validateUserUpdate, async (req, res) => {
  try {
    const { name, email, bio, major, graduationYear } = req.body;

    const updates = { name, email, bio, major, graduationYear };

    if (req.file) {
      updates.profileImage = req.file.filename;
    } else if (req.body.profileImage === "") {
      updates.profileImage = null;
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.json(updatedUser);
  } catch (error) {
    // Check for duplicate key errors (e.g., email already exists)
    if (error.code === 11000) {
      return res.status(409).json({ 
        message: "Email already in use by another user",
        errors: ["Email must be unique"]
      });
    }
    res.status(500).json({ message: "Error updating user profile", error: error.message });
  }
});

export default router;