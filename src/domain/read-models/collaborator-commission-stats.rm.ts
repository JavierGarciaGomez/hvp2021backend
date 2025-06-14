import { CommissionAllocationFlattedVO } from "../value-objects/commissions.vo";

export interface CollaboratorCommissionStats {
  collaboratorId: string;
  collaboratorCode: string;
  startDate: string;
  endDate: string;
  period: CollaboratorPeriodStats;
  results: CollaboratorResultsStats;
  periodCommissions: CommissionAllocationFlattedVO[];
}

export interface CollaboratorPeriodStats {
  globalAmounts: {
    numCommissions: number;
    totalAmount: number;
  };
  servicesTable: CollaboratorServiceTableRow[];
  commissionPercentagesByType: CollaboratorCommissionTypePercentage[];
}

export interface CollaboratorServiceTableRow {
  serviceName: string;
  quantity: number;
  amount: number;
}

export interface CollaboratorCommissionTypePercentage {
  commissionType: string;
  percentage: number;
  count: number;
  amount: number;
}

export interface CollaboratorResultsStats {
  historicalCommissionsAmountChart: CollaboratorHistoricalDataPoint[];
  historicalServicesNumberChart: CollaboratorHistoricalDataPoint[];
  historicalCareerServicesChart: CollaboratorHistoricalCareerDataPoint[];
  historicalCommissionTypeChart: CollaboratorCommissionTypeHistorical[];
}

export interface CollaboratorHistoricalDataPoint {
  period: string;
  value: number;
}

export interface CollaboratorHistoricalCareerDataPoint {
  period: string;
  data: {
    complexSurgeries: number;
    surgeries: number;
    surgeryAssistances: number;
    consultations: number;
    vaccines: number;
    totalServices: number;
  };
}

export interface CollaboratorCommissionTypeHistorical {
  period: string;
  [commissionType: string]: number | string;
}
