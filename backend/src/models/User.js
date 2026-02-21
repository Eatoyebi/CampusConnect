import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
{

  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["student", "ra", "maintenance", "admin"],
    default: "student",
    required: true
  },

  studentInfo: {
    mNumber: {
      type: String,
      match: /^M\d{8}$/ // M########
    },

    major: String,
    graduationYear: String,

    housing: {
      building: String,
      roomNumber: String,

      ra: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    }
  },

  raInfo: {
    building: String,
    floor: String
  },

  maintenanceInfo: {
    department: String,
    jobTitle: String,
    phoneNumber: String
  },

  bio: {
    type: String,
    maxlength: 500
  },

  profileImage: String
},
{
  timestamps: true
}

UserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model("User", UserSchema);
