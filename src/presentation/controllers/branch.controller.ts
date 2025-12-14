import { BranchDTO, BranchService } from "../../application";
import { BaseController } from "./base.controller";
import { BranchEntity } from "../../domain";

export class BranchController extends BaseController<BranchEntity, BranchDTO> {
  protected resource = "branch";
  protected path = "/branches";
  constructor(protected service: BranchService) {
    super(service, BranchDTO);
  }
}
