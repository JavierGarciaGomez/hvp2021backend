import { Schema, Document } from "mongoose";
import { BaseEntity, newBaseEntityProps } from "./base.entity";
import {
  CommissionAllocationServiceVODocument,
  CommissionAllocationServiceVOProps,
} from "../value-objects/commissions.vo";

export interface CommissionAllocationBase extends newBaseEntityProps {
  date: Date;
  branch: string | Schema.Types.ObjectId;
  ticketNumber: string;
  services:
    | CommissionAllocationServiceVOProps[]
    | CommissionAllocationServiceVODocument[];
}

export interface CommissionAllocationProps extends CommissionAllocationBase {
  id?: string;
  createdBy?: string;
  updatedBy?: string;
  services: CommissionAllocationServiceVOProps[];
}

export interface CommissionAllocationDocument
  extends CommissionAllocationBase,
    Document {
  id: Schema.Types.ObjectId;
  createdBy: Schema.Types.ObjectId;
  updatedBy: Schema.Types.ObjectId;
  date: Date;
  services: CommissionAllocationServiceVODocument[];
}

export class CommissionAllocationEntity implements BaseEntity {
  id?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  date!: Date;
  branch!: string;
  ticketNumber!: string;
  services!: CommissionAllocationServiceVOProps[];
  constructor(props: CommissionAllocationProps) {
    Object.assign(this, props);
  }

  public static fromDocument(document: CommissionAllocationDocument) {
    const data = document.toObject<CommissionAllocationDocument>();
    const { _id, __v, ...rest } = data;

    return new CommissionAllocationEntity({
      ...rest,
      id: _id.toString(),
      createdBy: data.createdBy?.toString(),
      updatedBy: data.updatedBy?.toString(),
      services: data.services.map((service) => {
        const { _id, __v, ...rest } = service;
        return {
          ...rest,
          id: _id.toString(),
          serviceId: service.serviceId.toString(),
          commissions: service.commissions.map((commission) => {
            const { _id: commissionId, ...commissionRest } = commission;
            return {
              ...commissionRest,
              id: commissionId.toString(),
              collaboratorId: commission.collaboratorId.toString(),
            };
          }),
        };
      }),
    });
  }
}
