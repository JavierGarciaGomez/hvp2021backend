import { createSupplierService } from "../../application";
import { BaseCRUDRoutes } from "./base-crud.routes";
import { SupplierController } from "../controllers";

export class SupplierRoutes extends BaseCRUDRoutes {
  protected initializeRoutes(): void {
    const productService = createSupplierService();
    const controller = new SupplierController(productService);

    this.setupCrudRoutes(controller);
  }
}
