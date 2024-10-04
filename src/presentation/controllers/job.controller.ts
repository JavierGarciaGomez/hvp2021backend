import {
  JobDTO,
  JobService,
  ResponseFormatterService,
} from "../../application";
import { BaseController } from "./base.controller";
import { JobEntity } from "../../domain";
import { Request, Response } from "express";

export class JobController extends BaseController<JobEntity, JobDTO> {
  protected resource = "jobs";
  protected path = "/jobs";
  constructor(protected service: JobService) {
    super(service, JobDTO);
  }

  getPaymentTypes = async (req: Request, res: Response) => {
    const paymentTypes = await this.service.getPaymentTypes();
    const response = ResponseFormatterService.formatListResponse({
      data: paymentTypes,
      page: 1,
      limit: paymentTypes.length,
      total: paymentTypes.length,
      path: this.path,
      resource: this.resource,
    });
    return res.status(response.status_code).json(response);
  };
}
