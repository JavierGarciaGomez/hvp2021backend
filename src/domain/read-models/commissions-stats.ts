export interface CommissionsStats {
  startDate: string;
  endDate: string;
  collaboratorCodes: string[];
  collaboratorServicesData: CollaboratorServiceData[];
  summaryData: {
    totalByCollaborator: Record<string, number>;
    totalOverall: number;
  };
  chartData: {
    period: string;
    [colCode: string]: number | string;
  }[];
  servicesByCollaborator: {
    service: string;
    [colCode: string]: number | string;
  }[];
  modalitiesByCollaborator: {
    modality: string;
    [colCode: string]: number | string;
  }[];
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
