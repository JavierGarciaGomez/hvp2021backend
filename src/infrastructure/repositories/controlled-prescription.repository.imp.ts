import {
  ControlledPrescriptionDatasource,
  ControlledPrescriptionRepository,
} from "../../domain";
import { ControlledPrescriptionEntity } from "../../domain/entities";
import { IOption } from "../../shared";
import { BaseRepositoryImpl } from "./base.repository.imp";

export class ControlledPrescriptionRepositoryImpl
  extends BaseRepositoryImpl<ControlledPrescriptionEntity>
  implements ControlledPrescriptionRepository
{
  constructor(protected readonly datasource: ControlledPrescriptionDatasource) {
    super(datasource);
  }
}
