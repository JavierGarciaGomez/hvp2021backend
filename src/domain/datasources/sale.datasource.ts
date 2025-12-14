import { SaleEntity } from "../entities/sale.entity";
import { BaseDatasource } from "./base.datasource";

export abstract class SaleDatasource extends BaseDatasource<SaleEntity> {}
