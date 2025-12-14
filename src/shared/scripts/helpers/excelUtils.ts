import { CommissionRow } from "../commissions/types";

const serviceEquivalents: Record<string, string> = {
  "certificado medico": "Certificado médico",
  "certificado médico": "Certificado médico",
  consulta: "Consulta",
  vacuna: "Vacuna",
  // Add more as needed
};

export class CommissionUtils {
  static parseCurrency(value: any): number {
    const stringValue = String(value);
    return parseFloat(stringValue.replace(/[^0-9.-]+/g, "")) || 0;
  }

  static parseDiscount(value: any): number {
    const stringValue = String(value);
    if (stringValue.includes("%")) {
      return parseFloat(stringValue.replace("%", "")) || 0;
    }
    return parseFloat(stringValue) || 0;
  }

  static formatDate(date: any): string {
    if (typeof date === "string") {
      const [day, month, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(
        2,
        "0"
      )}T06:00:00.000Z`;
    }

    if (typeof date === "number") {
      const excelEpoch = new Date(1899, 11, 30);
      const jsDate = new Date(excelEpoch.getTime() + date * 86400000);
      return `${jsDate.toISOString().split("T")[0]}T06:00:00.000Z`;
    }

    throw new Error(`Unsupported date format: ${date}`);
  }

  static getModality(entries: CommissionRow[]) {
    for (const entry of entries) {
      if (entry.Servicio === "Asistencia") {
        return "ASSISTED";
      }
    }
    return "SIMPLE";
  }

  static normalizeServiceName(serviceName: string): string {
    const key = serviceName.trim().toLowerCase();
    return serviceEquivalents[key] || serviceName.trim();
  }
}
