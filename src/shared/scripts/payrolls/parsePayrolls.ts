import * as XLSX from "xlsx";
import * as fs from "fs";
import path from "path";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import collaboratorsData from "../data/collaboratorsData.json";
import { PayrollStatus, HRPaymentType } from "../../../domain/enums";
import type {
  PayrollGeneralData,
  PayrollEarnings,
  PayrollDeductions,
  PayrollTotals,
  PayrollContextData,
  PayrollConcept,
} from "../../../domain/value-objects";

dayjs.extend(utc);
dayjs.extend(timezone);

interface PayrollRow {
  Date: any;
  Código: number;
  Concepto: string;
  Beneficiario: string;
  Ingreso?: string;
  Egreso?: string;
  " Ingreso "?: string;
  " Egreso "?: string;
}

interface CollaboratorPayrollData {
  date: string;
  collaboratorId: string;
  collaboratorCode: string;
  jobId?: string;
  concepts: Map<number, number>; // code -> amount
  conceptDescriptions: Map<number, string>; // code -> description
}

interface PayrollOutput {
  collaboratorId: string;
  jobId?: string;
  payrollStatus: PayrollStatus;
  periodStartDate: string;
  periodEndDate: string;
  generalData: PayrollGeneralData;
  earnings: PayrollEarnings;
  deductions: PayrollDeductions;
  totals: PayrollTotals;
  contextData: PayrollContextData;
}

const transformExcelToJson = () => {
  const inputPath = path.resolve(__dirname, "../data/payroll.xlsx");
  const outputPath = path.resolve(__dirname, "./payrollOutput.json");

  // Load collaborators data
  const collaborators = Object.fromEntries(
    collaboratorsData.data.map((c: any) => [
      c.col_code,
      {
        id: c.id,
        col_code: c.col_code,
        first_name: c.first_name,
        last_name: c.last_name,
        jobId: c.jobId,
        curp: c.curp || "",
        imssNumber: c.imssNumber || "",
        rfcCode: c.rfcCode || "",
        position: c.position || "",
      },
    ])
  );

  // Read Excel file
  const workbook = XLSX.readFile(inputPath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<PayrollRow>(sheet);

  console.log(`📊 Read ${rows.length} rows from Excel file`);

  // Group by date and beneficiario
  const groupedPayrolls: Map<string, CollaboratorPayrollData> = new Map();

  for (const row of rows) {
    const collaborator = collaborators[row.Beneficiario];
    if (!collaborator) {
      console.warn("⚠️ Collaborator not found:", row.Beneficiario);
      continue;
    }

    const key = `${row.Date}_${row.Beneficiario}`;

    if (!groupedPayrolls.has(key)) {
      groupedPayrolls.set(key, {
        date: row.Date,
        collaboratorId: collaborator.id,
        collaboratorCode: collaborator.col_code,
        jobId: collaborator.jobId,
        concepts: new Map(),
        conceptDescriptions: new Map(),
      });
    }

    const payrollData = groupedPayrolls.get(key)!;
    const ingreso = (row.Ingreso || row[" Ingreso "] || 0) as any;
    const egreso = (row.Egreso || row[" Egreso "] || 0) as any;

    // For payroll entries, the amount is typically in the non-zero column
    // We'll determine the sign based on the concept code mapping
    const ingresoAmount = parseCurrency(ingreso);
    const egresoAmount = parseCurrency(egreso);
    const amount = Math.max(ingresoAmount, egresoAmount);

    // Store the raw amount (we'll handle signs in the mapping function)

    // Store concept description
    payrollData.conceptDescriptions.set(row.Código, row.Concepto);

    if (payrollData.concepts.has(row.Código)) {
      payrollData.concepts.set(
        row.Código,
        payrollData.concepts.get(row.Código)! + amount
      );
    } else {
      payrollData.concepts.set(row.Código, amount);
    }
  }

  // Convert to payroll entities
  const result: PayrollOutput[] = [];

  for (const [key, payrollData] of groupedPayrolls) {
    const collaborator = collaborators[payrollData.collaboratorCode];

    // Calculate period dates
    const { periodStartDate, periodEndDate } = calculatePeriodDates(
      payrollData.date
    );

    const payroll: PayrollOutput = {
      collaboratorId: payrollData.collaboratorId,
      jobId: payrollData.jobId,
      payrollStatus: PayrollStatus.Paid,
      periodStartDate,
      periodEndDate,
      generalData: {
        fullName: `${collaborator.first_name} ${collaborator.last_name}`,
        collaboratorCode: collaborator.col_code,
        curp: collaborator.curp,
        socialSecurityNumber: collaborator.imssNumber,
        rfcNumber: collaborator.rfcCode,
        jobTitle: collaborator.position,
        paymentType: HRPaymentType.SALARY,
        contributionBaseSalary: 0,
      },
      earnings: {
        halfWeekFixedIncome: 0,
        commissions: 0,
        vacationCompensation: 0,
        expressBranchCompensation: 0,
        mealCompensation: 0,
        receptionBonus: 0,
        punctualityBonus: 0,
        absencesJustifiedByCompanyCompensation: 0,
        specialBonuses: [],
        guaranteedPerceptionCompensation: 0,
        simpleOvertimeHours: 0,
        doubleOvertimeHours: 0,
        tripleOvertimeHours: 0,
        sundayBonus: 0,
        holidayOrRestExtraPay: 0,
        traniningActivitySupport: 0,
        physicalActivitySupport: 0,
        extraFixedCompensations: [],
        extraVariableCompensations: [],
        vacationBonus: 0,
        endYearBonus: 0,
        profitSharing: 0,
        employmentSubsidy: 0,
      },
      deductions: {
        incomeTaxWithholding: 0,
        socialSecurityWithholding: 0,
        otherFixedDeductions: [],
        otherVariableDeductions: [],
        nonCountedDaysDiscount: 0,
        justifiedAbsencesDiscount: 0,
        unjustifiedAbsencesDiscount: 0,
        unworkedHoursDiscount: 0,
        tardinessDiscount: 0,
      },
      totals: {
        totalIncome: 0,
        totalDeductions: 0,
        netPay: 0,
      },
      contextData: {
        periodDaysLength: 15,
        halfWeekFixedIncome: 0,
        averageOrdinaryIncomeDaily: 0,
        attendanceRelatedDiscounts: 0,
        attendanceFactor: 1,
        employerImssRate: 0,
        workedHours: 0,
      },
    };

    // Map concepts to payroll fields
    mapConceptsToPayroll(
      payroll,
      payrollData.concepts,
      payrollData.conceptDescriptions
    );

    // Calculate totals
    calculateTotals(payroll);

    result.push(payroll);
  }

  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), "utf-8");
  console.log("✅ Payroll JSON saved to", outputPath);
  console.log(`📊 Generated ${result.length} payroll records`);
  console.log(
    `👥 Processed ${
      new Set(result.map((p) => p.collaboratorId)).size
    } unique collaborators`
  );
};

