import { Router } from "express";
import { BillingController } from "./billingController";
import { CustomerRFCsService as billingService } from "./billingService";

const { validateJwt } = require("../../../middlewares/validateJwt");

const baseRoutes = {
  CUSTOMER_RFCS: "/customer-rfcs",
  BILLS: "/bills",
  INVOICE_USAGES: "/invoice-usages",
  FISCAL_REGIME: "/fiscal-regimes",
};

export const routes = {
  customerRFCs: {
    base: baseRoutes.CUSTOMER_RFCS,
    all: `${baseRoutes.CUSTOMER_RFCS}/`,
    one: `${baseRoutes.CUSTOMER_RFCS}/:id`,
    create: `${baseRoutes.CUSTOMER_RFCS}/`,
    update: `${baseRoutes.CUSTOMER_RFCS}/:id`,
    delete: `${baseRoutes.CUSTOMER_RFCS}/:id`,
  },
  bills: {
    base: baseRoutes.BILLS,
    one: `${baseRoutes.BILLS}/`,
    byId: `${baseRoutes.BILLS}/:id`,
    create: `${baseRoutes.BILLS}/`,
    update: `${baseRoutes.BILLS}/:id`,
    delete: `${baseRoutes.BILLS}/:id`,
  },
  invoiceUsages: {
    base: baseRoutes.INVOICE_USAGES,
    all: `${baseRoutes.INVOICE_USAGES}/`,
  },
  fiscalRegime: {
    base: baseRoutes.FISCAL_REGIME,
    all: `${baseRoutes.FISCAL_REGIME}/`,
    byId: `${baseRoutes.FISCAL_REGIME}/:id`,
    create: `${baseRoutes.FISCAL_REGIME}/`,
    update: `${baseRoutes.FISCAL_REGIME}/:id`,
    delete: `${baseRoutes.FISCAL_REGIME}/:id`,
  },
};

export class BillingRoutes {
  static get routes(): Router {
    const router = Router();

    const service = new billingService();
    const controller = new BillingController(service);

    router.use(validateJwt);

    router.get(routes.customerRFCs.all, controller.getCustomerRFCs);
    router.get(routes.customerRFCs.one, controller.getRecordById);
    router.post(routes.customerRFCs.create, controller.createCustomerRFC);
    router.patch(routes.customerRFCs.update, controller.updateRecord);
    router.delete(routes.customerRFCs.delete, controller.deleteRecord);

    return router;
  }
}
