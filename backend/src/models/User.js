import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    // University scoping
    universityId: { type: String, required: true, index: true }, // e.g., "UC"

    name: { type: String, required: true },

    // email is still required, but uniqueness is enforced per-university via index below
    email: { type: String, required: true, lowercase: true, trim: true },

    // Auth (store only hash, never plaintext)
    passwordHash: { type: String, required: true },

    role: {
      type: String,
      enum: ["student", "ra", "admin", "maintenance"],
      default: "student",
      required: true,
    },

    // optional security flags
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },

    // --- Profile references ---
    studentProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentProfile",
    },

    maintenanceProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MaintenanceProfile",
    },

    staffProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StaffProfile",
    },

    // --- Existing user fields---
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

// Uniqueness per university
UserSchema.index({ universityId: 1, email: 1 }, { unique: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;