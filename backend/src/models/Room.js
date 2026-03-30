import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    buildingId: { type: mongoose.Schema.Types.ObjectId, ref: "Building", required: true },
    floorId: { type: mongoose.Schema.Types.ObjectId, ref: "Floor", required: true },

    roomNumber: { type: String, required: true, trim: true, maxlength: 20 }, // "101", "215A"
    label: { type: String, trim: true, maxlength: 120, default: "" }, // optional display name
  },
  { timestamps: true }
);

// prevent duplicates within building + within floor
roomSchema.index({ floorId: 1, roomNumber: 1 }, { unique: true });

export default mongoose.model("Room", roomSchema);