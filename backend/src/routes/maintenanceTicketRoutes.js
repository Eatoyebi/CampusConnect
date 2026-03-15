import express from 'express';
import { body } from 'express-validator';
import requireAuth  from '../../middleware/requireAuth.js';
import { requireRole } from  '../../middleware/requireRole.js';
import {
    createTicket,
    getMyTickets,
    getRaTickets,
    getAssignedTickets,
    getAllMaintenanceTickets,
    updateTicketStatus
} from '../controllers/maintenanceTicketController.js';

const router = express.Router();

router.post('/create', requireAuth, requireRole('student'), createTicket);

router.get('/my-tickets', requireAuth, requireRole('student'), getMyTickets);

router.get('/ra-tickets', requireAuth,requireRole('ra'), getRaTickets);

router.get('/assigned-tickets', requireAuth,requireRole('maintenance'), getAssignedTickets);

router.get('/all', requireAuth, requireRole('admin'), getAllMaintenanceTickets);

router.patch('/:id/status', requireAuth, requireRole('ra', 'maintenance'), updateTicketStatus);



export default router;