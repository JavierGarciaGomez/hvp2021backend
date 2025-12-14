import { getCommissionsStatsPeriodsByPeriodAndDates } from "./commissions.helpers";

describe("commissions.helpers", () => {
  describe("getCommissionsStatsPeriodsByPeriodAndDates", () => {
    it("should return the correct periods when using half-month period", () => {
      const result = getCommissionsStatsPeriodsByPeriodAndDates(
        "half-month",
        new Date("2025-01-01T06:00:00.000Z"),
        new Date("2025-01-16T05:59:59.999Z")
      );

      expect(result.periods).toBe(13);
      expect(result.periodStartDate).toStrictEqual(
        new Date("2025-01-01T06:00:00.000Z")
      );
      expect(result.periodEndDate).toStrictEqual(
        new Date("2025-01-16T05:59:59.999Z")
      );
      expect(result.extendedStartDate).toStrictEqual(
        new Date("2024-07-01T06:00:00.000Z")
      );
      expect(result.extendedEndDate).toStrictEqual(
        new Date("2025-01-16T05:59:59.999Z")
      );
    });

    it("should return the correct periods when using month period", () => {
      const result = getCommissionsStatsPeriodsByPeriodAndDates(
        "month",
        new Date("2025-01-01T06:00:00.000Z"),
        new Date("2025-01-31T05:59:59.999Z")
      );

      expect(result.periods).toBe(13);
      expect(result.periodStartDate).toStrictEqual(
        new Date("2025-01-01T06:00:00.000Z")
      );
      expect(result.periodEndDate).toStrictEqual(
        new Date("2025-01-31T05:59:59.999Z")
      );
    });

    it("should return the correct periods when using quarter period", () => {
      const result = getCommissionsStatsPeriodsByPeriodAndDates(
        "quarter",
        new Date("2025-01-01T06:00:00.000Z"),
        new Date("2025-03-31T05:59:59.999Z")
      );

      expect(result.periods).toBe(9);
      expect(result.periodStartDate).toStrictEqual(
        new Date("2025-01-01T06:00:00.000Z")
      );
      expect(result.periodEndDate).toStrictEqual(
        new Date("2025-03-31T05:59:59.999Z")
      );
      expect(result.extendedStartDate).toStrictEqual(
        new Date("2023-01-01T06:00:00.000Z")
      );
      expect(result.extendedEndDate).toStrictEqual(
        new Date("2025-03-31T05:59:59.999Z")
      );
    });

    it("should return the correct periods when using year period", () => {
      const result = getCommissionsStatsPeriodsByPeriodAndDates(
        "year",
        new Date("2025-01-01T06:00:00.000Z"),
        new Date("2025-12-31T05:59:59.999Z")
      );

      expect(result.periods).toBe(4);
      expect(result.periodStartDate).toStrictEqual(
        new Date("2025-01-01T06:00:00.000Z")
      );
      expect(result.periodEndDate).toStrictEqual(
        new Date("2025-12-31T05:59:59.999Z")
      );
      expect(result.extendedStartDate).toStrictEqual(
        new Date("2022-01-01T06:00:00.000Z")
      );
      expect(result.extendedEndDate).toStrictEqual(
        new Date("2025-12-31T05:59:59.999Z")
      );
    });
  });
});
