import mongoose from "mongoose";

const buildingSchema = new mongoose.Schema(
    {
      universityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "University",
        required: true,
        index: true,
      },
  
      name: { type: String, required: true, trim: true, maxlength: 120 },
  
      code: { type: String, required: true, trim: true, unique: true },
    },
    { timestamps: true }
  );

export default mongoose.model("Building", buildingSchema);

