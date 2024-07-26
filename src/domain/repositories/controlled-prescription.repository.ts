import { ControlledPrescriptionEntity } from "../entities";
import { BaseRepository } from "./base.repository";

export abstract class ControlledPrescriptionRepository extends BaseRepository<ControlledPrescriptionEntity> {
  abstract createMany(
    notifications: ControlledPrescriptionEntity[]
  ): Promise<ControlledPrescriptionEntity[]>;
}
