import { PayrollDatasource } from "../../domain";
import { PayrollEntity } from "../../domain/entities";
import { PayrollModel } from "../db";
import { BaseDatasourceMongoImp } from "./base.datasource.mongo-imp";

export class PayrollDatasourceMongoImp
  extends BaseDatasourceMongoImp<PayrollEntity>
  implements PayrollDatasource
{
  constructor() {
    super(PayrollModel, PayrollEntity);
  }
}
