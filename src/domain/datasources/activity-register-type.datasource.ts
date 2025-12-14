import { ActivityRegisterTypeVO } from "../value-objects";
import { BaseDatasource } from "./base.datasource";

export abstract class ActivityRegisterTypeDatasource extends BaseDatasource<ActivityRegisterTypeVO> {
  abstract createMany(
    notifications: ActivityRegisterTypeVO[]
  ): Promise<ActivityRegisterTypeVO[]>;
}
