import mongoose from "mongoose";

const RaAssignmentSchema = new mongoose.Schema(
  {
    raId: { type: mongoose.Schema.Types.ObjectId, ref: "StaffProfile", required: true },
    floorId: { type: mongoose.Schema.Types.ObjectId, ref: "Floor", required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Prevent duplicate RA + floor
RaAssignmentSchema.index({ raId: 1, floorId: 1 }, { unique: true });

export default mongoose.model("RaAssignment", RaAssignmentSchema);