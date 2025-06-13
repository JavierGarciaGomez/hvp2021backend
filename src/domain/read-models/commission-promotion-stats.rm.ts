// Top-level response interface
export interface CommissionsPromotionStats {
  general: PromotionGeneralStats;
  individual: PromotionIndividualStats[];
}

// General stats section (quarterly + historical)
export interface PromotionGeneralStats {
  quarterly: PromotionCollaboratorRow[];
  historical: PromotionCollaboratorRow[];
}

// Single row in general stats table
export interface PromotionCollaboratorRow {
  collaborator: string;
  positionName: string;
  nextPositionName: string;
  complexSurgeries: number;
  surgeries: number;
  surgeryAssistances: number;
  consultations: number;
  vaccines: number;
  totalServices: number;
  amount: number;
}

// Individual stats section for a collaborator
export interface PromotionIndividualStats {
  collaborator: string;
  positionName: string;
  nextPositionName: string;
  metricsTable: PromotionMetricRow[];
  progressChart: PromotionChartPeriod[];
}

// Row in the metrics performance table (quarterly & historical)
export interface PromotionMetricRow {
  concept: string;
  quarterly: {
    performed: number;
    required: number;
    percentage: number;
  };
  historical: {
    performed: number;
    required: number;
    percentage: number;
  };
}

// Chart data to show performance evolution over time
export interface PromotionChartPeriod {
  period: string; // e.g., "Q1 2025"
  data: {
    complexSurgeries: number;
    surgeries: number;
    surgeryAssistances: number;
    consultations: number;
    vaccines: number;
    totalServices: number;
    amount: number;
  };
}
