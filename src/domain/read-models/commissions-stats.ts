export interface CommissionsStats {
  startDate: string;
  endDate: string;
  periodStats: CommissionsPeriodStats;
  globalData: {
    commissionsAmountTable: CommissionsTableRow[];
    commissionsNumberTable: CommissionsTableRow[];
  };
}

export type CollaboratorServiceData = {
  serviceId: string;
  serviceName: string;
  count: number;
  collaborators: {
    collaboratorCode: string;
    collaboratorId: string;
    commissionAmount: number;
    commissionCount: number;
  }[];
};

export interface PeriodCollaboratorStats {
  collaboratorId: string;
  collaboratorCode: string;
  commissionAmount: number;
  commissionCount: number;
}

export interface PeriodServicesByCollaborator {
  serviceId: string;
  serviceName: string;
  collaborators: {
    collaboratorId: string;
    collaboratorCode: string;
    commissionAmount: number;
    servicesCount: number;
  }[];
}

export interface CommissionsPeriodStats {
  global: {
    numCommissions: number;
    numServices: number;
    totalAmount: number;
  };
  periodStatsByCollaborator: PeriodCollaboratorStats[];
  periodServicesByCollaborator: PeriodServicesByCollaborator[];
}

export interface CommissionsTableRow {
  period: string;
  [colCode: string]: number | string;
}
