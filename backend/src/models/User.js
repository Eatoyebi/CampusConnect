import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, },
  email: {type: String, required: true, unique: true},
  password: String,
  role: {
    type: String,
    enum: ['student', 'ra', 'admin', 'maintenance'],
    default: 'student',
    required: true
  },
}, 
{ timestamps: true });

UserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  }
  )

UserSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model("User", UserSchema);
