import { createControlledPrescriptionService } from "../../application";
import { BaseCRUDRoutes } from "./base-crud.routes";
import { ControlledPrescriptionController } from "../controllers";

export class ControlledPrescriptionRoutes extends BaseCRUDRoutes {
  protected initializeRoutes(): void {
    const productService = createControlledPrescriptionService();
    const controller = new ControlledPrescriptionController(productService);

    this.setupCrudRoutes(controller);
  }
}