const parseCurrency = (value: any): number => {
  if (!value || value === "-") return 0;
  const stringValue = String(value);
  return parseFloat(stringValue.replace(/[^0-9.-]+/g, "")) || 0;
};

const parseDate = (dateValue: any): dayjs.Dayjs => {
  // Handle different date formats
  if (typeof dateValue === "number") {
    // Excel serial date
    const excelEpoch = new Date(1899, 11, 30);
    const jsDate = new Date(excelEpoch.getTime() + dateValue * 86400000);
    return dayjs.tz(jsDate, "America/Mexico_City");
  }

  if (typeof dateValue === "string") {
    // Parse dates like "15-ene-24"
    const months: Record<string, string> = {
      ene: "01",
      feb: "02",
      mar: "03",
      abr: "04",
      may: "05",
      jun: "06",
      jul: "07",
      ago: "08",
      sep: "09",
      oct: "10",
      nov: "11",
      dic: "12",
    };

    const [day, monthAbbr, year] = dateValue.split("-");
    const fullYear = `20${year}`;
    const month = months[monthAbbr];

    return dayjs.tz(
      `${fullYear}-${month}-${day.padStart(2, "0")}`,
      "America/Mexico_City"
    );
  }

  // Fallback: try to parse as a date
  return dayjs.tz(dateValue, "America/Mexico_City");
};

const calculatePeriodDates = (
  dateValue: any
): { periodStartDate: string; periodEndDate: string } => {
  const date = parseDate(dateValue);
  const day = date.date();

  let periodStart: dayjs.Dayjs;
  let periodEnd: dayjs.Dayjs;

  if (day <= 15) {
    // First half of month: 1st to 15th
    periodStart = date.startOf("month").startOf("day");
    periodEnd = date.date(15).endOf("day");
  } else {
    // Second half of month: 16th to end of month
    periodStart = date.date(16).startOf("day");
    periodEnd = date.endOf("month").endOf("day");
  }

  return {
    periodStartDate: periodStart.toISOString(),
    periodEndDate: periodEnd.toISOString(),
  };
};

