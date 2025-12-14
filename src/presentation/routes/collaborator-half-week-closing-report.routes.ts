import { CollaboratorHalfWeekClosingReportController } from "../controllers";
import {
  CollaboratorHalfWeekClosingReportRepositoryImpl,
  CollaboratorHalfWeekClosingReportDataSourceMongoImp,
} from "../../infrastructure";
import { CollaboratorHalfWeekClosingReportService } from "../../application";
import { AuthMiddleware } from "../middlewares";
import { BaseCRUDRoutes } from "./base-crud.routes";
import { WebAppRole } from "../../domain";
import { authorizationMiddleware } from "../middlewares/authorization.middleware";

export class CollaboratorHalfWeekClosingReportRoutes extends BaseCRUDRoutes {
  protected initializeRoutes(): void {
    const datasource =
      new CollaboratorHalfWeekClosingReportDataSourceMongoImp();
    const repository = new CollaboratorHalfWeekClosingReportRepositoryImpl(
      datasource
    );
    const service = new CollaboratorHalfWeekClosingReportService(repository);
    const controller = new CollaboratorHalfWeekClosingReportController(service);

    // Get all reports
    this.router.get(
      "/",
      AuthMiddleware.validateJWT,

      controller.getAll
    );

    // Get report by ID
    this.router.get(
      "/:id",
      AuthMiddleware.validateJWT,

      controller.getById
    );

    // Get reports by collaborator ID
    this.router.get(
      "/collaborator/:collaboratorId",
      AuthMiddleware.validateJWT,

      controller.getByCollaboratorId
    );

    // Get reports by date range
    this.router.get(
      "/date-range",
      AuthMiddleware.validateJWT,

      controller.getByDateRange
    );

    // Get reports by collaborator and date range
    this.router.get(
      "/collaborator/:collaboratorId/date-range",
      AuthMiddleware.validateJWT,

      controller.getByCollaboratorAndDateRange
    );

    // Create or update report (upsert) - this is now the default behavior for POST
    this.router.post(
      "/",
      AuthMiddleware.validateJWT,
      authorizationMiddleware({
        roles: [WebAppRole.admin, WebAppRole.manager],
      }),
      controller.create
    );

    // Explicit upsert endpoint
    this.router.post(
      "/upsert",
      AuthMiddleware.validateJWT,
      authorizationMiddleware({
        roles: [WebAppRole.admin, WebAppRole.manager],
      }),
      controller.upsert
    );

    // Update report
    this.router.patch(
      "/:id",
      AuthMiddleware.validateJWT,
      authorizationMiddleware({
        roles: [WebAppRole.admin, WebAppRole.manager],
      }),
      controller.update
    );

    // Delete multiple reports
    this.router.delete(
      "/bulk",
      AuthMiddleware.validateJWT,
      authorizationMiddleware({
        roles: [WebAppRole.admin],
      }),
      controller.deleteMany
    );

    // Delete report
    this.router.delete(
      "/:id",
      AuthMiddleware.validateJWT,
      authorizationMiddleware({
        roles: [WebAppRole.admin],
      }),
      controller.delete
    );

    // Create multiple reports
    this.router.post(
      "/bulk",
      AuthMiddleware.validateJWT,
      authorizationMiddleware({
        roles: [WebAppRole.admin, WebAppRole.manager],
      }),
      controller.createMany
    );

    // Update multiple reports
    this.router.patch(
      "/bulk",
      AuthMiddleware.validateJWT,
      authorizationMiddleware({
        roles: [WebAppRole.admin, WebAppRole.manager],
      }),
      controller.updateMany
    );
  }
}
