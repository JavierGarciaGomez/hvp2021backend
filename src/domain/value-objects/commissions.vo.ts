import { Document, Schema } from "mongoose";
import {
  CommissionBonusType,
  CommissionCalculationType,
  CommissionModality,
  CommissionType,
} from "../enums";

// Commission Allocation VO
export interface CommissionAllocationVOBase {
  id?: string | Schema.Types.ObjectId;
  collaboratorId: string | Schema.Types.ObjectId;
  collaboratorCode: string;
  commissionName: string;
  commissionType: CommissionType;
  commissionAmount: number;
}

export interface CommissionAllocationVOProps
  extends CommissionAllocationVOBase {
  id?: string;
  collaboratorId: string;
}

export interface CommissionAllocationVODocument
  extends CommissionAllocationVOBase,
    Document {
  id: Schema.Types.ObjectId;
  collaboratorId: Schema.Types.ObjectId;
}

export interface CommissionAllocationVO extends CommissionAllocationVOBase {
  id: string;
  collaboratorId: string;
}

export const commissionAllocationSchema = new Schema({
  collaboratorId: {
    type: Schema.Types.ObjectId,
    ref: "Collaborator",
    required: true,
  },
  collaboratorCode: { type: String, required: true },
  commissionName: { type: String, required: true },
  commissionType: { type: String, required: true, enum: CommissionType },
  commissionAmount: { type: Number, required: true, default: 0 },
});

// Commission Allocation Service VO
export interface CommissionAllocationServiceVOBase {
  id?: string | Schema.Types.ObjectId;
  serviceId: string | Schema.Types.ObjectId;
  serviceName: string;
  basePrice: number;
  discount: number;
  quantity: number;
  modality: CommissionModality;
  isBonus: boolean;
  bonusType?: CommissionBonusType;
  commissions: CommissionAllocationVOBase[] | CommissionAllocationVODocument[];
}

export interface CommissionAllocationServiceVOProps
  extends CommissionAllocationServiceVOBase {
  id?: string;
  serviceId: string;
}

export interface CommissionAllocationServiceVODocument
  extends CommissionAllocationServiceVOBase,
    Document {
  id: Schema.Types.ObjectId;
  serviceId: Schema.Types.ObjectId;
  commissions: CommissionAllocationVODocument[];
}

export interface CommissionAllocationServiceVO
  extends CommissionAllocationServiceVOBase {
  id: string;
  serviceId: string;
}

export const commissionAllocationServiceSchema = new Schema({
  serviceId: {
    type: Schema.Types.ObjectId,
    ref: "CommissionableService",
    required: true,
  },
  serviceName: { type: String, required: true },
  basePrice: { type: Number, required: true, default: 0 },
  discount: { type: Number, required: true, default: 0 },
  quantity: { type: Number, required: true, default: 0 },
  modality: { type: String, required: true, enum: CommissionModality },
  isBonus: { type: Boolean, required: true, default: false },
  bonusType: { type: String, required: false, enum: CommissionBonusType },
  commissions: {
    type: [commissionAllocationSchema],
    required: false,
    default: [],
  },
});

// Commission Service Calculation VO
export interface CommissionServiceCalculationVO {
  id: string;
  name: string;
  commissionCalculationType: CommissionCalculationType;
  basePrice: number;
  baseCommission: number;
  maxCommission: number;
  baseRate: number;
  maxRate: number;
  allowSalesCommission: boolean;
  isActive: boolean;
  collaborators: CommissionCollaboratorCalculationVO[];
}
export interface CommissionCollaboratorCalculationVO {
  serviceId: string;
  serviceName: string;
  collaboratorId: string;
  collaboratorCode: string;
  commissionName: string;
  commissionAmount: number;
  commissionRate: number;
  maxAmount: number;
  maxRate: number;
}

export interface CommissionAllocationFlattedVO {
  date: Date;
  basePrice: number;
  branch: string;
  ticketNumber: string;
  serviceId: string;
  serviceName: string;
  modality: CommissionModality;
  bonusType?: CommissionBonusType;
  collaboratorId: string;
  collaboratorCode: string;
  commissionName: string;
  commissionType: CommissionType;
  commissionAmount: number;
  id: string;
  quantity: number;
}
