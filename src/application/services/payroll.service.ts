import { PayrollEntity } from "../../domain/entities";
import { BaseService } from "./base.service";
import { PayrollRepository } from "../../domain";
import { PayrollDTO } from "../dtos";

export class PayrollService extends BaseService<PayrollEntity, PayrollDTO> {
  constructor(protected readonly repository: PayrollRepository) {
    super(repository, PayrollEntity);
  }

  public getResourceName(): string {
    return "payroll";
  }
}
