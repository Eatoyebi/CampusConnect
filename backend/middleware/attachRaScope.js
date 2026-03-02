import mongoose from "mongoose";
import RaAssignment from "../src/models/RaAssignment.js";
import Room from "../src/models/Room.js";

const { ObjectId } = mongoose.Types;

export default async function attachRaScope(req, res, next) {
  try {
    if (req.user?.role !== "ra") {
      req.raScope = null;
      return next();
    }

    const userId = req.user?._id;
    if (!userId || !ObjectId.isValid(userId)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const assignments = await RaAssignment.find({
      raId: userId,
      active: { $ne: false },
    }).select("floorId");

    const floorIds = assignments.map((a) => a.floorId);

    if (floorIds.length === 0) {
      req.raScope = { raUserId: userId, floorIds: [], roomIds: [] };
      return next();
    }

    const rooms = await Room.find({ floorId: { $in: floorIds } }).select("_id");
    const roomIds = rooms.map((r) => r._id);

    req.raScope = { raUserId: userId, floorIds, roomIds };
    return next();
  } catch (err) {
    console.error("attachRaScope error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}