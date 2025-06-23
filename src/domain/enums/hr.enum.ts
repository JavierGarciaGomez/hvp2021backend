export enum WorkingDayType {
  NonComputableShift = "Jornada no computable",
  Vacation = "Vacaciones",
  PersonalLeave = "Asuntos propios",
  RestDay = "Descanso",
  SimulatedAsistance = "Asistencia simulada",
  SickLeave = "Incapacidad",
  ForceMajeure = "Fuerza mayor",
  ShiftToBeCompensated = "Jornada a reponer",
  JustifiedAbsenceByCompany = "Inasistencia justificada por la empresa",
  AuthorizedUnjustifiedAbsence = "Falta injustificada autorizada",
  UnjustifiedAbsence = "Falta injustificada",
  OrdinaryShift = "Jornada ordinaria",
  LatePermission = "Permiso de llegar tarde",
  EarlyLeavePermission = "Permiso de salida anticipada",
  UnscheduledWork = "Trabajo no calendarizado",
  Tardiness = "Retardo",
  EarlyDeparture = "Salida anticipada",
  IncompleteRecord = "Registro incompleto",
  CompensationShift = "Reposición de jornada",
}

export enum PayrollStatus {
  Pending = "pending",
  Approved = "approved",
  Paid = "paid",
}

export enum HRPaymentType {
  "HOURLY" = "HOURLY",
  "SALARY" = "SALARY",
  "INFORMAL" = "INFORMAL",
}

export enum HRAttendanceSource {
  "ATTENDANCE_RECORDS" = "ATTENDANCE_RECORDS",
  "ACTIVITY_REGISTER" = "ACTIVITY_REGISTER",
}
