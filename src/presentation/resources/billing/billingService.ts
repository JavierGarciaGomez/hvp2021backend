import { mainRoutes } from "../../../mainRoutes";
import { ListSuccessResponse } from "../../../data/types/responses";
import {
  BillCreationInfoDTO,
  CustomerRFCDTO,
  PaginationDto,
} from "../../../domain";
import { BaseError } from "../../../domain/errors/BaseError";
import { SuccessResponseFormatter } from "../../services/SuccessResponseFormatter";
import { AuthenticatedCollaborator } from "../../../types/RequestsAndResponses";
import { routes } from "./billingRoutes";
import CustomerRFCModel from "../../../data/models/CustomerRFCModel";
import billCreationInfoModel from "../../../data/models/BillCreationInfoModel";
import {
  BillCreationInfo,
  CustomerRFC,
} from "../../../data/types/billingTypes";
import {
  CFDI_USES,
  FISCAL_REGIMES,
  PAYMENT_METHODS,
} from "../../../data/constants/billingConstants";
import { fetchList, fetchStaticList } from "../../../helpers";

const commonPath = mainRoutes.billing;
const customerRRFCResourceName = "Customer RFCs";
const billCreationInfoResourceName = "Bill Creation Info";
export class CustomerRFCsService {
  // DI
  constructor() {}

  async getCustomerRFCs(
    paginationDto: PaginationDto
  ): Promise<ListSuccessResponse<CustomerRFC>> {
    return fetchList({
      model: CustomerRFCModel,
      query: {},
      paginationDto,

      path: `${commonPath}${routes.customerRFCs.all}`,
      resourceName: customerRRFCResourceName,
    });
  }

  async getRecordById(id: string) {
    const resource = await CustomerRFCModel.findById(id);
    if (!resource)
      throw BaseError.notFound(`${resource} not found with id ${id}`);

    const response = SuccessResponseFormatter.formatGetOneResponse<CustomerRFC>(
      {
        data: resource,
        resource: customerRRFCResourceName,
      }
    );

    return response;
  }

  async createCustomerRFC(
    dto: CustomerRFCDTO,
    authenticatedCollaborator: AuthenticatedCollaborator
  ) {
    const { uid } = authenticatedCollaborator;
    const existingResource = await CustomerRFCModel.findOne({
      rfc: dto.data.rfc,
    });

    if (existingResource) {
      throw BaseError.badRequest(
        `A customer with RFC ${dto.data.rfc} already exists`
      );
    }
    const resource = new CustomerRFCModel({
      ...dto.data,
      createdBy: uid,
      updatedBy: uid,
    });

    const savedResource = await resource.save();

    const response =
      SuccessResponseFormatter.fortmatCreateResponse<CustomerRFC>({
        data: savedResource,
        resource: customerRRFCResourceName,
      });

    return response;
  }

  async updateCustomerRFC(
    id: string,
    dto: CustomerRFCDTO,
    authenticatedCollaborator: AuthenticatedCollaborator
  ) {
    const { uid } = authenticatedCollaborator;

    // Check if the resource to update exists
    const resourceToUpdate = await CustomerRFCModel.findById(id);
    if (!resourceToUpdate)
      throw BaseError.notFound(
        `${customerRRFCResourceName} not found with id ${id}`
      );

    // Check for existing RFC conflict
    const existingResource = await CustomerRFCModel.findOne({
      rfc: dto.data.rfc,
      _id: { $ne: id },
    });

    if (existingResource) {
      throw BaseError.badRequest(
        `A customer with RFC ${dto.data.rfc} already exists`
      );
    }

    // Proceed with the update if no conflict
    const updatedResource = await CustomerRFCModel.findByIdAndUpdate(
      id,
      {
        ...dto.data,
        updatedAt: new Date(),
        updatedBy: uid,
      },
      { new: true }
    );

    const response = SuccessResponseFormatter.formatUpdateResponse<CustomerRFC>(
      {
        data: updatedResource!,
        resource: customerRRFCResourceName,
      }
    );

    return response;
  }

