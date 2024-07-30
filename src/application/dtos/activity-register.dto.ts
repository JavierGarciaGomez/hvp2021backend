import { BaseDTO } from "./base.dto";
import { ActivityRegisterProps } from "../../domain/entities";
import { checkForErrors } from "../../shared";

export class ActivityRegisterDTO implements BaseDTO {
  id?: string;
  collaborator!: string;
  activity!: string;
  desc?: string;
  startingTime!: Date;
  endingTime?: Date;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;

  constructor(props: ActivityRegisterProps) {
    Object.assign(this, props);
  }

  static create(data: ActivityRegisterProps): ActivityRegisterDTO {
    return ActivityRegisterDTO.validate(data);
  }

  static update(data: ActivityRegisterProps): ActivityRegisterDTO {
    return ActivityRegisterDTO.validate(data);
  }

  private static validate(data: ActivityRegisterProps): ActivityRegisterDTO {
    const errors = ActivityRegisterDTO.getValidationErrors(data);
    checkForErrors(errors);
    return new ActivityRegisterDTO(data);
  }

  private static getValidationErrors(data: ActivityRegisterProps): string[] {
    const errors: string[] = [];

    ActivityRegisterDTO.validateRequiredFields(data, errors);
    ActivityRegisterDTO.validateStartingTime(data, errors);
    ActivityRegisterDTO.validateTimeRange(data, errors);

    return errors;
  }

  private static validateRequiredFields(
    data: ActivityRegisterProps,
    errors: string[]
  ): void {
    if (!data.collaborator) errors.push("Collaborator is required");
    if (!data.activity) errors.push("Activity is required");
    if (!data.startingTime) errors.push("Starting time is required");
  }

  private static validateStartingTime(
    data: ActivityRegisterProps,
    errors: string[]
  ): void {
    if (data.startingTime) {
      const startingTimeDate = new Date(data.startingTime);
      if (isNaN(startingTimeDate.getTime())) {
        errors.push("Starting time is invalid");
      } else if (startingTimeDate > new Date()) {
        errors.push("Starting time should not be in the future");
      }
    }
  }

  private static validateTimeRange(
    data: ActivityRegisterProps,
    errors: string[]
  ): void {
    if (data.startingTime && data.endingTime) {
      const startingTimeDate = new Date(data.startingTime);
      const endingTimeDate = new Date(data.endingTime);

      if (startingTimeDate > endingTimeDate) {
        errors.push("Starting time should be before ending time");
      }

      const durationInHours =
        (endingTimeDate.getTime() - startingTimeDate.getTime()) /
        (60 * 60 * 1000);
      if (durationInHours > 8) {
        errors.push("Activity duration should not be longer than 8 hours");
      }
    }
  }
}
