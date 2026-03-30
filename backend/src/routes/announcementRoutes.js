import express from "express";
import Announcement from "../models/Announcement.js";

const router = express.Router();

// Create announcement
router.post("/", async (req, res) => {
  try {
    const { title, body, postedBy, audience, building } = req.body;

    if (!title?.trim() || !body?.trim()) {
      return res.status(400).json({ message: "Title and body are required." });
    }

    const created = await Announcement.create({
      title: title.trim(),
      body: body.trim(),
      postedBy: postedBy?.trim() || "RA",
      audience: audience || "All",
      building: building?.trim() || "",
    });

    return res.status(201).json(created);
  } catch (err) {
    console.error("Create announcement error:", err);
    return res.status(500).json({ message: "Failed to create announcement." });
  }
});

// Get announcements
router.get("/", async (req, res) => {
  try {
    const { audience } = req.query;

    const filter = {};
    if (audience && audience !== "All") {
      filter.$or = [{ audience: "All" }, { audience }];
    }

    const announcements = await Announcement.find(filter)
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return res.json(announcements);
  } catch (err) {
    console.error("Get announcements error:", err);
    return res.status(500).json({ message: "Failed to fetch announcements." });
  }
});
// DELETE /api/announcements/
router.delete("/:id", async (req, res) => {
    try {
      const deleted = await Announcement.findByIdAndDelete(req.params.id);
  
      if (!deleted) {
        return res.status(404).json({ message: "Announcement not found." });
      }
  
      return res.json({ message: "Deleted", id: req.params.id });
    } catch (err) {
      console.error("Delete announcement error:", err);
      return res.status(500).json({ message: "Failed to delete announcement." });
    }
  });
  

export default router;
