import {validationResult} from 'express-validator';
import maintenanceTicket from './models/MaintenanceTicketModel.js';

export const createRequest = async (req, res) => {
    try {
        const studentId = req.user.id;

        const student = await User.findById(studentId);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        const request = await MaintenanceREquest.create({
        student: studentId,

        universityId: student.universityId,
        
        buildingId: student.housing.building,
        floorId: student.housing.floor,
        roomId: student.housing.roomId,

        description: req.body.description,
        castegory: req.body.category,
        priority: req.body.priority,
        emegerncy: req.body.emergency
    });
    return res.status(201).json(request);
} catch(err) {
    res.status(500).json({ message: 'Server error while creating maintenance request' });
    }
};

    


//admin view
export const getAllMaintenanceTickets = async (req, res) => {
    const tickets = await MaintenanceRequest.find();
    return res.json(tickets);
};

//student view of their own maintenance requests
export const getMyRequests = async (req, res) => {
    const tickets = await MaintenanceRequest.find({
        student: req.user.id
    });
    return res.json(tickets);
};
//ra view of maintenance requests for their assigned building and floor
export const getRaRequests = async (req, res) => {
    const {buildingId, floorId} = req.user.raRassignment;

    const tickets = await MaintenanceRequest.find({
        buildingId: buildingId,
        floorId: floorId
    });
    return res.json(tickets);
}


export const getAssignedRequests = async (req, res) => {
    const tickets = await MaintenanceRequest.find({
        assignedTo: req.user.id
    });
    return res.json(tickets);
}

export const updateTicketStatus = async (req, res) => {
    const { status } = req.body;

    const ticket = await MaintenanceRequest.findById(req.params.id);

    const allowed = {
        maintenance: [ 'Assigned', 'In Progress', 'Completed', 'Closed' ],
        ra: [ 'Assigned', 'In Progress', 'Completed', 'Closed' ],
        admin: [ 'Assigned', 'In Progress', 'Completed', 'Closed']
    };


    if(!allowed[req.user.role]?.includes(status)) {
        return res.status(403).json('unauthorized role');
    }

    ticket.status = status;
    await ticket.save();

    res.json(ticket);
}