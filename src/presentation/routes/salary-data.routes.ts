import { createSalaryDataService } from "../../application";
import { BaseCRUDRoutes } from "./base-crud.routes";
import { SalaryDataController } from "../controllers";

export class SalaryDataRoutes extends BaseCRUDRoutes {
  protected initializeRoutes(): void {
    const productService = createSalaryDataService();
    const controller = new SalaryDataController(productService);

    this.setupCrudRoutes(controller);
  }
}
