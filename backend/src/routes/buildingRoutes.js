import express from "express";
import Building from "../models/Building.js";

const router = express.Router();

/**
 * POST /api/buildings
 * Body: { name: string, code: string }
 */
router.post("/", async (req, res) => {
  try {
    const { universityId, name, code } = req.body;

    if (!universityId || !name?.trim() || !code?.trim()) {
      return res.status(400).json({
        message: "universityId, name, and code are required."
      });
    }

    const created = await Building.create({
      universityId,
      name: name.trim(),
      code: code.trim().toUpperCase(),
    });

    return res.status(201).json(created);
  } catch (err) {
    console.error("Create building error:", err);

    if (err?.code === 11000) {
      return res.status(409).json({ message: "Building code already exists." });
    }

    return res.status(500).json({ message: "Failed to create building." });
  }
});

/**
 * GET /api/buildings
 * Returns all buildings (alphabetical)
 */
router.get("/", async (req, res) => {
  try {
    const buildings = await Building.find().sort({ name: 1 }).lean();
    return res.json(buildings);
  } catch (err) {
    console.error("List buildings error:", err);
    return res.status(500).json({ message: "Failed to fetch buildings." });
  }
});

/**
 * GET /api/buildings/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const building = await Building.findById(req.params.id).lean();
    if (!building) return res.status(404).json({ message: "Building not found." });
    return res.json(building);
  } catch (err) {
    console.error("Get building error:", err);
    return res.status(500).json({ message: "Failed to fetch building." });
  }
});

/**
 * DELETE /api/buildings/:id
 * (Optional but useful while testing)
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Building.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Building not found." });
    return res.json({ message: "Deleted", id: req.params.id });
  } catch (err) {
    console.error("Delete building error:", err);
    return res.status(500).json({ message: "Failed to delete building." });
  }
});



export default router;