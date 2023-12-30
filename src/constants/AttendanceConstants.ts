export enum AttendanceType {
  ordinary = "Ordinary",
  partialPermission = "Permission",
  simulatedAbsence = "Simulated Absence",
  restDay = "Rest Day",
  vacation = "Vacation",
  sickLeaveIMSSUnpaid = "IMSS Disability (Unpaid)",
  sickLeaveIMSSPaid = "IMSS Paid Disability",
  sickLeaveJustifiedByCompany = "Justified by Company",
  unjustifiedAbsence = "Unjustified Absence",
  dayLeave = "Permission Day (Deducted)",
  NotCounted = "Not Counted",
}

export interface AttendanceTypeInfo {
  description: string;
  previousCode: string;
}

export const attendanceTypeDescriptions: Record<
  AttendanceType,
  AttendanceTypeInfo
> = {
  [AttendanceType.ordinary]: {
    description: "Jornada habitual de trabajo. Se considera asistencia.",
    previousCode: "ORD",
  },
  [AttendanceType.partialPermission]: {
    description:
      "Permiso concedido al trabajador para llegar tarde o ausentarse antes, es una jornada ordinaria. Se considera asistencia.",
    previousCode: "PER",
  },
  [AttendanceType.simulatedAbsence]: {
    description:
      "Ausencia del trabajador, pero la empresa asume pagar su salario completo. Se considera como asistencia.",
    previousCode: "ASE",
  },
  [AttendanceType.restDay]: {
    description: "Jornada de descanso semanal",
    previousCode: "DES",
  },
  [AttendanceType.vacation]: {
    description: "Jornada de vacaciones",
    previousCode: "VAC",
  },
  [AttendanceType.sickLeaveIMSSUnpaid]: {
    description:
      "Falta justificada por el IMSS, por los tres primeros días, pero no pagada; la empresa otorga una compensación del 60%. Se considera como incapacidad.",
    previousCode: "INC",
  },
  [AttendanceType.sickLeaveIMSSPaid]: {
    description:
      "Falta justificada del trabajador, pero el IMSS paga la jornada. Aplicable a partir del cuarto día. Se considera como incapacidad.",
    previousCode: "IMS",
  },
  [AttendanceType.sickLeaveJustifiedByCompany]: {
    description:
      "Falta justificada por la empresa sin justificante del IMSS, pero se paga al trabajador una compensación del 60%. Se considera como ausencia.",
    previousCode: "JUE",
  },
  [AttendanceType.unjustifiedAbsence]: {
    description:
      "Falta injustificada del trabajador, se descuenta del salario. Se considera como inasistencia.",
    previousCode: "INJ",
  },
  [AttendanceType.dayLeave]: {
    description:
      "Permiso concedido al trabajador que no acude a trabajar por permiso concedido previamente, se descuenta el día. Se considera como asistencia.",
    previousCode: "PED",
  },
  [AttendanceType.NotCounted]: {
    description:
      "Días no computados en virtud de que en la fecha, el trabajador no laboraba. No se considera en la cantidad de días.",
    previousCode: "NCO",
  },
};

export enum TimeOffType {
  partialPermission = AttendanceType.partialPermission,
  simulatedAbsence = AttendanceType.simulatedAbsence,
  vacation = AttendanceType.vacation,
  sickLeaveIMSSUnpaid = AttendanceType.sickLeaveIMSSUnpaid,
  sickLeaveIMSSPaid = AttendanceType.sickLeaveIMSSPaid,
  sickLeaveJustifiedByCompany = AttendanceType.sickLeaveJustifiedByCompany,
  dayLeave = AttendanceType.dayLeave,
}

export enum TimeOffStatus {
  pending = "Pending",
  approved = "Approved",
  rejected = "Rejected",
}
