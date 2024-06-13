import { Router } from "express";
import { AttendanceRecordsService } from "./attendanceRecordService";
import { AttendanceRecordsController } from "./attendanceRecordsController";
import { AuthMiddleware } from "../../../middlewares";
const { validateJwt } = require("../../../middlewares/validateJwt");

export enum AttendanceRecordsPaths {
  all = "/",
  current = "/current",
  byCollaborator = "/collaborator/:collaboratorId",
  lastByCollaborator = "/collaborator/:collaboratorId/last",
  byId = "/:id",
  create = "/",
  update = "/:id",
  delete = "/:id",
}

export class AttendanceRecordsRoutes {
  static get routes(): Router {
    const router = Router();
    const service = new AttendanceRecordsService();
    const controller = new AttendanceRecordsController(service);

    router.use(AuthMiddleware.validateJWT);

    router.get(AttendanceRecordsPaths.all, controller.getAttendanceRecords);
    router.get(
      AttendanceRecordsPaths.byCollaborator,
      controller.getAttendanceRecordsByCollaborator
    );
    router.get(
      AttendanceRecordsPaths.current,
      controller.getCurrentAttendanceRecords
    );

    router.get(
      AttendanceRecordsPaths.lastByCollaborator,
      controller.getLastAttendanceRecordByCollaborator
    );

    router.get(AttendanceRecordsPaths.byId, controller.getAttendanceRecordById);

    router.post(
      AttendanceRecordsPaths.create,
      controller.createAttendanceRecord
    );
    router.patch(
      AttendanceRecordsPaths.update,
      controller.updateAttendanceRecord
    );

    router.delete(
      AttendanceRecordsPaths.delete,
      controller.deleteAttendanceRecord
    );

    return router;
  }
}