  async deleteRecord(id: string) {
    const resource = await CustomerRFCModel.findById(id);
    if (!resource)
      throw BaseError.notFound(
        `${customerRRFCResourceName} not found with id ${id}`
      );

    const deletedResource = await CustomerRFCModel.findByIdAndDelete(id);
    const response = SuccessResponseFormatter.formatDeleteResponse<CustomerRFC>(
      {
        data: deletedResource!,
        resource: customerRRFCResourceName,
      }
    );

    return response;
  }

  async getFiscalRegimes(paginationDto: PaginationDto) {
    return fetchStaticList({
      data: FISCAL_REGIMES,
      paginationDto,
      path: `${commonPath}${routes.fiscalRegime.all}`,
      resourceName: "Fiscal Regimes",
    });
  }

  async getInvoiceUsages(paginationDto: PaginationDto) {
    return fetchStaticList({
      data: CFDI_USES,
      paginationDto,
      path: `${commonPath}${routes.invoiceUsages.all}`,
      resourceName: "Invoice Usages",
    });
  }

  async getPaymentMethods(paginationDto: PaginationDto) {
    return fetchStaticList({
      data: PAYMENT_METHODS,
      paginationDto,
      path: `${commonPath}${routes.paymentMethods.all}`,
      resourceName: "Payment Methods",
    });
  }

  async createBillCreationInfo(
    dto: BillCreationInfoDTO,
    authenticatedCollaborator: AuthenticatedCollaborator
  ) {
    const { uid } = authenticatedCollaborator;
    const resource = new billCreationInfoModel({
      ...dto.data,
      createdBy: uid,
      updatedBy: uid,
    });

    const savedResource = await resource.save();

    const response =
      SuccessResponseFormatter.fortmatCreateResponse<BillCreationInfo>({
        data: savedResource,
        resource: customerRRFCResourceName,
      });

    return response;
  }

  async getBillCreationInfoList(
    paginationDto: PaginationDto
  ): Promise<ListSuccessResponse<BillCreationInfo>> {
    return fetchList({
      model: billCreationInfoModel,
      query: {},
      paginationDto,

      path: `${commonPath}${routes.billCreationInfo.all}`,
      resourceName: billCreationInfoResourceName,
    });
  }

  async getBillCreationInfoById(id: string) {
    const resource = await billCreationInfoModel.findById(id);
    if (!resource)
      throw BaseError.notFound(
        `${billCreationInfoResourceName} not found with id ${id}`
      );

    const response =
      SuccessResponseFormatter.formatGetOneResponse<BillCreationInfo>({
        data: resource,
        resource: billCreationInfoResourceName,
      });

    return response;
  }

  async updateBillCreationInfo(
    id: string,
    dto: BillCreationInfoDTO,
    authenticatedCollaborator: AuthenticatedCollaborator
  ) {
    const { uid } = authenticatedCollaborator;
    const resourceToUpdate = await billCreationInfoModel.findById(id);
    if (!resourceToUpdate)
      throw BaseError.notFound(
        `${billCreationInfoResourceName} not found with id ${id}`
      );

    const updatedResource = await billCreationInfoModel.findByIdAndUpdate(
      id,
      {
        ...dto.data,
        updatedAt: new Date(),
        updatedBy: uid,
      },
      { new: true }
    );

    const response =
      SuccessResponseFormatter.formatUpdateResponse<BillCreationInfo>({
        data: updatedResource!,
        resource: billCreationInfoResourceName,
      });

    return response;
  }

  async deleteBillCreationInfo(id: string) {
    const resource = await billCreationInfoModel.findById(id);
    if (!resource)
      throw BaseError.notFound(
        `${billCreationInfoResourceName} not found with id ${id}`
      );

    const deletedResource = await billCreationInfoModel.findByIdAndDelete(id);
    const response =
      SuccessResponseFormatter.formatDeleteResponse<BillCreationInfo>({
        data: deletedResource!,
        resource: billCreationInfoResourceName,
      });

    return response;
  }
}