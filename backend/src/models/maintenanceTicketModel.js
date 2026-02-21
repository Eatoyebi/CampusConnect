import mongoose from 'mongoose';

// Define the schema for a maintenance ticket for mongoDB
const maintenanceTicketSchema = new mongoose.Schema({

    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudentUser',
        required: true
    },
    location: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, enum: ['Plumbing', 'Electrical', 'HVAC', 'General', 'Other'], required: true },
    emergency: { type: Boolean, default: false },
    photoUrl: String,
    attachments: [String],
    status: {type: String, enum: ['Pending', 'Assigned', 'In Progress', 'Completed', 'Closed'], default: 'Pending'},
    createdAt: { type: Date, default: Date.now},
    updatedAt: { type: Date, default: Date.now},
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'MaintenanceUser' },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },

    notes: [
        {
            text: String,
            author: { type: mongoose.Schema.Types.ObjectId, ref: 'MaintenanceUser' },
            createdAt: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

//update the updatedAt field before saving
maintenanceTicketSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model('MaintenanceTicket', maintenanceTicketSchema)



