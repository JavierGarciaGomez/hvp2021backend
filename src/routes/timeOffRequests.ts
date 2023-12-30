import { Router } from "express";
import {
  createTimeOffRequest,
  getTimeOffRequests,
} from "../controllers/timeOffRequestsController";

const { validateJwt } = require("../middlewares/validateJwt");
const router = Router();
// GET ALL
router.get("/", validateJwt, getTimeOffRequests);

// GET

// Update

// CREATE
router.post("/", validateJwt, createTimeOffRequest);

// Delete

export default router;
