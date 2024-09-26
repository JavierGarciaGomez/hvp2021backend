import { JobEntity } from "../../domain/entities";
import { BaseService } from "./base.service";
import { JobRepository } from "../../domain";
import { JobDTO } from "../dtos";

export class JobService extends BaseService<JobEntity, JobDTO> {
  constructor(protected readonly repository: JobRepository) {
    super(repository, JobEntity);
  }

  public getResourceName(): string {
    return "job";
  }
}
