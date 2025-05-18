import { BaseDTO } from "./base.dto";
import { BaseEntity, CommissionAllocationProps } from "../../domain/entities";
import { BaseError } from "../../shared";
import { CommissionAllocationServiceVOProps } from "../../domain/value-objects/commissions.vo";

export class CommissionAllocationDTO implements BaseDTO, BaseEntity {
  id?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  date!: Date;
  branch!: string;
  ticketNumber!: string;
  services!: CommissionAllocationServiceVOProps[];

  constructor({ ...props }: CommissionAllocationProps) {
    Object.assign(this, props);
  }

  static create(data: CommissionAllocationProps): CommissionAllocationDTO {
    return this.validate(data);
  }

  static update(data: CommissionAllocationProps): CommissionAllocationDTO {
    return this.validate(data);
  }

  private static validate(
    data: CommissionAllocationProps
  ): CommissionAllocationDTO {
    const errors: string[] = [];

    const { services, ticketNumber, branch, date } = data;

    if (!ticketNumber)
      errors.push(`Commission allocation is missing ticketNumber`);
    if (!branch) errors.push(`Commission allocation is missing branch`);
    if (!date) errors.push(`Commission allocation is missing date`);

    if (services.length === 0)
      errors.push(`Commission allocation is missing services`);

    services.forEach((service, serviceIndex) => {
      if (!service.serviceId || !service.serviceName)
        errors.push(`Service at index ${serviceIndex} is missing service`);

      if (service.discount == null)
        errors.push(`Service at index ${serviceIndex} is missing discount`);
      if (service.quantity == null)
        errors.push(`Service at index ${serviceIndex} is missing quantity`);
      if (!service.modality)
        errors.push(`Service at index ${serviceIndex} is missing modality`);

      if (!service.commissions || service.commissions.length === 0) {
        errors.push(`Service at index ${serviceIndex} is missing commissions`);
      } else {
        service.commissions.forEach((commission, commissionIndex) => {
          if (!commission.collaboratorId || !commission.collaboratorCode)
            errors.push(
              `Commission at service index ${serviceIndex}, commission index ${commissionIndex} is missing collaborator`
            );

          if (!commission.commissionName)
            errors.push(
              `Commission at service index ${serviceIndex}, commission index ${commissionIndex} is missing commissionName`
            );
          if (!commission.commissionType)
            errors.push(
              `Commission at service index ${serviceIndex}, commission index ${commissionIndex} is missing commissionType`
            );
          if (commission.commissionAmount == null)
            errors.push(
              `Commission at service index ${serviceIndex}, commission index ${commissionIndex} is missing commissionAmount`
            );
        });
      }
    });

    if (errors.length) {
      throw BaseError.badRequest(errors.join(", "));
    }

    return new CommissionAllocationDTO({ ...data });
  }
}
