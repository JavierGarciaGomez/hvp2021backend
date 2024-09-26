import { JobDTO, JobService } from "../../application";
import { BaseController } from "./base.controller";
import { JobEntity } from "../../domain";

export class JobController extends BaseController<JobEntity, JobDTO> {
  protected resource = "branch";
  protected path = "/branches";
  constructor(protected service: JobService) {
    super(service, JobDTO);
  }
}
