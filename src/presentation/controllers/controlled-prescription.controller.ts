import {
  ControlledPrescriptionDTO,
  ControlledPrescriptionService,
} from "../../application";
import { BaseController } from "./base.controller";
import { ControlledPrescriptionEntity } from "../../domain";
import { mainRoutes } from "../../mainRoutes";

export class ControlledPrescriptionController extends BaseController<
  ControlledPrescriptionEntity,
  ControlledPrescriptionDTO
> {
  protected resource = "controlled-prescription";
  protected path = "/controlled-prescriptions";
  constructor(protected service: ControlledPrescriptionService) {
    super(service, ControlledPrescriptionDTO);
  }
}
