import { PayrollDTO, PayrollService } from "../../application";
import { BaseController } from "./base.controller";
import { PayrollEntity } from "../../domain";

export class PayrollController extends BaseController<
  PayrollEntity,
  PayrollDTO
> {
  protected resource = "payrolls";
  protected path = "/payrolls";
  constructor(protected service: PayrollService) {
    super(service, PayrollDTO);
  }
}
