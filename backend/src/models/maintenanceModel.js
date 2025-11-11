import mongoose from 'mongoose';

// Define the schema for a maintenance ticket for mongoDB
const maintenanceTicketSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    mNumber: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed/Closed'],
        default: 'Pending'
    },
    createdAt: { type: Date, default: Date.now},
    updatedAt: { type: Date, default: Date.now},
    assignedTo: { type: String, trim: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    attachments: [{ type: String }]
});

//update the updatedAt field before saving
maintenanceTicketSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model('MaintenanceTicket', maintenanceTicketSchema)