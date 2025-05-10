import { CommissionCalculationType } from "../enums";

export interface CommissionCalculation {
  date: string;
  services: CommissionableServiceCalculationVO[];
}

export interface CommissionableServiceCalculationVO {
  serviceId: string;
  serviceName: string;
  commissionCalculationType: CommissionCalculationType;
  basePrice: number;
  baseCommission: number;
  baseRate: number;
  maxRate: number;
  allowSalesCommission: boolean;
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
