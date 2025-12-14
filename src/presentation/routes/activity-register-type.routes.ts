import { createActivityRegisterTypeService } from "../../application";
import { BaseCRUDRoutes } from "./base-crud.routes";
import { ActivityRegisterTypeController } from "../controllers";

export class ActivityRegisterTypeRoutes extends BaseCRUDRoutes {
  protected initializeRoutes(): void {
    const service = createActivityRegisterTypeService();
    const controller = new ActivityRegisterTypeController(service);

    this.setupCrudRoutes(controller);
  }
}
