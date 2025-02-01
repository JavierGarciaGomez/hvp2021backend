import { createAttendanceReportService } from "../../application/factories/attendance-report.factory";
import { AttendanceReportController } from "../controllers/attendance-report.controller";
import { Router } from "express";
import { AuthMiddleware } from "../middlewares";

export class AttendanceReportRoutes {
  protected router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    const service = createAttendanceReportService();
    const controller = new AttendanceReportController(service);

    this.router.get("/", AuthMiddleware.validateJWT, controller.getAll);
    this.router.get(
      "/:collaboratorId",
      AuthMiddleware.validateJWT,
      controller.getByCollaboratorId
    );
  }

  public getRoutes(): Router {
    return this.router;
  }
}
