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
 * POST /api/rooms/seed/all
 * Body: { universityId: string, roomsPerFloor?: number }
 *
 * Seeds rooms for every floor in the given university.
 * Example: floor 1 => 101-120, floor 2 => 201-220, etc.
 */
router.post("/seed/all", async (req, res) => {
    try {
      const { universityId, roomsPerFloor = 20 } = req.body;
  
      if (!universityId || !mongoose.Types.ObjectId.isValid(universityId)) {
        return res.status(400).json({ message: "Valid universityId is required." });
      }
  
      const perFloor = Number(roomsPerFloor);
      if (!Number.isInteger(perFloor) || perFloor <= 0 || perFloor > 200) {
        return res.status(400).json({ message: "roomsPerFloor must be a positive integer (<= 200)." });
      }
  
      // 1) all buildings for this university
      const buildings = await Building.find({ universityId }).select("_id").lean();
      if (!buildings.length) {
        return res.status(404).json({ message: "No buildings found for that universityId." });
      }
  
      const buildingIds = buildings.map(b => b._id);
  
      // 2) all floors under those buildings
      const floors = await Floor.find({ buildingId: { $in: buildingIds } })
        .select("_id buildingId number")
        .lean();
  
      if (!floors.length) {
        return res.status(404).json({ message: "No floors found. Seed floors first." });
      }
  
      // 3) build bulk upserts for rooms
      const ops = [];
  
      for (const floor of floors) {
        const floorNum = Number(floor.number);
  
        for (let i = 1; i <= perFloor; i++) {
          const roomNumber = `${floorNum}${String(i).padStart(2, "0")}`; // 101, 102 ... 120 / 201 ...
          ops.push({
            updateOne: {
              filter: { floorId: floor._id, roomNumber },
              update: {
                $setOnInsert: {
                  buildingId: floor.buildingId,
                  floorId: floor._id,
                  roomNumber,
                  label: "",
                },
              },
              upsert: true,
            },
          });
        }
      }
  
      const result = await Room.bulkWrite(ops);
  
      return res.json({
        message: "Seeded rooms for all floors.",
        floors: floors.length,
        roomsPerFloor: perFloor,
        result,
      });
    } catch (err) {
      console.error("Seed all rooms error:", err);
      return res.status(500).json({ message: "Failed to seed rooms." });
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