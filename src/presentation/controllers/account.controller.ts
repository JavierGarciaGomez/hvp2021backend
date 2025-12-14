import { AccountDTO, AccountService } from "../../application";
import { BaseController } from "./base.controller";
import { AccountEntity } from "../../domain";

export class AccountController extends BaseController<
  AccountEntity,
  AccountDTO
> {
  protected resource = "accounts";
  protected path = "/accounts";
  constructor(protected service: AccountService) {
    super(service, AccountDTO);
  }
}
