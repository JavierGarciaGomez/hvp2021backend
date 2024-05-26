import mongoose from "mongoose";
import { mainRoutes } from "../../../mainRoutes";
import { ResourceQuery } from "../../../data/types/Queries";
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
  FiscalRegime,
  InvoiceUsage,
} from "../../../data/types/billingTypes";
import {
  CFDI_USES,
  FISCAL_REGIMES,
  PAYMENT_METHODS,
} from "../../../data/constants/billingConstants";

const commonPath = mainRoutes.attendanceRecords;
const customerRRFCResourceName = "Customer RFCs";
const billCreationInfoResourceName = "Bill Creation Info";
export class CustomerRFCsService {
  // DI
  constructor() {}

  async getCustomerRFCs(
    paginationDto: PaginationDto
  ): Promise<ListSuccessResponse<CustomerRFC>> {
    const { all } = paginationDto;
    return this.fetchLists({
      model: CustomerRFCModel,
      query: {},
      paginationDto,
      all,
      path: `${commonPath}${routes.customerRFCs}`,
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

  async getFiscalRegimes() {
    const data = FISCAL_REGIMES;
    const response = SuccessResponseFormatter.formatListResponse<FiscalRegime>({
      data,
      page: 1,
      limit: data.length,
      total: data.length,
      path: "",
      resource: "Fiscal Regimes",
    });

    return response;
  }

  async getInvoiceUsages() {
    const data = CFDI_USES;
    const response = SuccessResponseFormatter.formatListResponse<InvoiceUsage>({
      data,
      page: 1,
      limit: data.length,
      total: data.length,
      path: "",
      resource: "Invoice Usages",
    });

    return response;
  }

  async getPaymentMethods() {
    const data = PAYMENT_METHODS;
    const response = SuccessResponseFormatter.formatListResponse({
      data,
      page: 1,
      limit: data.length,
      total: data.length,
      path: "",
      resource: "Payment Methods",
    });

    return response;
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
    const { all } = paginationDto;
    return this.fetchLists({
      model: billCreationInfoModel,
      query: {},
      paginationDto,
      all,
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

  private async fetchLists<T>(
    params: FetchListsParams<T>
  ): Promise<ListSuccessResponse<T>> {
    const { model, query, paginationDto, all, path, resourceName } = params;
    const { page, limit } = paginationDto;

    try {
      let data;
      let total;

      if (all) {
        // If 'all' is present, fetch all resources without pagination
        data = await model.find(query);
        total = data.length;
      } else {
        // Fetch paginated data
        total = await model.countDocuments(query);
        data = await model
          .find(query)
          .skip((page - 1) * limit)
          .limit(limit);
      }

      const response = SuccessResponseFormatter.formatListResponse<T>({
        data,
        page,
        limit,
        total,
        path,
        resource: resourceName,
      });

      return response;
    } catch (error) {
      throw BaseError.internalServer("Internal Server Error");
    }
  }
}

interface FetchListsParams<T> {
  model: mongoose.Model<T>;
  query: ResourceQuery<T>;
  paginationDto: PaginationDto;
  all: boolean;
  path: string;
  resourceName: string;
}
