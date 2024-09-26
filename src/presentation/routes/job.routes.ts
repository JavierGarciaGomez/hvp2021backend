import { createJobService } from "../../application";
import { BaseCRUDRoutes } from "./base-crud.routes";
import { JobController } from "../controllers";

export class JobRoutes extends BaseCRUDRoutes {
  protected initializeRoutes(): void {
    const productService = createJobService();
    const controller = new JobController(productService);

    this.setupCrudRoutes(controller);
  }
}
