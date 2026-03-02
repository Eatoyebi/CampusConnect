import express from "express";
import { body } from "express-validator";
import {
  createMaintenanceTicket,
  getallMaintenanceTickets,
  updateTicketStatus,
} from "../controllers/maintenanceTicketController.js";

import requireAuth from "../../middleware/requireAuth.js";
import attachRaScope from "../../middleware/attachRaScope.js";

const router = express.Router();

router.post(
  "/",
  requireAuth,
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("mNumber")
      .trim()
      .notEmpty()
      .withMessage("M-Number is required")
      .matches(/^M\d{9}$/)
      .withMessage("Invalid M-Number format"),
    body("roomId")
      .notEmpty()
      .withMessage("roomId is required")
      .isMongoId()
      .withMessage("Invalid roomId"),
    body("location").trim().notEmpty().withMessage("Location is required"),
    body("description").trim().notEmpty().withMessage("Description is required"),
    body("priority")
      .optional()
      .isIn(["Low", "Medium", "High"])
      .withMessage("Invalid priority value"),
    body("assignedTo").optional().trim(),
    body("attachments")
      .optional()
      .isArray()
      .withMessage("Attachments must be an array of strings"),
  ],
  createMaintenanceTicket
);

router.get("/", requireAuth, attachRaScope, getallMaintenanceTickets);

router.patch(
  "/:id/status",
  requireAuth,
  attachRaScope,
  [
    body("status")
      .optional()
      .isIn(["Pending", "In Progress", "Completed/Closed"])
      .withMessage("Invalid status value"),
  ],
  updateTicketStatus
);

export default router;