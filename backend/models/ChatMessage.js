import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    room: { type: String, required: true, index: true },
    author: { type: String, required: true },
    authorId: { type: String, default: "" }, // 
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    time: { type: String, default: "" }      // optional, keeps UI time
  },
  { timestamps: true }
);

chatMessageSchema.index({ room: 1, createdAt: -1 });

export default mongoose.model("ChatMessage", chatMessageSchema);