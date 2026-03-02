import { validationResult } from "express-validator";
import StaffUser from "../models/StaffUser.js";
import RaAssignment from "../models/RaAssignment.js";
import User from "../models/User.js";

export const listRAs = async (req, res) => {
  try {
    const ras = await User.find({ role: "ra", isActive: { $ne: false } })
      .select("_id name email role")
      .lean();

    return res.json(ras);
  } catch (err) {
    console.error("listRAs error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const createRaAssignment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { raId, floorId } = req.body;

    const assignment = await RaAssignment.findOneAndUpdate(
      { raId, floorId },
      { $set: { active: true } },
      { upsert: true, new: true }
    );

    return res.status(201).json(assignment);
  } catch (err) {
    // duplicate key protection will throw if you use create instead of upsert
    console.error("createRaAssignment error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const listAssignments = async (req, res) => {
  try {
    const filter = {};
    if (req.query.raId) filter.raId = req.query.raId;
    if (req.query.active) filter.active = req.query.active === "true";

    const assignments = await RaAssignment.find(filter)
      .populate("raId")
      .populate("floorId")
      .lean();

    return res.json(assignments);
  } catch (err) {
    console.error("listAssignments error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deactivateAssignment = async (req, res) => {
  try {
    const updated = await RaAssignment.findByIdAndUpdate(
      req.params.id,
      { $set: { active: false } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Not found" });
    return res.json(updated);
  } catch (err) {
    console.error("deactivateAssignment error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};