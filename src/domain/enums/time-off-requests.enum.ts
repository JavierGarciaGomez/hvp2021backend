export enum TimeOffStatus {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
  Canceled = "Canceled",
}

export enum TimeOffType {
  Vacation = "Vacation",
  PersonalLeave = "Asuntos propios",
  SickLeaveIMSS = "Incapacidad por IMSS",
  ShiftToBeCompensated = "Jornada a reponer",
  JustifiedAbsenceByCompany = "Inasistencia justificada por la empresa",
  AuthorizedUnjustifiedAbsence = "Falta injustificada autorizada",
  EarlyLeavePermission = "Permiso de salida anticipada",
  LatePermission = "Permiso de llegar tarde",
  CompensationShift = "Reposición de jornada",
}
