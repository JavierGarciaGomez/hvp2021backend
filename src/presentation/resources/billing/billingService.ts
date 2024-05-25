import { mainRoutes } from "../../../mainRoutes";
import { ResourceQuery } from "../../../data/types/Queries";
import { ListSuccessResponse } from "../../../data/types/responses";
import { PaginationDto } from "../../../domain";
import { BaseError } from "../../../domain/errors/BaseError";
import { SuccessResponseFormatter } from "../../services/SuccessResponseFormatter";
import { AuthenticatedCollaborator } from "../../../types/RequestsAndResponses";
import { routes } from "./billingRoutes";
import { CustomerRFCDTO } from "../../../domain/dtos/customerRFCs/customerRFCSsDto";
import CustomerRFCModel from "../../../data/models/CustomerRFCModel";
import { CustomerRFC } from "../../../data/types/billingTypes";

const commonPath = mainRoutes.attendanceRecords;
const resourceName = "AttendanceRecords";
export class CustomerRFCsService {
  // DI
  constructor() {}

  async getCustomerRFCs(
    paginationDto: PaginationDto
  ): Promise<ListSuccessResponse<CustomerRFC>> {
    const { all } = paginationDto;
    return this.fetchLists(
      {},
      paginationDto,
      all,
      `${commonPath}${routes.customerRFCs.all}`
    );
  }

  async getLastAttendanceRecordByCollaborator(collaboratorId: string) {
    const query = { collaborator: collaboratorId };
    const resource = await CustomerRFCModel.findOne(query).sort("-shiftDate");
    if (!resource)
      throw BaseError.notFound(
        `${resourceName} not found for collaborator ${collaboratorId}`
      );
    const response = SuccessResponseFormatter.formatGetOneResponse<CustomerRFC>(
      {
        data: resource,
        resource: resourceName,
      }
    );

    return response;
  }

  async getRecordById(id: string) {
    const resource = await CustomerRFCModel.findById(id);
    if (!resource)
      throw BaseError.notFound(`${resource} not found with id ${id}`);

    const response = SuccessResponseFormatter.formatGetOneResponse<CustomerRFC>(
      {
        data: resource,
        resource: resourceName,
      }
    );

    return response;
  }

  async createRecord(
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
        resource: resourceName,
      });

    return response;
  }

  async updateRecord(
    id: string,
    dto: CustomerRFCDTO,
    authenticatedCollaborator: AuthenticatedCollaborator
  ) {
    const { uid } = authenticatedCollaborator;

    // Check if the resource to update exists
    const resourceToUpdate = await CustomerRFCModel.findById(id);
    if (!resourceToUpdate)
      throw BaseError.notFound(`${resourceName} not found with id ${id}`);

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
        resource: resourceName,
      }
    );

    return response;
  }

  async deleteRecord(id: string) {
    const resource = await CustomerRFCModel.findById(id);
    if (!resource)
      throw BaseError.notFound(`${resourceName} not found with id ${id}`);

    const deletedResource = await CustomerRFCModel.findByIdAndDelete(id);
    const response = SuccessResponseFormatter.formatDeleteResponse<CustomerRFC>(
      {
        data: deletedResource!,
        resource: resourceName,
      }
    );

    return response;
  }

  private async fetchLists(
    query: ResourceQuery<CustomerRFC>,
    paginationDto: PaginationDto,
    all: boolean,
    path: string
  ): Promise<ListSuccessResponse<CustomerRFC>> {
    const { page, limit } = paginationDto;

    try {
      let data;

      if (all) {
        // If 'all' is present, fetch all resources without pagination
        data = await CustomerRFCModel.find(query);
      } else {
        // Fetch paginated time-off requests
        const [total, paginatedData] = await Promise.all([
          CustomerRFCModel.countDocuments(query),
          CustomerRFCModel.find(query)
            .skip((page - 1) * limit)
            .limit(limit),
        ]);

        data = paginatedData;
      }

      const response = SuccessResponseFormatter.formatListResponse<CustomerRFC>(
        {
          data,
          page,
          limit,
          total: data.length,
          path: path,
          resource: resourceName,
        }
      );

      return response;
    } catch (error) {
      throw BaseError.internalServer("Internal Server Error");
    }
  }
}
