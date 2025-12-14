import { createMissingProductService } from "../../application";
import { BaseCRUDRoutes } from "./base-crud.routes";
import { MissingProductController } from "../controllers";

export class MissingProductRoutes extends BaseCRUDRoutes {
  protected initializeRoutes(): void {
    const productService = createMissingProductService();
    const controller = new MissingProductController(productService);

    this.setupCrudRoutes(controller);
  }
}
