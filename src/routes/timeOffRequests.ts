import { Router } from "express";
import {
  createTimeOffRequest,
  getTimeOffRequests,
  getTimeOffRequestById,
  getTimeOffRequestsByCollaborator,
  getTimeOffRequestsByYear,
  updateTimeOffRequest,
  approveTimeOffRequest,
  deleteTimeOffRequest,
  getCollaboratorVacationsStatus,
} from "../controllers/timeOffRequestsController";

const { validateJwt } = require("../middlewares/validateJwt");
const router = Router();

// GET ALL
router.get("/", validateJwt, getTimeOffRequests);

// GET by collaborator
router.get(
  "/collaborator/:collaboratorId",
  validateJwt,
  getTimeOffRequestsByCollaborator
);

// GET by year
router.get("/year/:year", validateJwt, getTimeOffRequestsByYear);

// GET one by ID
router.get("/:id", validateJwt, getTimeOffRequestById);

// GET collaborator vacation status
router.get(
  "/collaborator/:collaboratorId/vacations-status",
  validateJwt,
  getCollaboratorVacationsStatus
);

// CREATE
router.post("/", validateJwt, createTimeOffRequest);

// UPDATE
router.put("/:id", validateJwt, updateTimeOffRequest);

// APPROVE
router.patch("/:id/approve", validateJwt, approveTimeOffRequest);

// DELETE
router.delete("/:id", validateJwt, deleteTimeOffRequest);

export default router;
