import { PublicHolidaysDTO, PublicHolidaysService } from "../../application";
import { BaseController } from "./base.controller";
import { PublicHolidaysEntity } from "../../domain";

export class PublicHolidaysController extends BaseController<
  PublicHolidaysEntity,
  PublicHolidaysDTO
> {
  protected resource = "public-holidays";
  protected path = "/public-holidays";
  constructor(protected service: PublicHolidaysService) {
    super(service, PublicHolidaysDTO);
  }
}
