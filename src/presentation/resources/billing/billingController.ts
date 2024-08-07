import { Response, Request, NextFunction } from "express";
import { AuthenticatedRequest } from "../../../shared/interfaces/RequestsAndResponses";
import {
  BillCreationInfoDTO,
  CustomerRFCDTO,
  PaginationDto,
} from "../../../domain";
import { BaseError } from "../../../shared/errors/BaseError";

import { BillingService } from "./billingService";

export class BillingController {
  constructor(private readonly service: BillingService) {}

  private handleError = (error: unknown, res: Response, next: NextFunction) => {
    next(error);
  };

  public getCustomerRFCs = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { page, limit } = req.query;
      const paginationDto = PaginationDto.create(Number(page), Number(limit));

      const response = await this.service.getCustomerRFCs(paginationDto!);
      res.status(response.status_code).json(response);
    } catch (error) {
      this.handleError(error, res, next);
    }
  };

  public getRecordById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;
    try {
      const response = await this.service.getRecordById(id);
      res.status(response.status_code).json(response);
    } catch (error) {
      this.handleError(error, res, next);
    }
  };

  public createCustomerRFC = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { authUser } = req;
      const body = req.body;
      const [error, dto] = CustomerRFCDTO.create(body);
      if (error) throw BaseError.badRequest("Invalid data", error);

      const response = await this.service.createCustomerRFC(dto!, authUser!);
      res.status(response.status_code).json(response);
    } catch (error) {
      this.handleError(error, res, next);
    }
  };

  public updateCustomerRFC = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id;
      const { authUser } = req;
      const body = req.body;
      const [error, dto] = CustomerRFCDTO.update(body);
      if (error) throw BaseError.badRequest("Invalid request data", error);

      const response = await this.service.updateCustomerRFC(
        id,
        dto!,
        authUser!
      );
      res.status(response.status_code).json(response);
    } catch (error) {
      this.handleError(error, res, next);
    }
  };

  public deleteCustomerRFC = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id;
      const response = await this.service.deleteRecord(id);
      res.status(response.status_code).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getFiscalRegimes = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { page, limit } = req.query;
      const paginationDto = PaginationDto.create(Number(page), Number(limit));

      const response = await this.service.getFiscalRegimes(paginationDto);
      res.status(response.status_code).json(response);
    } catch (error) {
      this.handleError(error, res, next);
    }
  };
  public getInvoiceUsages = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { page, limit } = req.query;
      const paginationDto = PaginationDto.create(Number(page), Number(limit));
      const response = await this.service.getInvoiceUsages(paginationDto);
      res.status(response.status_code).json(response);
    } catch (error) {
      this.handleError(error, res, next);
    }
  };

  public getPaymentMethods = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { page, limit } = req.query;
      const paginationDto = PaginationDto.create(Number(page), Number(limit));
      const response = await this.service.getPaymentMethods(paginationDto);
      res.status(response.status_code).json(response);
    } catch (error) {
      this.handleError(error, res, next);
    }
  };

  public createBillCreationInfo = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { authUser } = req;
      const body = req.body;
      const [error, dto] = BillCreationInfoDTO.create(body);
      if (error) throw BaseError.badRequest("Invalid data", error);

      const response = await this.service.createBillCreationInfo(
        dto!,
        authUser!
      );
      res.status(response.status_code).json(response);
    } catch (error) {
      this.handleError(error, res, next);
    }
  };

  public getBillCreationInfoList = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { page, limit } = req.query;
      const paginationDto = PaginationDto.create(Number(page), Number(limit));
      const response = await this.service.getBillCreationInfoList(
        paginationDto!
      );
      res.status(response.status_code).json(response);
    } catch (error) {
      this.handleError(error, res, next);
    }
  };

  public getBillCreationInfoById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;
    try {
      const response = await this.service.getBillCreationInfoById(id);
      res.status(response.status_code).json(response);
    } catch (error) {
      this.handleError(error, res, next);
    }
  };

  public updateBillCreationInfo = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;
    try {
      const { authUser } = req;
      const body = req.body;
      const [error, dto] = BillCreationInfoDTO.update(body);
      if (error) throw BaseError.badRequest("Invalid request data", error);

      const response = await this.service.updateBillCreationInfo(
        id,
        dto!,
        authUser!
      );
      res.status(response.status_code).json(response);
    } catch (error) {
      this.handleError(error, res, next);
    }
  };

  public deleteBillCreationInfo = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id;
      const response = await this.service.deleteBillCreationInfo(id);
      res.status(response.status_code).json(response);
    } catch (error) {
      next(error);
    }
  };
}
