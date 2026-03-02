import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true },
    floorId: { type: mongoose.Schema.Types.ObjectId, ref: "Floor", required: true },
    buildingId: { type: mongoose.Schema.Types.ObjectId, ref: "Building", required: true },
    label: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Room", RoomSchema);