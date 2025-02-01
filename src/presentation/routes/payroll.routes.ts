import { createPayrollService } from "../../application";
import { BaseCRUDRoutes } from "./base-crud.routes";
import { PayrollController } from "../controllers";

export class PayrollRoutes extends BaseCRUDRoutes {
  protected initializeRoutes(): void {
    const service = createPayrollService();
    const controller = new PayrollController(service);

    this.setupCrudRoutes(controller);
  }
}
