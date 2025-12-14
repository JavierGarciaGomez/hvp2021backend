import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  convertUtcDateToMexicoTimeStartOfDay,
  getMxDayjsDatetimeByDateAndTime,
  getMxPeriodKey,
  getMxStartOfYear,
  getMxEndOfYear,
  toMxStartOfDay,
  isMxDateAfter,
  toMexicoStartOfDay,
  transformMxDateTimeToEsStartOfDay,
  transformMxDateTimeToUtcStartOfDay,
  calculateMxDaysBetween,
} from "./dateHelpers";

dayjs.extend(utc);
dayjs.extend(timezone);
describe("dateHelpers", () => {
  describe("transformMxDateTimeToUtcStartOfDay", () => {
    it("should transform mx date time to utc start of day", () => {
      const date = dayjs("2025-01-01T06:00:00.000Z");
      const result = transformMxDateTimeToUtcStartOfDay(date);
      expect(result.toISOString()).toEqual("2025-01-01T00:00:00.000Z");
    });
  });

  describe("transformMxDateTimeToEsStartOfDay", () => {
    it("should transform mx date time to es start of day", () => {
      const date = dayjs("2025-01-01T06:00:00.000Z");
      const result = transformMxDateTimeToEsStartOfDay(date);
      expect(result.toISOString()).toEqual("2024-12-31T23:00:00.000Z");
    });
  });

  describe("toMexicoStartOfDay", () => {
    it("should keep the same date", () => {
      const date = dayjs("2025-01-01T06:00:00.000Z");
      const result = toMexicoStartOfDay(date.toISOString());
      const resultIso = result.toISOString();
      expect(result.toISOString()).toEqual("2025-01-01T06:00:00.000Z");
    });

    it("should transform mx date time to es start of day", () => {
      const date = dayjs("2025-01-13T00:00:00.000Z");

      const result = toMexicoStartOfDay(date.toISOString());

      expect(result.toISOString()).toEqual("2025-01-13T06:00:00.000Z");
    });
  });

  describe("getMxDayjsDatetimeByDateAndTime", () => {
    it("should transform to mx date time", () => {
      const date = "2025-04-05";
      const time = "08:00";
      const result = getMxDayjsDatetimeByDateAndTime(date, time);

      const date2 = "2025-04-06";
      const time2 = "08:00";
      const result2 = getMxDayjsDatetimeByDateAndTime(date2, time2);

      expect(result.toISOString()).toEqual("2025-04-05T14:00:00.000Z");
      expect(result2.toISOString()).toEqual("2025-04-06T14:00:00.000Z");
    });
  });

  describe("convertUtcDateToMexicoTimeStartOfDay", () => {
    it("should convert utc date to mx time start of day", () => {
      const date = "2025-04-16";
      const result = convertUtcDateToMexicoTimeStartOfDay(date);
      expect(result.toISOString()).toEqual("2025-04-16T06:00:00.000Z");
    });
  });

  describe("getMxPeriodKey", () => {
    it("should return the correct period key for half-month", () => {
      const date1 = dayjs("2025-04-16T05:00:00.000Z");
      const result1 = getMxPeriodKey(date1, "half-month");
      expect(result1).toEqual("2025-Apr-H1");

      const date2 = dayjs("2025-04-16T06:00:00.000Z");
      const result2 = getMxPeriodKey(date2, "half-month");
      expect(result2).toEqual("2025-Apr-H2");

      const date3 = dayjs("2025-04-01T05:00:00.000Z");
      const result3 = getMxPeriodKey(date3, "half-month");
      expect(result3).toEqual("2025-Mar-H2");

      const date4 = dayjs("2025-04-01T06:00:00.000Z");
      const result4 = getMxPeriodKey(date4, "half-month");
      expect(result4).toEqual("2025-Apr-H1");
    });
  });

  describe("getMxStartOfYear", () => {
    it("should return Jan 1st 00:00:00 in Mexico timezone", () => {
      const result = getMxStartOfYear(2025);
      // Mexico is UTC-6 in winter, so Jan 1 00:00 MX = Jan 1 06:00 UTC
      expect(result.toISOString()).toEqual("2025-01-01T06:00:00.000Z");
    });

    it("should work for different years", () => {
      const result2024 = getMxStartOfYear(2024);
      expect(result2024.toISOString()).toEqual("2024-01-01T06:00:00.000Z");

      const result2023 = getMxStartOfYear(2023);
      expect(result2023.toISOString()).toEqual("2023-01-01T06:00:00.000Z");
    });
  });

  describe("getMxEndOfYear", () => {
    it("should return Dec 31st 23:59:59 in Mexico timezone", () => {
      const result = getMxEndOfYear(2025);
      // Mexico is UTC-6 in winter, so Dec 31 23:59:59 MX = Jan 1 05:59:59 UTC
      expect(result.toISOString()).toEqual("2026-01-01T05:59:59.999Z");
    });

    it("should work for different years", () => {
      const result2024 = getMxEndOfYear(2024);
      expect(result2024.toISOString()).toEqual("2025-01-01T05:59:59.999Z");
    });
  });

  describe("toMxStartOfDay", () => {
    it("should convert UTC date to Mexico start of day", () => {
      // UTC midnight = previous day 6pm in Mexico
      const utcDate = new Date("2025-01-15T00:00:00.000Z");
      const result = toMxStartOfDay(utcDate);
      // Jan 14 18:00 MX -> start of day Jan 14 -> Jan 14 06:00 UTC
      expect(result.toISOString()).toEqual("2025-01-14T06:00:00.000Z");
    });

    it("should handle date already at Mexico start of day", () => {
      // This is already Mexico start of day (Jan 15 00:00 MX = Jan 15 06:00 UTC)
      const mxStartOfDay = new Date("2025-01-15T06:00:00.000Z");
      const result = toMxStartOfDay(mxStartOfDay);
      expect(result.toISOString()).toEqual("2025-01-15T06:00:00.000Z");
    });

    it("should handle string input", () => {
      const result = toMxStartOfDay("2025-06-15T12:30:00.000Z");
      // June 15 06:30 MX -> start of day June 15 -> June 15 06:00 UTC (Mexico no longer has DST since 2022)
      expect(result.toISOString()).toEqual("2025-06-15T06:00:00.000Z");
    });

    it("should handle Dayjs input", () => {
      const dayjsDate = dayjs("2025-01-15T12:00:00.000Z");
      const result = toMxStartOfDay(dayjsDate);
      expect(result.toISOString()).toEqual("2025-01-15T06:00:00.000Z");
    });

    it("should handle date already in Mexico timezone (Dayjs with tz)", () => {
      // Create a date that's explicitly in Mexico timezone
      const mxDate = dayjs.tz("2025-01-15T08:30:00", "America/Mexico_City");
      const result = toMxStartOfDay(mxDate);
      // Should still return Jan 15 start of day in Mexico
      expect(result.toISOString()).toEqual("2025-01-15T06:00:00.000Z");
    });
  });

  describe("isMxDateAfter", () => {
    it("should return true when dateA is after dateB", () => {
      const dateA = new Date("2025-01-15T06:00:00.000Z"); // Jan 15 MX
      const dateB = new Date("2025-01-14T06:00:00.000Z"); // Jan 14 MX
      expect(isMxDateAfter(dateA, dateB)).toBe(true);
    });

    it("should return false when dateA is before dateB", () => {
      const dateA = new Date("2025-01-14T06:00:00.000Z"); // Jan 14 MX
      const dateB = new Date("2025-01-15T06:00:00.000Z"); // Jan 15 MX
      expect(isMxDateAfter(dateA, dateB)).toBe(false);
    });

    it("should return false when dates are the same day", () => {
      const dateA = new Date("2025-01-15T10:00:00.000Z"); // Jan 15 04:00 MX
      const dateB = new Date("2025-01-15T20:00:00.000Z"); // Jan 15 14:00 MX
      // Both are Jan 15 in Mexico, so A is not after B
      expect(isMxDateAfter(dateA, dateB)).toBe(false);
    });

    it("should handle timezone edge cases correctly", () => {
      // Jan 1 05:00 UTC = Dec 31 23:00 MX (previous day!)
      const dateA = new Date("2025-01-01T05:00:00.000Z");
      // Jan 1 06:00 UTC = Jan 1 00:00 MX
      const dateB = new Date("2025-01-01T06:00:00.000Z");
      // Dec 31 MX is NOT after Jan 1 MX
      expect(isMxDateAfter(dateA, dateB)).toBe(false);
    });

    it("should handle string inputs", () => {
      expect(isMxDateAfter("2025-06-15", "2025-06-14")).toBe(true);
      expect(isMxDateAfter("2025-06-14", "2025-06-15")).toBe(false);
    });

    it("should handle Dayjs inputs", () => {
      const dateA = dayjs("2025-01-15T12:00:00.000Z");
      const dateB = dayjs("2025-01-14T12:00:00.000Z");
      expect(isMxDateAfter(dateA, dateB)).toBe(true);
    });
  });

  describe("calculateMxDaysBetween", () => {
    it("should return 15 for Jan 1-15 (inclusive)", () => {
      // Use Mexico timezone dates (06:00 UTC = 00:00 Mexico)
      const start = new Date("2025-01-01T06:00:00.000Z");
      const end = new Date("2025-01-15T06:00:00.000Z");
      expect(calculateMxDaysBetween(start, end)).toBe(15);
    });

    it("should return 1 for same day", () => {
      const date = new Date("2025-01-15T06:00:00.000Z");
      expect(calculateMxDaysBetween(date, date)).toBe(1);
    });

    it("should handle string inputs", () => {
      expect(calculateMxDaysBetween("2025-01-01", "2025-01-31")).toBe(31);
    });

    it("should handle Dayjs inputs", () => {
      const start = dayjs.tz("2025-05-05", "America/Mexico_City");
      const end = dayjs.tz("2025-11-30", "America/Mexico_City");
      // May 5 to Nov 30 = 210 days
      expect(calculateMxDaysBetween(start, end)).toBe(210);
    });

    it("should handle UTC midnight correctly (converts to Mexico timezone)", () => {
      // UTC midnight Jan 15 = Jan 14 6pm Mexico
      const start = new Date("2025-01-01T00:00:00.000Z"); // Dec 31 in Mexico
      const end = new Date("2025-01-15T00:00:00.000Z"); // Jan 14 in Mexico
      // Dec 31 to Jan 14 = 15 days
      expect(calculateMxDaysBetween(start, end)).toBe(15);
    });

    it("should calculate full year correctly", () => {
      const start = new Date("2025-01-01T06:00:00.000Z");
      const end = new Date("2025-12-31T06:00:00.000Z");
      expect(calculateMxDaysBetween(start, end)).toBe(365);
    });
  });
});
