import { createBranchService } from "../../application";
import { BaseCRUDRoutes } from "./base-crud.routes";
import { BranchController } from "../controllers";

export class BranchRoutes extends BaseCRUDRoutes {
  protected initializeRoutes(): void {
    const productService = createBranchService();
    const controller = new BranchController(productService);

    this.setupCrudRoutes(controller);
  }
}
