import express from "express";
import Floor from "../models/Floor.js";
import Building from "../models/Building.js";
import mongoose from "mongoose";

const router = express.Router();

/**
 * POST /api/floors
 * body: { universityId, buildingId, number, name? }
 */
router.post("/", async (req, res) => {
    try {
      const { universityId, buildingId, number, name } = req.body;
  
      if (!universityId || !mongoose.Types.ObjectId.isValid(universityId)) {
        return res.status(400).json({ message: "Valid universityId is required." });
      }
      if (!buildingId || !mongoose.Types.ObjectId.isValid(buildingId)) {
        return res.status(400).json({ message: "Valid buildingId is required." });
      }
  
      const parsedNumber = Number(number);
      if (!Number.isInteger(parsedNumber)) {
        return res.status(400).json({ message: "number must be an integer." });
      }
  
      // ensure building exists + belongs to university
      const building = await Building.findById(buildingId).lean();
      if (!building) return res.status(404).json({ message: "Building not found." });
      if (String(building.universityId) !== String(universityId)) {
        return res.status(400).json({ message: "buildingId does not belong to universityId." });
      }
  
      const created = await Floor.create({
        universityId,
        buildingId,
        number: parsedNumber,
        name: (name || "").trim(),
      });
  
      return res.status(201).json(created);
    } catch (err) {
      if (err?.code === 11000) {
        return res.status(409).json({ message: "That floor already exists for this building." });
      }
      console.error("Create floor error:", err);
      return res.status(500).json({ message: "Failed to create floor." });
    }
  });

/**
 * GET /api/floors?universityId=...&buildingId=...
 */
router.get("/", async (req, res) => {
  try {
    const { universityId, buildingId } = req.query;

    const filter = {};

    if (universityId) {
      filter.universityId = universityId;
    }

    if (buildingId && mongoose.Types.ObjectId.isValid(buildingId)) {
      filter.buildingId = new mongoose.Types.ObjectId(buildingId);
    }

    const floors = await Floor.find(filter)
      .sort({ number: 1 })
      .lean();

    return res.json(floors);
  } catch (err) {
    console.error("Get floors error:", err);
    return res.status(500).json({ message: "Failed to fetch floors." });
  }
});

/**
 * DELETE /api/floors/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Floor.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Floor not found." });

    return res.json({ message: "Deleted", id: req.params.id });
  } catch (err) {
    console.error("Delete floor error:", err);
    return res.status(500).json({ message: "Failed to delete floor." });
  }
});

export default router;