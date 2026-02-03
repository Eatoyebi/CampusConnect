import express from "express";
import multer from "multer";
import path from "path";
import User from "../models/User.js";
import { createUser, getUserById, getAllUsers, updateUser, deleteUser } from "./controllers/userController.js";

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


// CREATE user (optional)
router.post("/", upload.single('profileImageURL'), validateUserInput,createUser);

router.get("/", getAllUsers);

router.get('/:id', getUserById)

router.put('/:id', updateUser);

router.delete('/:id', deleteUser);
router.put("/:id", upload.single("profileImageURL"), validateUserUpdate, updateUser);
router.delete("/:id", deleteUser);

export default router;