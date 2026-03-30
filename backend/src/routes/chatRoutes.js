import express from "express";
import requireAuth from "../../middleware/requireAuth.js";
import requireRole from "../../middleware/requireRole.js";
import ChatMessage from "../models/ChatMessage.js";
import ModerationFlag from "../models/ModerationFlag.js";

const router = express.Router();

/**
 * GET recent messages for a room (optional HTTP route; sockets also send history)
 * /api/chat/rooms/:room/messages?limit=50
 */
router.get("/rooms/:room/messages", requireAuth, async (req, res) => {
  const { room } = req.params;
  const limit = Math.min(parseInt(req.query.limit || "50", 10), 200);

  const msgs = await ChatMessage.find({ room })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  res.json(msgs.reverse());
});

/**
 * RA/Admin: soft delete a message
 * DELETE /api/chat/messages/:id
 */
router.delete(
  "/messages/:id",
  requireAuth,
  requireRole(["ra", "admin"]),
  async (req, res) => {
    const { id } = req.params;
    const reason = (req.query.reason || "").toString().slice(0, 200);

    const msg = await ChatMessage.findById(id);
    if (!msg) return res.status(404).json({ message: "Message not found" });

    if (!msg.isDeleted) {
      msg.isDeleted = true;
      msg.deletedAt = new Date();
      msg.deletedBy = req.user.id;
      msg.deleteReason = reason;
      await msg.save();
    }

    res.json({ message: "Deleted", id, room: msg.room });
  }
);

/**
 * RA/Admin: flag a user/message
 * POST /api/chat/flags
 */
router.post(
  "/flags",
  requireAuth,
  requireRole(["ra", "admin"]),
  async (req, res) => {
    const { room, targetUserId, targetAuthor, messageId, reason } = req.body;

    if (!room) return res.status(400).json({ message: "room is required" });

    const flag = await ModerationFlag.create({
      room,
      flaggedBy: req.user.id,
      targetUserId: targetUserId || null,
      targetAuthor: targetAuthor || "",
      messageId: messageId || null,
      reason: (reason || "").toString().slice(0, 500),
    });

    res.status(201).json(flag);
  }
);

export default router;