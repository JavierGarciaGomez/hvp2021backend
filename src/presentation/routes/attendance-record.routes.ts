import { createAttendanceRecordService } from "../../application";
import { BaseCRUDRoutes } from "./base-crud.routes";
import { AttendanceRecordController } from "../controllers";
import { AuthMiddleware, authorizationMiddleware } from "../middlewares";
import { WebAppRole } from "../../domain";

export class AttendanceRecordRoutes extends BaseCRUDRoutes {
  protected initializeRoutes(): void {
    const service = createAttendanceRecordService();
    const controller = new AttendanceRecordController(service);

    this.router.get(
      "/collaborator/:collaboratorId/last",
      AuthMiddleware.validateJWT,
      controller.getLastAttendanceRecordByCollaborator
    );
    this.router.patch("/:id", AuthMiddleware.validateJWT, controller.update);

    this.router.delete(
      "/:id",
      AuthMiddleware.validateJWT,
      authorizationMiddleware({
        roles: [WebAppRole.admin, WebAppRole.manager],
      }),
      controller.delete
    );

    this.setupCrudRoutes(controller);
  }
}
