import { BaseService } from "./base.service";
import {
  ActivityRegisterTypeRepository,
  ActivityRegisterTypeVO,
} from "../../domain";

import { BaseOptionVODTO } from "../dtos/base-option.dto";
import { BaseError } from "../../shared";

export class ActivityRegisterTypeService extends BaseService<
  ActivityRegisterTypeVO,
  BaseOptionVODTO
> {
  constructor(protected readonly repository: ActivityRegisterTypeRepository) {
    super(repository, ActivityRegisterTypeVO);
  }

  public create = async (data: BaseOptionVODTO): Promise<BaseOptionVODTO> => {
    const existingByValue = await this.repository.exists({ value: data.value });
    if (existingByValue) {
      throw BaseError.conflict(`Value ${data.value} already exists`);
    }
    const existingByLabel = await this.repository.exists({ label: data.label });
    if (existingByLabel) {
      throw BaseError.conflict(`Label ${data.label} already exists`);
    }
    const entity = new ActivityRegisterTypeVO(data);
    return await this.repository.create(entity);
  };

  public getResourceName(): string {
    return "activity-register-type";
  }
}
