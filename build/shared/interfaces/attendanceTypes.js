"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendanceTypeDescriptions = exports.AttendanceType = void 0;
var AttendanceType;
(function (AttendanceType) {
    AttendanceType["ordinary"] = "Ordinary";
    AttendanceType["partialPermission"] = "Permission";
    AttendanceType["simulatedAbsence"] = "Simulated Absence";
    AttendanceType["restDay"] = "Rest Day";
    AttendanceType["vacation"] = "Vacation";
    AttendanceType["sickLeaveIMSSUnpaid"] = "IMSS Disability (Unpaid)";
    AttendanceType["sickLeaveIMSSPaid"] = "IMSS Paid Disability";
    AttendanceType["sickLeaveJustifiedByCompany"] = "Justified by Company";
    AttendanceType["unjustifiedAbsence"] = "Unjustified Absence";
    AttendanceType["dayLeave"] = "Permission Day (Deducted)";
    AttendanceType["NotCounted"] = "Not Counted";
})(AttendanceType || (exports.AttendanceType = AttendanceType = {}));
exports.attendanceTypeDescriptions = {
    [AttendanceType.ordinary]: {
        description: "Jornada habitual de trabajo. Se considera asistencia.",
        previousCode: "ORD",
    },
    [AttendanceType.partialPermission]: {
        description: "Permiso concedido al trabajador para llegar tarde o ausentarse antes, es una jornada ordinaria. Se considera asistencia.",
        previousCode: "PER",
    },
    [AttendanceType.simulatedAbsence]: {
        description: "Ausencia del trabajador, pero la empresa asume pagar su salario completo. Se considera como asistencia.",
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
        description: "Falta justificada por el IMSS, por los tres primeros días, pero no pagada; la empresa otorga una compensación del 60%. Se considera como incapacidad.",
        previousCode: "INC",
    },
    [AttendanceType.sickLeaveIMSSPaid]: {
        description: "Falta justificada del trabajador, pero el IMSS paga la jornada. Aplicable a partir del cuarto día. Se considera como incapacidad.",
        previousCode: "IMS",
    },
    [AttendanceType.sickLeaveJustifiedByCompany]: {
        description: "Falta justificada por la empresa sin justificante del IMSS, pero se paga al trabajador una compensación del 60%. Se considera como ausencia.",
        previousCode: "JUE",
    },
    [AttendanceType.unjustifiedAbsence]: {
        description: "Falta injustificada del trabajador, se descuenta del salario. Se considera como inasistencia.",
        previousCode: "INJ",
    },
    [AttendanceType.dayLeave]: {
        description: "Permiso concedido al trabajador que no acude a trabajar por permiso concedido previamente, se descuenta el día. Se considera como asistencia.",
        previousCode: "PED",
    },
    [AttendanceType.NotCounted]: {
        description: "Días no computados en virtud de que en la fecha, el trabajador no laboraba. No se considera en la cantidad de días.",
        previousCode: "NCO",
    },
};
