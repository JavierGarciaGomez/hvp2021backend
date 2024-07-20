import { Router } from "express";
import { BillingController } from "./billingController";
import { BillingService as billingService } from "./billingService";
import { AuthMiddleware } from "../../middlewares";

const baseRoutes = {
  CUSTOMER_RFCS: "/customer-rfcs",
  BILL_CREATION_INFO: "/bill-creation-info",
  INVOICE_USAGES: "/invoice-usages",
  FISCAL_REGIME: "/fiscal-regimes",
  PAYMENT_METHODS: "/payment-methods",
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
  billCreationInfo: {
    base: baseRoutes.BILL_CREATION_INFO,
    all: `${baseRoutes.BILL_CREATION_INFO}/`,
    one: `${baseRoutes.BILL_CREATION_INFO}/`,
    byId: `${baseRoutes.BILL_CREATION_INFO}/:id`,
    create: `${baseRoutes.BILL_CREATION_INFO}/`,
    update: `${baseRoutes.BILL_CREATION_INFO}/:id`,
    delete: `${baseRoutes.BILL_CREATION_INFO}/:id`,
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
  paymentMethods: {
    base: baseRoutes.PAYMENT_METHODS,
    all: `${baseRoutes.PAYMENT_METHODS}/`,
  },
};

export class BillingRoutes {
  static get routes(): Router {
    const router = Router();

    const service = new billingService();
    const controller = new BillingController(service);

    router.use(AuthMiddleware.validateJWT);

    router.get(routes.customerRFCs.all, controller.getCustomerRFCs);
    router.get(routes.customerRFCs.one, controller.getRecordById);
    router.post(routes.customerRFCs.create, controller.createCustomerRFC);
    router.patch(routes.customerRFCs.update, controller.updateCustomerRFC);
    router.delete(routes.customerRFCs.delete, controller.deleteCustomerRFC);

    router.get(routes.invoiceUsages.all, controller.getInvoiceUsages);
    router.get(routes.fiscalRegime.all, controller.getFiscalRegimes);
    router.get(routes.paymentMethods.all, controller.getPaymentMethods);

    router.post(
      routes.billCreationInfo.create,
      controller.createBillCreationInfo
    );
    router.get(routes.billCreationInfo.all, controller.getBillCreationInfoList);
    router.get(
      routes.billCreationInfo.byId,
      controller.getBillCreationInfoById
    );
    router.patch(
      routes.billCreationInfo.update,
      controller.updateBillCreationInfo
    );
    router.delete(
      routes.billCreationInfo.delete,
      controller.deleteBillCreationInfo
    );

    return router;
  }
}
