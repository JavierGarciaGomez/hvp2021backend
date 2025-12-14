// TODO: DELETE
import { TimeOffStatus, TimeOffType } from "../../../shared";

interface Options {
  approvalDate?: Date;
  approvedBy?: string;
  collaborator: string;
  createdAt?: Date;
  createdBy?: string;
  collaboratorNote?: string;
  managerNote?: string;
  requestedAt?: Date;
  requestedDays: Date[];
  status: TimeOffStatus;
  timeOffType: TimeOffType;
  updatedAt?: Date;
  updatedBy?: string;
}
export class TimeOffRequestDto {
  private constructor(public readonly data: Readonly<Options>) {}

  static create(data: Options): [string?, TimeOffRequestDto?] {
    return this.createOrUpdate(data);
  }

  static update(data: Options): [string?, TimeOffRequestDto?] {
    return this.createOrUpdate(data);
  }

  private static createOrUpdate(data: Options): [string?, TimeOffRequestDto?] {
    const validationError = this.validateOptions(data);
    if (validationError) return [validationError];

    const {
      collaborator,
      requestedDays,
      timeOffType,
      status,
      collaboratorNote,
    } = data;

    return [
      undefined,
      new TimeOffRequestDto({
        collaborator,
        requestedDays,
        timeOffType,
        status,
        collaboratorNote,
      }),
    ];
  }

  private static validateOptions(data: Options): string | undefined {
    let { collaborator, requestedDays, timeOffType, status } = data;

    status = status ? status : TimeOffStatus.Pending;

    if (!collaborator) return "Collaborator ID is missing";
    if (!requestedDays || requestedDays.length === 0)
      return "Requested days are missing";
    if (!Object.values(TimeOffType).includes(timeOffType))
      return "Invalid time off type";
    if (!Object.values(TimeOffStatus).includes(status))
      return "Invalid time off status";

    return undefined;
  }
}
