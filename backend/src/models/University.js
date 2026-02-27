import mongoose from "mongoose";

const universitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    code: { 
      type: String, 
      required: true, 
      trim: true, 
      uppercase: true,
      unique: true 
    }
  },
  { timestamps: true }
);

export default mongoose.model("University", universitySchema);