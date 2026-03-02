import express from "express";
import requireAuth from "../../middleware/requireAuth.js";
import attachRaScope from "../../middleware/attachRaScope.js";
import StudentProfile from "../models/StudentUser.js"; // exports StudentProfile model

const router = express.Router();

// GET /api/student-profiles
router.get("/", requireAuth, attachRaScope, async (req, res) => {
  try {
    const query = {};

    if (req.user.role === "RA") {
      const roomIds = req.raScope?.roomIds || [];
      if (roomIds.length === 0) return res.json([]);
      query.roomId = { $in: roomIds };
    }

    const students = await StudentProfile.find(query)
      .populate("user", "name email role")
      .lean();

    return res.json(students);
  } catch (err) {
    console.error("student profiles list error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// GET /api/student-profiles/:id
router.get("/:id", requireAuth, attachRaScope, async (req, res) => {
  try {
    const student = await StudentProfile.findById(req.params.id).lean();
    if (!student) return res.status(404).json({ message: "Not found" });

    if (req.user.role === "RA") {
      const roomIds = req.raScope?.roomIds || [];
      const ok =
        student.roomId &&
        roomIds.some((rid) => rid.toString() === student.roomId.toString());

      if (!ok) return res.status(403).json({ message: "Forbidden" });
    }

    return res.json(student);
  } catch (err) {
    console.error("student profile get error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;