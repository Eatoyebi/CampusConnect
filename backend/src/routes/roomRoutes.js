import express from "express";
import mongoose from "mongoose";
import Room from "../models/Room.js";
import Building from "../models/Building.js";
import Floor from "../models/Floor.js";

const router = express.Router();
console.log("✅ roomRoutes.js LOADED");
/**
 * POST /api/rooms
 * Body: { buildingId: string, floorId: string, roomNumber: string, label?: string }
 */
router.post("/", async (req, res) => {
    console.log("✅ HIT /api/rooms POST", req.body);
  
    try {
      const { buildingId, floorId, roomNumber, label } = req.body;
  
      if (!buildingId || !mongoose.Types.ObjectId.isValid(buildingId)) {
        return res.status(400).json({ message: "Valid buildingId is required." });
      }
      if (!floorId || !mongoose.Types.ObjectId.isValid(floorId)) {
        return res.status(400).json({ message: "Valid floorId is required." });
      }
      if (!roomNumber?.trim()) {
        return res.status(400).json({ message: "roomNumber is required." });
      }
  
      const buildingExists = await Building.exists({ _id: buildingId });
      if (!buildingExists) return res.status(404).json({ message: "Building not found." });
  
      const floor = await Floor.findById(floorId).lean();
      if (!floor) return res.status(404).json({ message: "Floor not found." });
  
      if (String(floor.buildingId) !== String(buildingId)) {
        return res.status(400).json({ message: "floorId does not belong to buildingId." });
      }
  
      const created = await Room.create({
        buildingId,
        floorId,
        roomNumber: roomNumber.trim(),
        label: (label || "").trim(),
      });
  
      return res.status(201).json(created);
    } catch (err) {
      console.error("Create room error:", err);
  
      if (err?.code === 11000) {
        return res.status(409).json({ message: "That room already exists." });
      }
  
      return res.status(500).json({ message: "Failed to create room." });
    }
  });

/**
 * GET /api/rooms
 * Optional query params:
 *  - buildingId=...
 *  - floorId=...
 */
router.get("/", async (req, res) => {
  try {
    const { buildingId, floorId } = req.query;

    const filter = {};

    if (buildingId) {
      if (!mongoose.Types.ObjectId.isValid(buildingId)) {
        return res.status(400).json({ message: "Invalid buildingId." });
      }
      filter.buildingId = buildingId;
    }

    if (floorId) {
      if (!mongoose.Types.ObjectId.isValid(floorId)) {
        return res.status(400).json({ message: "Invalid floorId." });
      }
      filter.floorId = floorId;
    }

    const rooms = await Room.find(filter)
      .sort({ roomNumber: 1 })
      .lean();

    return res.json(rooms);
  } catch (err) {
    console.error("List rooms error:", err);
    return res.status(500).json({ message: "Failed to fetch rooms." });
  }
});

/**
 * DELETE /api/rooms/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Room.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Room not found." });
    return res.json({ message: "Deleted", id: req.params.id });
  } catch (err) {
    console.error("Delete room error:", err);
    return res.status(500).json({ message: "Failed to delete room." });
  }
});

export default router;