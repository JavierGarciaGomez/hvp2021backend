import { PayrollEntity } from "../entities";
import { BaseDatasource } from "./base.datasource";

export abstract class PayrollDatasource extends BaseDatasource<PayrollEntity> {}
