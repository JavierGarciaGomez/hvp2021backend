import { CommissionCalculationType } from "../enums";

export interface CommissionCalculation {
  date: string;
  services: CommissionableServiceCalculationVO[];
}

export interface CommissionableServiceCalculationVO {
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
