import express from "express";
import { body } from "express-validator";
import requireAuth from "../../middleware/requireAuth.js";
import requireAdmin from "../../middleware/requireAdmin.js";
import {
  listRAs,
  createRaAssignment,
  listAssignments,
  deactivateAssignment,
} from "../controllers/raAssignmentController.js";

const router = express.Router();

// Admin only
router.get("/ras", requireAuth, requireAdmin, listRAs);

router.post(
  "/",
  requireAuth,
  requireAdmin,
  [
    body("raId").notEmpty().isMongoId().withMessage("Invalid raId"),
    body("floorId").notEmpty().isMongoId().withMessage("Invalid floorId"),
  ],
  createRaAssignment
);

router.get("/", requireAuth, requireAdmin, listAssignments);

router.patch("/:id/deactivate", requireAuth, requireAdmin, deactivateAssignment);

export default router;