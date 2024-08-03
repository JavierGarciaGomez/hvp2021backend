import { IOption } from "../../shared";
import { ControlledPrescriptionEntity } from "../entities";
import { BaseRepository } from "./base.repository";

export abstract class ControlledPrescriptionRepository extends BaseRepository<ControlledPrescriptionEntity> {
  abstract createMany(
    resource: ControlledPrescriptionEntity[]
  ): Promise<ControlledPrescriptionEntity[]>;
}
