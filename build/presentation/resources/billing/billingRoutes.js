"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingRoutes = exports.routes = void 0;
const express_1 = require("express");
const billingController_1 = require("./billingController");
const billingService_1 = require("./billingService");
const middlewares_1 = require("../../middlewares");
const application_1 = require("../../../application");
const baseRoutes = {
    CUSTOMER_RFCS: "/customer-rfcs",
    BILL_CREATION_INFO: "/bill-creation-info",
    INVOICE_USAGES: "/invoice-usages",
    FISCAL_REGIME: "/fiscal-regimes",
    PAYMENT_METHODS: "/payment-methods",
};
exports.routes = {
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
class BillingRoutes {
    static get routes() {
        const router = (0, express_1.Router)();
        const notificationService = (0, application_1.createNotificationService)();
        const service = new billingService_1.BillingService(notificationService);
        const controller = new billingController_1.BillingController(service);
        router.use(middlewares_1.AuthMiddleware.validateJWT);
        router.get(exports.routes.customerRFCs.all, controller.getCustomerRFCs);
        router.get(exports.routes.customerRFCs.one, controller.getRecordById);
        router.post(exports.routes.customerRFCs.create, controller.createCustomerRFC);
        router.patch(exports.routes.customerRFCs.update, controller.updateCustomerRFC);
        router.delete(exports.routes.customerRFCs.delete, controller.deleteCustomerRFC);
        router.get(exports.routes.invoiceUsages.all, controller.getInvoiceUsages);
        router.get(exports.routes.fiscalRegime.all, controller.getFiscalRegimes);
        router.get(exports.routes.paymentMethods.all, controller.getPaymentMethods);
        router.post(exports.routes.billCreationInfo.create, controller.createBillCreationInfo);
        router.get(exports.routes.billCreationInfo.all, controller.getBillCreationInfoList);
        router.get(exports.routes.billCreationInfo.byId, controller.getBillCreationInfoById);
        router.patch(exports.routes.billCreationInfo.update, controller.updateBillCreationInfo);
        router.delete(exports.routes.billCreationInfo.delete, controller.deleteBillCreationInfo);
        return router;
    }
}
exports.BillingRoutes = BillingRoutes;
