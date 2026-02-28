import express from "express";
import University from "../models/University.js";

const router = express.Router();

/**
 * POST /api/universities
 * Body: { name: string, code: string }
 */
router.post("/", async (req, res) => {
  try {
    const { name, code } = req.body;

    if (!name?.trim() || !code?.trim()) {
      return res.status(400).json({ message: "name and code are required." });
    }

    const created = await University.create({
      name: name.trim(),
      code: code.trim().toUpperCase(),
    });

    return res.status(201).json(created);
  } catch (err) {
    console.error("Create university error:", err);

    // duplicate key error (unique code)
    if (err?.code === 11000) {
      return res.status(409).json({ message: "University code already exists." });
    }

    return res.status(500).json({ message: "Failed to create university." });
  }
});

/**
 * GET /api/universities
 */
router.get("/", async (req, res) => {
  try {
    const universities = await University.find().sort({ name: 1 }).lean();
    return res.json(universities);
  } catch (err) {
    console.error("List universities error:", err);
    return res.status(500).json({ message: "Failed to fetch universities." });
  }
});

export default router;