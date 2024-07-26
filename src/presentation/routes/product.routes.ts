import { createProductService } from "../../application";
import { BaseCRUDRoutes } from "./base-crud.routes";
import { ProductController } from "../controllers";

export class ProductRoutes extends BaseCRUDRoutes {
  protected initializeRoutes(): void {
    const productService = createProductService();
    const controller = new ProductController(productService);

    this.setupCrudRoutes(controller);
  }
}
