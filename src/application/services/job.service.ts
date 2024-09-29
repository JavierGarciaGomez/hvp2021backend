import { JobEntity } from "../../domain/entities";
import { BaseService } from "./base.service";
import { JobRepository, PaymentType } from "../../domain";
import { JobDTO } from "../dtos";

export class JobService extends BaseService<JobEntity, JobDTO> {
  constructor(protected readonly repository: JobRepository) {
    super(repository, JobEntity);
  }

  public getResourceName(): string {
    return "job";
  }

  public getPaymentTypes = async () => {
    const paymentTypeArray = Object.entries(PaymentType).map(
      ([key, value], index) => ({
        label: value,
        value: value,
        id: key, // or you can use `index` for unique IDs
      })
    );

    return paymentTypeArray;
  };
}
