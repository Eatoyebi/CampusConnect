import mongoose from "mongoose";
import StaffUser from "../src/models/StaffUser.js";
import RaAssignment from "../src/models/RaAssignment.js";
import Room from "../src/models/Room.js";

const { ObjectId } = mongoose.Types;

export default async function attachRaScope(req, res, next) {
  try {
    if (req.user?.role !== "RA") {
      req.raScope = null;
      return next();
    }

    const userId = req.user?._id;
    if (!userId || !ObjectId.isValid(userId)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const staff = await StaffUser.findOne({ user: userId }).select("_id user");
    if (!staff?._id) {
      return res.status(403).json({ message: "RA staff profile not found" });
    }

    const assignments = await RaAssignment.find({
      raId: staff._id,
      active: { $ne: false },
    }).select("floorId");

    const floorIds = assignments.map((a) => a.floorId);

    if (floorIds.length === 0) {
      req.raScope = { staffProfileId: staff._id, floorIds: [], roomIds: [] };
      return next();
    }

    const rooms = await Room.find({ floorId: { $in: floorIds } }).select("_id");
    const roomIds = rooms.map((r) => r._id);

    req.raScope = { staffProfileId: staff._id, floorIds, roomIds };
    return next();
  } catch (err) {
    console.error("attachRaScope error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}