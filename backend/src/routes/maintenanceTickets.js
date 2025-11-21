import express from 'express';
import { body } from 'express-validator';
import { createMaintenanceTicket, getallMaintenanceTickets, updateTicketStatus } from '../controllers/maintenanceController.js';

const router = express.Router();

// Route to create a new maintenance ticket
// POST /api/maintenance-tickets
router.post(
    '/',
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('mNumber').trim().notEmpty().withMessage('M-Number is required')            
            .matches((/^M\d{6,10}$/)).withMessage('Invalid M-Number format'),
        body('location').trim().notEmpty().withMessage('Location is required'),
        body('description').trim().notEmpty().withMessage('Description is required'),
        body('priority').optional().isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority value'),
        body('assignedTo').optional().trim(),
        body('attachments').optional().isArray().withMessage('Attachments must be an array of strings'),
    ],
    createMaintenanceTicket
);


// GET /api/maintenance-tickets

router.get('/', getallMaintenanceTickets);

// PATCH /api/maintenance-tickets/:id/status
router.patch('/:id/status', [
    body('status').optional().isIn(['Pending', 'In Progress', 'Completed/Closed']).withMessage('Invalid status value'),
    ],
    updateTicketStatus);

export default router;