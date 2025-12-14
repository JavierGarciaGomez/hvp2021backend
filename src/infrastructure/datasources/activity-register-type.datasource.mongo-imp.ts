import {
  ActivityRegisterTypeDatasource,
  ActivityRegisterTypeVO,
} from "../../domain";
import { ActivityRegisterTypeModel } from "../db";

import { BaseDatasourceMongoImp } from "./base.datasource.mongo-imp";

export class ActivityRegisterTypeDatasourceMongoImp
  extends BaseDatasourceMongoImp<ActivityRegisterTypeVO>
  implements ActivityRegisterTypeDatasource
{
  constructor() {
    super(ActivityRegisterTypeModel, ActivityRegisterTypeVO);
  }
}
