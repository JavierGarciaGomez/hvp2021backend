import {
  ActivityRegisterTypeDatasource,
  ActivityRegisterTypeRepository,
  ActivityRegisterTypeVO,
} from "../../domain";

import { BaseRepositoryImpl } from "./base.repository.imp";

export class ActivityRegisterTypeRepositoryImp
  extends BaseRepositoryImpl<ActivityRegisterTypeVO>
  implements ActivityRegisterTypeRepository
{
  constructor(protected readonly datasource: ActivityRegisterTypeDatasource) {
    super(datasource);
  }
}
