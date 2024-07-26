import { ControlledPrescriptionEntity } from "../entities";
import { BaseDatasource } from "./base.datasource";

export abstract class ControlledPrescriptionDatasource extends BaseDatasource<ControlledPrescriptionEntity> {
  abstract createMany(
    notifications: ControlledPrescriptionEntity[]
  ): Promise<ControlledPrescriptionEntity[]>;
}
