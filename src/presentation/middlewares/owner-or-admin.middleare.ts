import { AuthenticatedRequest, BaseError } from "../../shared";
import { Response, NextFunction } from "express";
import { BaseService } from "../../application";
import { BaseEntity, BaseVO, WebAppRole } from "../../domain";

export const ownerOrManagerMiddleware =
  <
    T extends
      | (BaseEntity & { collaborator?: any })
      | (BaseVO & { collaborator?: any }),
    DTO
  >(
    service: BaseService<T, DTO>
  ) =>
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.authUser?.uid;
    const resourceId = req.params.id;

    const resource = await service.getById(resourceId);

    if (!resource) {
      throw BaseError.notFound(`${service.getResourceName()} not found`);
    }

    const isAdminOrManager = [WebAppRole.admin, WebAppRole.manager].includes(
      req.authUser?.role!
    );

    const isOwnerOrCollaborator =
      ("collaborator" in resource && resource.collaborator === userId) ||
      resource.createdBy === userId;

    if (isAdminOrManager || isOwnerOrCollaborator) {
      return next();
    }

    res.status(403).json({ message: "Unauthorized" });
  };
