import express from "express";
import mongoose from "mongoose";
import StudentProfile from "../models/StudentUser.js";
import Room from "../models/Room.js";
import User from "../models/User.js";

const router = express.Router();
console.log("✅ studentRoutes.js LOADED");

// POST /api/students/profile
router.post("/profile", async (req, res) => {
    try {
      const { userId, mNumber, major, graduationYear, bio } = req.body;
  
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Valid userId is required." });
      }
  
      if (!/^\d{8}$/.test(String(mNumber || ""))) {
        return res.status(400).json({ message: "mNumber must be 8 digits." });
      }
  
      const user = await User.findById(userId).lean();
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      if (user.role !== "student") {
        return res.status(400).json({ message: "User is not a student." });
      }
  
      const existing = await StudentProfile.findOne({ user: userId }).lean();
      if (existing) {
        return res.status(409).json({ message: "StudentProfile already exists." });
      }
  
      const created = await StudentProfile.create({
        user: userId,
        mNumber: String(mNumber).trim(),
        major: (major || "").trim(),
        graduationYear: (graduationYear || "").trim(),
        bio: (bio || "").trim(),
        roomId: null,
        housing: {
          building: "",
          roomNumber: "",
          ra: null
        }
      });
  
      return res.status(201).json(created);
    } catch (err) {
      console.error("Create student profile error:", err);
  
      if (err?.code === 11000) {
        return res.status(409).json({ message: "Duplicate mNumber or profile." });
      }
  
      return res.status(500).json({ message: "Failed to create student profile." });
    }
});


/**
 * PUT /api/students/:id/assign-room
 */
router.put("/:id/assign-room", async (req, res) => {
  try {
    const { roomId } = req.body;

    if (!roomId || !mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(400).json({ message: "Valid roomId is required." });
    }

    const room = await Room.findById(roomId)
    .populate("buildingId")
    .populate("floorId");

    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }
    const alreadyAssigned = await StudentProfile.findOne({
      roomId: room._id,
      user: { $ne: req.params.id } // allow re-assigning same room to same user
      }).lean();
    if (alreadyAssigned) {
      return res.status(409).json({ message: "That room is already assigned to another student." });
}

    const student = await StudentProfile.findOneAndUpdate(
        { user: req.params.id },   
        {
          roomId: room._id,
          housing: {
            building: room.buildingId?.name ?? "",
            roomNumber: room.roomNumber ?? ""
          }
        },
        { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    return res.json({
      message: "Room assigned successfully.",
      student
    });

  } catch (err) {
    console.error("Assign room error:", err);
    return res.status(500).json({ message: "Failed to assign room." });
  }
});



export default router;