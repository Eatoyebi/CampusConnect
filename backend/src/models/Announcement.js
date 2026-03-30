import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    body: { type: String, required: true, trim: true, maxlength: 2000 },

    // optional but useful
    postedBy: { type: String, default: "RA", trim: true }, // or store userId later
    audience: { type: String, enum: ["Student", "RA", "All"], default: "All" },

    // optional: location context
    building: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Announcement", announcementSchema);
