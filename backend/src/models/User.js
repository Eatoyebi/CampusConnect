import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },

    // auth (optional for now, but future proof)
    password: { type: String },

    role: {
      type: String,
      enum: ["student", "ra", "admin", "maintenance"],
      default: "student",
      required: true,
    },

    major: { type: String },
    graduationYear: { type: String },
    bio: { type: String },
    profileImage: { type: String },

    housing: {
      building: { type: String },
      roomNumber: { type: String },
      raId: { type: String },
    },

    raAssignment: {
      building: { type: String },
      floor: { type: String },
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
