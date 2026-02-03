import mongoose from "mongoose";

const MaintenanceProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },

    tickets: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'MaintenanceTicket',
        default: []
    }
});

export default mongoose.model('MaintenanceProfile', MaintenanceProfileSchema);