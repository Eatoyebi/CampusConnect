import mongoose from "mongoose";

const moderationFlagSchema = new mongoose.Schema(
  {
    room: { type: String, required: true, index: true },

    // who flagged
    flaggedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // who is being flagged (store both for flexibility)
    targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    targetAuthor: { type: String, default: "" },

    messageId: { type: mongoose.Schema.Types.ObjectId, ref: "ChatMessage", default: null },

    reason: { type: String, default: "" },
    status: { type: String, enum: ["open", "reviewed", "dismissed"], default: "open" },
  },
  { timestamps: true }
);

export default mongoose.model("ModerationFlag", moderationFlagSchema);