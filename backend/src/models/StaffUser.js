const StaffProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },

    department: { type: String, required: true},
    jobTitle: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true},
    admin: { type: Boolean, default: false }

});

export default mongoose.model('StaffProfile', StaffProfileSchema);