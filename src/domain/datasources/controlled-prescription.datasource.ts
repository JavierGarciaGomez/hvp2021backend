import { IOption } from "../../shared";
import { ControlledPrescriptionEntity } from "../entities";
import { BaseDatasource } from "./base.datasource";

export abstract class ControlledPrescriptionDatasource extends BaseDatasource<ControlledPrescriptionEntity> {
  abstract createMany(
    resource: ControlledPrescriptionEntity[]
  ): Promise<ControlledPrescriptionEntity[]>;
}
