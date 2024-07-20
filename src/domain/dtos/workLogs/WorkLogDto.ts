import { WorkLogActivity } from "../../../shared";

interface Options {
  _id?: string;
  logDate: string;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  activities?: WorkLogActivity[];
}
export class WorkLogDto {
  private constructor(public readonly data: Readonly<Options>) {}

  static create(data: Options): [string?, WorkLogDto?] {
    return this.createOrUpdate(data);
  }

  static update(data: Options): [string?, WorkLogDto?] {
    return this.createOrUpdate(data);
  }

  private static createOrUpdate(data: Options): [string?, WorkLogDto?] {
    const validationError = this.validateOptions(data);
    if (validationError) return [validationError];

    const { activities } = data;

    return [undefined, new WorkLogDto({ ...data, activities })];
  }

  private static validateOptions(data: Options): string | undefined {
    let { activities } = data;

    return undefined;
  }
}
