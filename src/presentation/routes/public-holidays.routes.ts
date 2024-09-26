import { createPublicHolidaysService } from "../../application";
import { BaseCRUDRoutes } from "./base-crud.routes";
import { PublicHolidaysController } from "../controllers";

export class PublicHolidaysRoutes extends BaseCRUDRoutes {
  protected initializeRoutes(): void {
    const productService = createPublicHolidaysService();
    const controller = new PublicHolidaysController(productService);

    this.setupCrudRoutes(controller);
  }
}
