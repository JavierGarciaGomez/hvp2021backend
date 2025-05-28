export interface CommissionRow {
  Fecha: string | number;
  Folio: number;
  Colaborador: string;
  Servicio: string;
  Cantidad: number;
  Desc: string | number;
  Tipo: string;
  "Precio base": number;
  Comisión: number;
}

export type GroupedCommissions = Map<string, CommissionRow[]>;

export interface TicketService {
  serviceId: string;
  serviceName: string;
  basePrice: number;
  discount: number;
  quantity: number;
  modality: string;
  isBonus: boolean;
  bonusType?: string;
  commissions: CommissionDetail[];
}

export interface CommissionDetail {
  collaboratorId: string;
  collaboratorCode: string;
  commissionName: string;
  commissionType: string;
  commissionAmount: number;
}

export interface TicketOutput {
  date: string;
  branch: string;
  ticketNumber: string;
  services: TicketService[];
}
