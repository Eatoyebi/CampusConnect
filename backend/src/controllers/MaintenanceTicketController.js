import {validationResult} from 'express-validator';
import MaintenanceTicket from '../models/maintenanceTicketModel.js'
import User from '../models/User.js'


export const createTicket = async (req, res) => {
    try {
        const studentId = req.user._id;

        const student = await User.findById(studentId);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        const request = await MaintenanceTicket.create({
            student: studentId,
            universityId: student.universityId || 'N/A',
            buildingId: student.housing?.building || 'N/A',
            floorId: student.housing?.floor || 'N/A',
            roomId: student.housing?.roomNumber || 'N/A',
            location: req.body.location,
            description: req.body.description,
            category: req.body.category,
            priority: req.body.priority,
            emergency: req.body.emergency
        });
        res.status(201).json(request);
    } catch(err) {
        console.error('createTicket error:', err);
        res.status(500).json({ message: 'Server error while creating maintenance request' });
    }
};

//admin view
export const getAllMaintenanceTickets = async (req, res) => {
    const tickets = await MaintenanceTicket.find()
    .populate('student', 'name email')
    .populate('assignedTo', 'name email')

    res.json(tickets);
};

//student view of their own maintenance requests
export const getMyTickets = async (req, res) => {
    const tickets = await MaintenanceTicket.find({
        student: req.user._id
    })
    .populate('assignedTo', 'name email');
     res.json(tickets);
};
//ra view of maintenance requests for their assigned building and floor
export const getRaTickets = async (req, res) => {
    const {buildingId, floorId} = req.user.raInfo;

    const tickets = await MaintenanceTicket.find({
        buildingId: buildingId,
        floorId: floorId
    })
    .populate('student', 'name')
    .populate('assignedTo', 'name');

     res.json(tickets);
}

export const getUnassignedTickets = async (req, res) => {
    const tickets = await MaintenanceTicket.find({
        assignedTo: null
    })
    .populate('student', 'name')
    .sort({ emergency: -1, priority: -1, createdAt: 1 });


    res.json(tickets);
}

export const getAssignedTickets = async (req, res) => {
    const tickets = await MaintenanceTicket.find({
        assignedTo: req.user._id
    })
    .populate('student', 'name')
    .sort({ emergency: -1, priority: -1, createdAt: 1 });

     res.json(tickets);
}

export const updateTicketStatus = async (req, res) => {
    const { status } = req.body;

    const ticket = await MaintenanceTicket.findById(req.params.id);

    if (!ticket) {
        return res.status(404).json({ message: 'ticket not found'});
    }

    const allowed = {
        maintenance: [ 'Assigned', 'In Progress', 'Completed', 'Closed' ],
        ra: [ 'Assigned', 'In Progress', 'Completed', 'Closed' ],
        admin: [ 'Assigned', 'In Progress', 'Completed', 'Closed']
    };


    if(!allowed[req.user.role]?.includes(status)) {
        return res.status(403).json({ message: 'unauthorized role' });
    }

    ticket.status = status;
    await ticket.save();

    const populated = await ticket.populate('assignedTo', 'name')

    res.json(ticket);
}

export const assignTicketToSelf = async (req, res) => {
    try {
        const ticket = await MaintenanceTicket.findById(req.params.id);

    if (!ticket){
        return res.status(404).json({ message: 'Ticket not found'})
    }

if(ticket.assignedTo) {
    return res.status(400).json({ message: 'Ticket already assigned'})
}

ticket.asssignedTo = req.user._id;
ticket.status = 'Assigned';

await ticket.save();

const populated = await ticket.populate('assignedTo', 'name'
)

res.json(populated);
    } catch (err) {
        res.status(500).json({ message: 'Error assigning ticket'})
    }
}