"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingService = void 0;
const mainRoutes_1 = require("../../../mainRoutes");
const domain_1 = require("../../../domain");
const BaseError_1 = require("../../../shared/errors/BaseError");
const SuccessResponseFormatter_1 = require("../../services/SuccessResponseFormatter");
const billingRoutes_1 = require("./billingRoutes");
const CustomerRFCModel_1 = __importDefault(require("../../../infrastructure/db/mongo/models/CustomerRFCModel"));
const BillCreationInfoModel_1 = __importDefault(require("../../../infrastructure/db/mongo/models/BillCreationInfoModel"));
const billingConstants_1 = require("../../../shared/constants/billingConstants");
const shared_1 = require("../../../shared");
const helpers_1 = require("../../../shared/helpers");
const application_1 = require("../../../application");
const commonPath = mainRoutes_1.mainRoutes.billing;
const customerRRFCResourceName = "Customer RFCs";
const billCreationInfoResourceName = "Bill Creation Info";
class BillingService {
    // DI
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    getCustomerRFCs(paginationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, helpers_1.fetchList)({
                model: CustomerRFCModel_1.default,
                query: {},
                paginationDto,
                path: `${commonPath}${billingRoutes_1.routes.customerRFCs.all}`,
                resourceName: customerRRFCResourceName,
            });
        });
    }
    getRecordById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = yield CustomerRFCModel_1.default.findById(id);
            if (!resource)
                throw BaseError_1.BaseError.notFound(`${resource} not found with id ${id}`);
            const response = SuccessResponseFormatter_1.OldSuccessResponseFormatter.formatGetOneResponse({
                data: resource,
                resource: customerRRFCResourceName,
            });
            return response;
        });
    }
    createCustomerRFC(dto, authenticatedCollaborator) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid } = authenticatedCollaborator;
            const existingResource = yield CustomerRFCModel_1.default.findOne({
                rfc: dto.data.rfc,
            });
            if (existingResource) {
                throw BaseError_1.BaseError.badRequest(`A customer with RFC ${dto.data.rfc} already exists`);
            }
            const resource = new CustomerRFCModel_1.default(Object.assign(Object.assign({}, dto.data), { createdBy: uid, updatedBy: uid }));
            const savedResource = yield resource.save();
            const response = SuccessResponseFormatter_1.OldSuccessResponseFormatter.fortmatCreateResponse({
                data: savedResource,
                resource: customerRRFCResourceName,
            });
            return response;
        });
    }
    updateCustomerRFC(id, dto, authenticatedCollaborator) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid } = authenticatedCollaborator;
            // Check if the resource to update exists
            const resourceToUpdate = yield CustomerRFCModel_1.default.findById(id);
            if (!resourceToUpdate)
                throw BaseError_1.BaseError.notFound(`${customerRRFCResourceName} not found with id ${id}`);
            // Check for existing RFC conflict
            const existingResource = yield CustomerRFCModel_1.default.findOne({
                rfc: dto.data.rfc,
                _id: { $ne: id },
            });
            if (existingResource) {
                throw BaseError_1.BaseError.badRequest(`A customer with RFC ${dto.data.rfc} already exists`);
            }
            // Proceed with the update if no conflict
            const updatedResource = yield CustomerRFCModel_1.default.findByIdAndUpdate(id, Object.assign(Object.assign({}, dto.data), { updatedAt: new Date(), updatedBy: uid }), { new: true });
            const response = SuccessResponseFormatter_1.OldSuccessResponseFormatter.formatUpdateResponse({
                data: updatedResource,
                resource: customerRRFCResourceName,
            });
            return response;
        });
    }
    deleteRecord(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = yield CustomerRFCModel_1.default.findById(id);
            if (!resource)
                throw BaseError_1.BaseError.notFound(`${customerRRFCResourceName} not found with id ${id}`);
            const deletedResource = yield CustomerRFCModel_1.default.findByIdAndDelete(id);
            const response = SuccessResponseFormatter_1.OldSuccessResponseFormatter.formatDeleteResponse({
                data: deletedResource,
                resource: customerRRFCResourceName,
            });
            return response;
        });
    }
    getFiscalRegimes(paginationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, helpers_1.fetchStaticList)({
                data: billingConstants_1.FISCAL_REGIMES,
                paginationDto,
                path: `${commonPath}${billingRoutes_1.routes.fiscalRegime.all}`,
                resourceName: "Fiscal Regimes",
            });
        });
    }
    getInvoiceUsages(paginationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, helpers_1.fetchStaticList)({
                data: billingConstants_1.CFDI_USES,
                paginationDto,
                path: `${commonPath}${billingRoutes_1.routes.invoiceUsages.all}`,
                resourceName: "Invoice Usages",
            });
        });
    }
    getPaymentMethods(paginationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, helpers_1.fetchStaticList)({
                data: billingConstants_1.PAYMENT_METHODS,
                paginationDto,
                path: `${commonPath}${billingRoutes_1.routes.paymentMethods.all}`,
                resourceName: "Payment Methods",
            });
        });
    }
    createBillCreationInfo(dto, authenticatedCollaborator) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid } = authenticatedCollaborator;
            const resource = new BillCreationInfoModel_1.default(Object.assign(Object.assign({}, dto.data), { createdBy: uid, updatedBy: uid }));
            const savedResource = yield resource.save();
            const response = SuccessResponseFormatter_1.OldSuccessResponseFormatter.fortmatCreateResponse({
                data: savedResource,
                resource: customerRRFCResourceName,
            });
            yield this.notificationService.notifyManagers({
                message: `Bill Creation Info created by ${uid}`,
                referenceId: savedResource._id.toString(),
                referenceType: domain_1.NotificationReferenceType.BILL_CREATION_INFO,
                actionType: domain_1.NotificationActionType.AWAITING_APPROVAL,
                title: "Bill Creation Info created",
            });
            return response;
        });
    }
    getBillCreationInfoList(paginationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, helpers_1.fetchList)({
                model: BillCreationInfoModel_1.default,
                query: {},
                paginationDto,
                path: `${commonPath}${billingRoutes_1.routes.billCreationInfo.all}`,
                resourceName: billCreationInfoResourceName,
            });
        });
    }
    getBillCreationInfoById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = yield BillCreationInfoModel_1.default.findById(id);
            if (!resource)
                throw BaseError_1.BaseError.notFound(`${billCreationInfoResourceName} not found with id ${id}`);
            const response = SuccessResponseFormatter_1.OldSuccessResponseFormatter.formatGetOneResponse({
                data: resource,
                resource: billCreationInfoResourceName,
            });
            return response;
        });
    }
    updateBillCreationInfo(id, dto, authenticatedCollaborator) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid } = authenticatedCollaborator;
            const resourceToUpdate = yield BillCreationInfoModel_1.default.findById(id);
            if (!resourceToUpdate)
                throw BaseError_1.BaseError.notFound(`${billCreationInfoResourceName} not found with id ${id}`);
            const updatedResource = yield BillCreationInfoModel_1.default.findByIdAndUpdate(id, Object.assign(Object.assign({}, dto.data), { updatedAt: new Date(), updatedBy: uid }), { new: true });
            const response = SuccessResponseFormatter_1.OldSuccessResponseFormatter.formatUpdateResponse({
                data: updatedResource,
                resource: billCreationInfoResourceName,
            });
            if (updatedResource.status === shared_1.BillCreationInfoStatus.DONE) {
                const collaboratorService = (0, application_1.createCollaboratorService)();
                const collaborator = yield collaboratorService.getById(uid);
                yield this.notificationService.notifyManagers({
                    message: `Bill Creation Info approved by ${collaborator.col_code}`,
                    referenceId: updatedResource._id.toString(),
                    referenceType: domain_1.NotificationReferenceType.BILL_CREATION_INFO,
                    actionType: domain_1.NotificationActionType.AWAITING_APPROVAL,
                    title: "Bill Creation Info updated",
                });
            }
            return response;
        });
    }
    deleteBillCreationInfo(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = yield BillCreationInfoModel_1.default.findById(id);
            if (!resource)
                throw BaseError_1.BaseError.notFound(`${billCreationInfoResourceName} not found with id ${id}`);
            const deletedResource = yield BillCreationInfoModel_1.default.findByIdAndDelete(id);
            const response = SuccessResponseFormatter_1.OldSuccessResponseFormatter.formatDeleteResponse({
                data: deletedResource,
                resource: billCreationInfoResourceName,
            });
            return response;
        });
    }
}
exports.BillingService = BillingService;
