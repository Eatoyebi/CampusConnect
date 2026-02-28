import mongoose from "mongoose";

const floorSchema = new mongoose.Schema(
  {
    universityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "University",
        required: true,
        index: true,
        },
    buildingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Building",
      required: true,
      index: true,
    },

    number: { type: Number, required: true },

    // optional but nice: "1st Floor", "Basement", etc
    name: { type: String, default: "", trim: true },

    // prevent duplicates per building (no two "Floor 2" in same building)
  },
  { timestamps: true }
);

floorSchema.index({ universityId: 1, buildingId: 1, number: 1 }, { unique: true });

export default mongoose.model("Floor", floorSchema);