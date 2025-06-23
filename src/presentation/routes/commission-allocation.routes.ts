import { createCommissionAllocationService } from "../../application";
import { BaseCRUDRoutes } from "./base-crud.routes";
import { CommissionAllocationController } from "../controllers";
import { AuthMiddleware, authorizationMiddleware } from "../middlewares";
import { WebAppRole } from "../../domain";
import { AuthenticatedRequest, BaseError } from "../../shared";
import { Response, NextFunction } from "express";

// Custom middleware to allow admin/manager or the collaborator themselves
const collaboratorStatsAuthMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authenticatedUser = req.authUser;
  const collaboratorId = req.params.collaboratorId;

  if (!authenticatedUser) {
    throw BaseError.unauthorized("Unauthorized");
  }

  const isAdminOrManager = [WebAppRole.admin, WebAppRole.manager].includes(
    authenticatedUser.role
  );

  const isSameCollaborator =
    authenticatedUser.uid.toString() === collaboratorId;

  if (isAdminOrManager || isSameCollaborator) {
    return next();
  }

  return res
    .status(403)
    .json({ message: "Unauthorized to access this collaborator's stats" });
};

export class CommissionAllocationRoutes extends BaseCRUDRoutes {
  protected initializeRoutes(): void {
    const service = createCommissionAllocationService();
    const controller = new CommissionAllocationController(service);

    this.router.use(AuthMiddleware.validateJWT);

    this.router.get(
      "/stats",
      authorizationMiddleware({
        roles: [WebAppRole.admin, WebAppRole.manager],
      }),
      controller.getCommissionsStats
    );
    this.router.get(
      "/promotion-stats",
      authorizationMiddleware({
        roles: [WebAppRole.admin, WebAppRole.manager],
      }),
      controller.getCommissionPromotionStats
    );
    this.router.get(
      "/stats/:collaboratorId",
      collaboratorStatsAuthMiddleware,
      controller.getCollaboratorCommissionStats
    );
    this.router.get(
      "/hourly-average/:collaboratorId",
      collaboratorStatsAuthMiddleware,
      controller.getCollaboratorHourlyCommissionAverage
    );

    this.setupCrudRoutes(controller);
  }
}
