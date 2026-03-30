import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    room: { type: String, required: true, index: true },
    author: { type: String, required: true },          // display name
    authorId: { type: String, default: "" },           // socket id OR user id later
    message: { type: String, required: true, trim: true, maxlength: 2000 },

    // moderation
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    deleteReason: { type: String, default: "" },
  },
  { timestamps: true }
);

chatMessageSchema.index({ room: 1, createdAt: -1 });

export default mongoose.model("ChatMessage", chatMessageSchema);