const mapConceptsToPayroll = (
  payroll: PayrollOutput,
  concepts: Map<number, number>,
  conceptDescriptions?: Map<number, string>
) => {
  for (const [code, amount] of concepts) {
    // Ensure all amounts are positive for proper calculation
    const positiveAmount = Math.abs(amount);

    switch (code) {
      case 2111:
      case 2174:
        payroll.earnings.halfWeekFixedIncome += positiveAmount;
        break;
      case 2132:
        payroll.earnings.vacationBonus += positiveAmount;
        break;
      case 2133:
        payroll.earnings.doubleOvertimeHours += positiveAmount;
        break;
      case 2134:
        payroll.earnings.sundayBonus += positiveAmount;
        break;
      case 2136:
        payroll.earnings.holidayOrRestExtraPay += positiveAmount;
        break;
      case 2137:
        payroll.earnings.endYearBonus += positiveAmount;
        break;
      case 2141:
        payroll.deductions.socialSecurityWithholding += positiveAmount;
        break;
      case 2144:
        payroll.deductions.otherFixedDeductions.push({
          name: "Retención crédito Infonavit",
          description: "Retención crédito Infonavit",
          amount: positiveAmount,
        });
        break;
      case 2155:
        payroll.earnings.traniningActivitySupport += positiveAmount;
        break;
      case 2171:
        payroll.earnings.commissions += positiveAmount;
        break;
      case 2172:
        // Handle 2172 variations based on concept description
        const description = conceptDescriptions?.get(code) || "";
        if (description.includes("Montejo")) {
          payroll.earnings.expressBranchCompensation += positiveAmount;
        } else if (description.includes("alimentos")) {
          payroll.earnings.mealCompensation += positiveAmount;
        } else if (description.includes("vacaciones")) {
          payroll.earnings.vacationCompensation += positiveAmount;
        } else if (description.includes("faltas")) {
          payroll.earnings.absencesJustifiedByCompanyCompensation +=
            positiveAmount;
        } else if (description.includes("ingreso mínimo")) {
          payroll.earnings.guaranteedPerceptionCompensation += positiveAmount;
        } else {
          payroll.earnings.extraVariableCompensations.push({
            name: "Compensación extra",
            description: description || "Compensación extra",
            amount: positiveAmount,
          });
        }
        break;
      case 2173:
        payroll.earnings.punctualityBonus += positiveAmount;
        break;
      case 2812:
        payroll.deductions.incomeTaxWithholding += positiveAmount;
        break;
      case 2813:
        payroll.earnings.employmentSubsidy += positiveAmount;
        break;
      default:
        console.warn(`⚠️ Unknown concept code: ${code} with amount: ${amount}`);
        break;
    }
  }
};

const calculateTotals = (payroll: PayrollOutput) => {
  // Calculate total earnings
  const earnings = payroll.earnings;
  payroll.totals.totalIncome =
    earnings.halfWeekFixedIncome +
    earnings.commissions +
    earnings.vacationCompensation +
    earnings.expressBranchCompensation +
    earnings.mealCompensation +
    earnings.receptionBonus +
    earnings.punctualityBonus +
    earnings.absencesJustifiedByCompanyCompensation +
    earnings.guaranteedPerceptionCompensation +
    earnings.simpleOvertimeHours +
    earnings.doubleOvertimeHours +
    earnings.tripleOvertimeHours +
    earnings.sundayBonus +
    earnings.holidayOrRestExtraPay +
    earnings.traniningActivitySupport +
    earnings.physicalActivitySupport +
    earnings.vacationBonus +
    earnings.endYearBonus +
    earnings.profitSharing +
    earnings.employmentSubsidy +
    earnings.specialBonuses.reduce((sum, bonus) => sum + bonus.amount, 0) +
    earnings.extraFixedCompensations.reduce(
      (sum, comp) => sum + comp.amount,
      0
    ) +
    earnings.extraVariableCompensations.reduce(
      (sum, comp) => sum + comp.amount,
      0
    );

  // Calculate total deductions
  const deductions = payroll.deductions;
  payroll.totals.totalDeductions =
    deductions.incomeTaxWithholding +
    deductions.socialSecurityWithholding +
    deductions.nonCountedDaysDiscount +
    deductions.justifiedAbsencesDiscount +
    deductions.unjustifiedAbsencesDiscount +
    deductions.unworkedHoursDiscount +
    deductions.tardinessDiscount +
    deductions.otherFixedDeductions.reduce(
      (sum, deduction) => sum + deduction.amount,
      0
    ) +
    deductions.otherVariableDeductions.reduce(
      (sum, deduction) => sum + deduction.amount,
      0
    );

  // Calculate net pay
  payroll.totals.netPay =
    payroll.totals.totalIncome - payroll.totals.totalDeductions;

  // Update context data
  payroll.contextData.halfWeekFixedIncome = earnings.halfWeekFixedIncome;
  payroll.contextData.averageOrdinaryIncomeDaily =
    earnings.halfWeekFixedIncome / 15;
};

transformExcelToJson();
