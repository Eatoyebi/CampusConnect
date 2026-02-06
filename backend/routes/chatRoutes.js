import express from "express";
import ChatMessage from "../models/ChatMessage.js";

const router = express.Router();

// GET /api/chat/:room/messages?limit=50
router.get("/:room/messages", async (req, res) => {
  try {
    const { room } = req.params;
    const limit = Math.min(parseInt(req.query.limit || "50", 10), 200);

    const messages = await ChatMessage.find({ room })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // return chronological order (oldest -> newest)
    res.json(messages.reverse());
  } catch (err) {
    console.error("Error fetching chat messages:", err);
    res.status(500).json({ error: "Failed to fetch chat messages" });
  }
});

export default router;