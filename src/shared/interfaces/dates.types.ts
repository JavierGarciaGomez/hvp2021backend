export interface PeriodData {
  period: "half-month" | "month" | "quarter" | "year";
  periods: number;
  periodStartDate: Date;
  periodEndDate: Date;
  extendedStartDate: Date;
  extendedEndDate: Date;
}
