import {
  ControlledPrescriptionService,
  createControlledPrescriptionService,
} from "../../application";
import { BaseCRUDRoutes } from "./base-crud.routes";
import { ControlledPrescriptionController } from "../controllers";
import { AuthMiddleware } from "../middlewares";

export class ControlledPrescriptionRoutes extends BaseCRUDRoutes {
  protected initializeRoutes(): void {
    const service = createControlledPrescriptionService();
    const controller = new ControlledPrescriptionController(service);

    this.setupCustomCrudRoutes(controller);
    this.setupCrudRoutes(controller);
  }

  protected setupCustomCrudRoutes(
    controller: ControlledPrescriptionController
  ) {
    this.router.get(
      "/status-options",
      AuthMiddleware.validateJWT,
      controller.getStatusOptions
    );
  }
}
