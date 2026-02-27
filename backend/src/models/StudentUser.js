import mongoose from "mongoose";

const StudentProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },

    mNumber: {
        type: String,
        required: true,
        unique: true,
        match: /^M?\d{8}$/
    },
    major: String,
    graduationYear: String,
    bio: { type: String, maxLength: 500 },
    
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        default: null,
        index: true,
    },

    housing: {
        building: String,
        roomNumber: String,
        ra: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }
});

StudentProfileSchema.index(
    { roomId: 1 },
    { unique: true, partialFilterExpression: { roomId: { $type: "objectId" } } }
  );

export default mongoose.model("StudentProfile", StudentProfileSchema);