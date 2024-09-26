import { createWeekShiftService } from "../../application";
import { BaseCRUDRoutes } from "./base-crud.routes";
import { WeekShiftController } from "../controllers";

export class WeekShiftRoutes extends BaseCRUDRoutes {
  protected initializeRoutes(): void {
    const productService = createWeekShiftService();
    const controller = new WeekShiftController(productService);

    this.setupCrudRoutes(controller);
  }
}
