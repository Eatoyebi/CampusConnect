const StudentProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },

    mNUmber: {
        type: String,
        required: true,
        unique: true,
        match: /^M\d{8}$/
    },
    major: String,
    graduationYear: String,
    bio: { type: String, maxLength: 500 },

    housing: {
        building: String,
        roomNumber: String,
        ra: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }
});

export default mongoose.model("StudentProfile", StudentProfileSchema);