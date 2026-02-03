import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, },
  email: {type: String, required: true, unique: true},
  password: String,
  role: {
    type: String,
    enum: ['resident', 'ra', 'admin', 'maintenance'],
    required: true
  },
}, 
{ timestamps: true });

export default mongoose.model("User", UserSchema);
