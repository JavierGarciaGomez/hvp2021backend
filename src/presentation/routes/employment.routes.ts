import { createEmploymentService } from "../../application";
import { BaseCRUDRoutes } from "./base-crud.routes";
import { EmploymentController } from "../controllers";

export class EmploymentRoutes extends BaseCRUDRoutes {
  protected initializeRoutes(): void {
    const service = createEmploymentService();
    const controller = new EmploymentController(service);

    this.setupCrudRoutes(controller);
  }
}
