import { EmploymentDTO, EmploymentService } from "../../application";
import { BaseController } from "./base.controller";
import { EmploymentEntity } from "../../domain";

export class EmploymentController extends BaseController<
  EmploymentEntity,
  EmploymentDTO
> {
  protected resource = "employments";
  protected path = "/employments";
  constructor(protected service: EmploymentService) {
    super(service, EmploymentDTO);
  }
}
