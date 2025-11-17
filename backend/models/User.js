import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  major: { type: String },
  graduationYear: { type: String },
  bio: { type: String },
  profileImage: { type: String },

  housing: {
    building: { type: String },
    roomNumber: { type: String },
    raId: { type: String },
  }
}, {
  timestamps: true
});

export default mongoose.model("User", UserSchema);
