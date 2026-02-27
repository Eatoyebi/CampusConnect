import express from 'express';
import { body } from 'express-validator';
import { authorize } from '../middleware/requiredAuth.js';
import { authenticate } from '../middleware/requireRole.js';
import {
    createRequest,
    getMyRequests,
    getRaRequests,
    getAssignedRequests,
    getAllMaintenanceTickets
} from '../controllers/maintenanceTicketController.js';

const router = express.Router();

router.post('/create', authorize(['student']), createRequest);

router.get('/my-requests', authorize(['student']), getMyRequests);

router.get('/ra-requests', authorize(['ra']),getRaRequests);

router.get('/assigned-requests', authorize(['maintenance']),getAssignedRequests);

router.get('/all', authorize(['admin']),getAllMaintenanceTickets);

router.patch('/:id/status', authorize(['ra', 'maintenance']), updateTicketStatus);



export default router;