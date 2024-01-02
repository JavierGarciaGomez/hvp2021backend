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
  getCollaboratorTimeOffStatus,
} from "../controllers/timeOffRequestsController";
import isAuthorized from "../middlewares/isAuthorized";
import { CollaboratorRole } from "../models/Collaborator";

const { validateJwt } = require("../middlewares/validateJwt");
const router = Router();
router.use(validateJwt);

// GET ALL
router.get("/", getTimeOffRequests);

// GET by collaborator
router.get("/collaborator/:collaboratorId", getTimeOffRequestsByCollaborator);

// GET by year
router.get("/year/:year", getTimeOffRequestsByYear);

// GET one by ID
router.get("/:id", getTimeOffRequestById);

// GET collaborator vacation status
router.get(
  "/collaborator/:collaboratorId/vacations-status",
  getCollaboratorTimeOffStatus
);

// CREATE
router.post("/", createTimeOffRequest);

// UPDATE
router.put(
  "/:id",
  isAuthorized([CollaboratorRole.admin, CollaboratorRole.manager], true),
  updateTimeOffRequest
);

// APPROVE
router.patch(
  "/:id/approve",
  isAuthorized([CollaboratorRole.admin, CollaboratorRole.manager]),
  approveTimeOffRequest
);

// DELETE
router.delete(
  "/:id",
  isAuthorized([CollaboratorRole.admin, CollaboratorRole.manager], true),
  deleteTimeOffRequest
);

export default router;
