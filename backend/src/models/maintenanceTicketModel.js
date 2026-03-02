import mongoose from "mongoose";

// Define the schema for a maintenance ticket for MongoDB
const maintenanceTicketSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    mNumber: { type: String, required: true, trim: true },

    //Permissions to housing structure
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    location: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed/Closed"],
      default: "Pending",
    },
    assignedTo: { type: String, trim: true },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    attachments: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("MaintenanceTicket", maintenanceTicketSchema);