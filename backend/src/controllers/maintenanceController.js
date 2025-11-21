import {validationResult} from 'express-validator';
import maintenanceTicket from '../models/maintenanceTicketModel.js';

export const createMaintenanceTicket = async (req, res) => {
    //results forom Express Validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() }); //Bad Request

    const { name, mNumber, location, description, assignedTo, priority, attachments } = req.body;

    //create new maintenance ticket
    try {
        const newTicket = new maintenanceTicket({ name, mNumber, location, description, assignedTo, priority, attachments });
        const savedTicket = await newTicket.save();
        return res.status(201).json(savedTicket); //Ticket created
    } 
    catch (err) {
        console.error('createMaintenanceTicket error:', err);
        return res.status(500).json({ message: 'Server error while creating maintenace ticket' }); //Internal Server Error
    }
};

export const getallMaintenanceTickets = async (req, res) => {
    try {
        const filter = {}; // Initialize an empty filter object
        if (req.query.status ) filter.status = req.query.status;
        const tickets = await maintenanceTicket.find(filter).sort({ createdAt: -1}).lean(); //sort by most recent
        return res.json(tickets);
    }
    catch (err) {
        console.error('getAllMaintenanceTickets error:', err);
        return res.status(500).json({ message: 'Server error while fetching maintenance tickets' }); //Internal Server Error
    }
};


export const updateTicketStatus = async (req, res) => {
    const ticketId = req.params.id; //ticket id from url params
    const { status } = req.body; //new status from request body

    //validate status of ticket
    const allowed = ['Pending', 'In Progress', 'Completed/Closed'];
    if (status && !allowed.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' }); //Bad Request
    }

    try {
        const update = { updatedAt: Date.now() };
        if (status) update.status = status;

        //find ticket by id and update
        const ticket = await maintenanceTicket.findByIdAndUpdate(ticketId, { $set: update }, { new: true });
        if (!ticket) return res.status(404).json({ message: 'Maintenance ticket not found' })
        return res.json(ticket);
    } 
    catch (err) {
        console.error('updateTicketStatus error:', err);
        return res.status(500).json({ message: 'Server error updating ticket status' }); //Internal Server Error
    }
}