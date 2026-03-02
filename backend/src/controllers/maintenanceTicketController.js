import { validationResult } from "express-validator";
import MaintenanceTicket from "../models/maintenanceTicketModel.js";

export const createMaintenanceTicket = async (req, res) => {
  // results from Express Validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const {
    name,
    mNumber,
    roomId,
    location,
    description,
    assignedTo,
    priority,
    attachments,
  } = req.body;

  try {
    const newTicket = new MaintenanceTicket({
      name,
      mNumber,
      roomId,
      location,
      description,
      assignedTo,
      priority,
      attachments,
    });

    const savedTicket = await newTicket.save();
    return res.status(201).json(savedTicket);
  } catch (err) {
    console.error("createMaintenanceTicket error:", err);
    return res
      .status(500)
      .json({ message: "Server error while creating maintenance ticket" });
  }
};

export const getallMaintenanceTickets = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    // RA scoping
    if (req.user?.role === "RA") {
      const roomIds = req.raScope?.roomIds || [];
      if (roomIds.length === 0) return res.json([]);
      filter.roomId = { $in: roomIds };
    }

    const tickets = await MaintenanceTicket.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return res.json(tickets);
  } catch (err) {
    console.error("getAllMaintenanceTickets error:", err);
    return res
      .status(500)
      .json({ message: "Server error while fetching maintenance tickets" });
  }
};

export const updateTicketStatus = async (req, res) => {
  const ticketId = req.params.id;
  const { status } = req.body;

  const allowed = ["Pending", "In Progress", "Completed/Closed"];
  if (status && !allowed.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    // Fetch first for authorization checks
    const existing = await MaintenanceTicket.findById(ticketId).select("roomId");
    if (!existing) {
      return res.status(404).json({ message: "Maintenance ticket not found" });
    }

    // RA cannot update tickets outside their assigned rooms
    if (req.user?.role === "RA") {
      const roomIds = req.raScope?.roomIds || [];
      const ok =
        existing.roomId &&
        roomIds.some((rid) => rid.toString() === existing.roomId.toString());

      if (!ok) return res.status(403).json({ message: "Forbidden" });
    }

    const update = {};
    if (status) update.status = status;

    const ticket = await MaintenanceTicket.findByIdAndUpdate(
      ticketId,
      { $set: update },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: "Maintenance ticket not found" });
    }
    return res.json(ticket);
  } catch (err) {
    console.error("updateTicketStatus error:", err);
    return res.status(500).json({ message: "Server error updating ticket status" });
  }
};