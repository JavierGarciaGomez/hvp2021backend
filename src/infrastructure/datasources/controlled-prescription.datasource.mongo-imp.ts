import { ControlledPrescriptionDatasource } from "../../domain";
import { ControlledPrescriptionEntity } from "../../domain/entities";
import { ControlledPrescriptionModel } from "../db";

import { BaseDatasourceMongoImp } from "./base.datasource.mongo";

export class ControlledPrescriptionDataSourceMongoImp
  extends BaseDatasourceMongoImp<ControlledPrescriptionEntity>
  implements ControlledPrescriptionDatasource
{
  constructor() {
    super(ControlledPrescriptionModel, ControlledPrescriptionEntity);
  }
}
