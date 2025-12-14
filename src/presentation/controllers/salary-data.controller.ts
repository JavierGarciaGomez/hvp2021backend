import { SalaryDataDTO, SalaryDataService } from "../../application";
import { BaseController } from "./base.controller";
import { SalaryDataEntity } from "../../domain";

export class SalaryDataController extends BaseController<
  SalaryDataEntity,
  SalaryDataDTO
> {
  protected resource = "salary-data";
  protected path = "/salary-data";
  constructor(protected service: SalaryDataService) {
    super(service, SalaryDataDTO);
  }
}
