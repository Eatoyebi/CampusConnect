import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },

    role: {
      type: String,
      enum: ["student", "ra", "admin"],
      default: "student",
    },

    profile: {
      major: { type: String },
      graduationYear: { type: String },
      bio: { type: String },
      profileImage: { type: String },
    },

    // student housing info
    housing: {
      building: { type: String },
      roomNumber: { type: String },
      raId: { type: String },
    },

    // RA assignment info
    raAssignment: {
      building: { type: String },
      floor: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
