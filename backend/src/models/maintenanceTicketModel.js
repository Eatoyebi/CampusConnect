import mongoose from 'mongoose';

// Define the schema for a maintenance ticket for mongoDB
const maintenanceTicketSchema = new mongoose.Schema({

    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    universityId: { type: String, required: true },
    buildingId: {
        type: String,
        required: true,
        index: true
    },

    floorId: {
        type: String,
        required: true,
        index: true
    },

    roomId: {
        type: String,
        required: true,
    },

    location: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, enum: ['Plumbing', 'Electrical', 'HVAC', 'General', 'Other'], required: true },
    emergency: { type: Boolean, default: false },
    photoUrl: { type: String},
    attachments: [String],
    status: {type: String, enum: ['Pending', 'Assigned', 'In Progress', 'Completed', 'Closed'], default: 'Pending'},
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },

    notes: [
        {
            text: String,
            author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            createdAt: { type: Date, default: Date.now}
        }
    ],
}, 

{ timestamps: true });

//update the updatedAt field before saving
maintenanceTicketSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model('MaintenanceTicket', maintenanceTicketSchema)



