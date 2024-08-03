import {
  ControlledPrescriptionDatasource,
  ControlledPrescriptionStatus,
} from "../../domain";
import { ControlledPrescriptionEntity } from "../../domain/entities";
import { getOptionFromEnum, IOption } from "../../shared";
import { ControlledPrescriptionModel } from "../db";

import { BaseDatasourceMongoImp } from "./base.datasource.mongo-imp";

export class ControlledPrescriptionDataSourceMongoImp
  extends BaseDatasourceMongoImp<ControlledPrescriptionEntity>
  implements ControlledPrescriptionDatasource
{
  constructor() {
    super(ControlledPrescriptionModel, ControlledPrescriptionEntity);
  }
}
