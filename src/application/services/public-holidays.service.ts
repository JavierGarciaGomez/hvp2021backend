import { PublicHolidaysEntity } from "../../domain/entities";
import { BaseService } from "./base.service";
import { PublicHolidaysRepository } from "../../domain";
import { PublicHolidaysDTO } from "../dtos";

export class PublicHolidaysService extends BaseService<
  PublicHolidaysEntity,
  PublicHolidaysDTO
> {
  constructor(protected readonly repository: PublicHolidaysRepository) {
    super(repository, PublicHolidaysEntity);
  }

  public getResourceName(): string {
    return "public-holidays";
  }
}
