import express from "express";
import multer from "multer";
import path from "path";
import User from "../models/User.js";

const router = express.Router();

const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return cb(new Error('Invalid file type. Only images are allowed.'));
    }
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

// CREATE user profile
router.post("/", upload.single("profileImage"), async (req, res) => {
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
    console.error(error);
    res.status(500).json({ message: "Error creating user profile" });
  }
});

// READ user profile by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Return full URL for image if it exists
    const profileData = user.toObject();
    if (user.profileImage) {
      profileData.profileImage = `${req.protocol}://${req.get("host")}/uploads/${user.profileImage}`;
    }

    res.json(profileData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user profile" });
  }
});

// UPDATE user profile
router.put("/:id", upload.single("profileImage"), async (req, res) => {
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
    console.error(error);
    res.status(500).json({ message: "Error updating user profile" });
  }
});

export default router;
