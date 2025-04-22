import dayjs from "dayjs";
import {
  convertUtcDateToMexicoTimeStartOfDay,
  getMxDayjsDatetimeByDateAndTime,
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
});
