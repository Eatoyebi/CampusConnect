import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    buildingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Building",
      required: true,
    },
    floorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Floor",
      required: true,
    },
    roomNumber: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    label: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "",
    },
  },
  { timestamps: true }
);

// Prevent duplicates within a floor
roomSchema.index({ floorId: 1, roomNumber: 1 }, { unique: true });

export default mongoose.model("Room", roomSchema);