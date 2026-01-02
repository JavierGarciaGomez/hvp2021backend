import { Router } from "express";
import { CompanySettingsController } from "../controllers/company-settings.controller";
import { CompanySettingsService } from "../../application/services/company-settings.service";
import { CompanySettingsRepositoryImpl } from "../../infrastructure/repositories/company-settings.repository.imp";
import { CompanySettingsDatasourceMongoImp } from "../../infrastructure/datasources/company-settings.datasource.mongo-imp";

/**
 * CompanySettings Routes
 * Singleton resource
 */
export class CompanySettingsRoutes {
  static get routes(): Router {
    const router = Router();

    // Initialize dependencies
    const datasource = new CompanySettingsDatasourceMongoImp();
    const repository = new CompanySettingsRepositoryImpl(datasource);
    const service = new CompanySettingsService(repository);
    const controller = new CompanySettingsController(service);

    // Routes
    router.get("/", controller.get);
    router.post("/", controller.create); // TODO: Add admin middleware
    router.put("/", controller.update); // TODO: Add admin middleware
    router.delete("/", controller.delete); // TODO: Add admin middleware

    return router;
  }
}
