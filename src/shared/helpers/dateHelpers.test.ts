import dayjs from "dayjs";
import {
  toMexicoStartOfDay,
  transformMxDateTimeToEsStartOfDay,
  transformMxDateTimeToUtcStartOfDay,
} from "./dateHelpers";
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
    it("should transform mx date time to es start of day", () => {
      const date = dayjs("2025-01-01T06:00:00.000Z");
      const result = toMexicoStartOfDay(date.toISOString());
      const resultIso = result.toISOString();
      expect(result.toISOString()).toEqual("2025-01-01T06:00:00.000Z");
    });

    it.only("should transform mx date time to es start of day", () => {
      const date = dayjs("2025-01-13T00:00:00.000Z");

      const result = toMexicoStartOfDay(date.toISOString());

      expect(result.toISOString()).toEqual("2025-01-13T06:00:00.000Z");
    });
  });
});
