import dayjs from "dayjs";

import timeOffRequestsFixture from "../../pending/tests/fixtures/timeOffRequestsFixtures";

import {
  calculateTotalVacationDays,
  calculateVacationDaysBefore2023,
  calculateVacationDaysForYearBefore2023,
  calculateVacationsAfter2022,
  calculateVacationsForFullYearsAfter2022,
  calculateVacationsForFullYearsBefore2023,
  calculateVacationsForYearAfter2022,
  calculateYears,
  getApprovedVacations,
  getLastAnniversaryDate,
  getNotRejectedTimeOffsByType,
  getPendingVacations,
} from "./timeOffHelpers";
import { TimeOffRequest, TimeOffStatus, TimeOffType } from "../interfaces";
import { TimeOffRequestEntity } from "../../domain";

describe("timeOffHelpers", () => {
  describe("getApprovedVacations", () => {
    test("returns an array of dates for approved vacation requests", () => {
      // Replace with your actual data for testing
      const timeOffRequests =
        timeOffRequestsFixture as unknown as TimeOffRequestEntity[];

      const result = getApprovedVacations(timeOffRequests);
      expect(result.length).toEqual(24);
    });
    test("returns an empty array for not approved vacation requests", () => {
      // Replace with your actual data for testing
      const timeOffRequests = [] as TimeOffRequestEntity[];

      const result = getApprovedVacations(timeOffRequests);
      expect(result.length).toEqual(0);
    });
  });

  describe("getPendingVacations", () => {
    test("returns an array of dates for pending vacation requests", () => {
      // Replace with your actual data for testing
      const pendingVacationRequests =
        timeOffRequestsFixture as unknown as TimeOffRequestEntity[];
      const expectedPendingVacationDates: Date[] = [
        new Date("2023-10-01"),
        new Date("2023-10-02"),
      ];

      const result = getPendingVacations(pendingVacationRequests);
      expect(result).toEqual(expectedPendingVacationDates);
    });
    test("returns an empty array for no pending vacation requests", () => {
      const timeOffRequests = [
        {
          timeOffType: TimeOffType.Vacation,
          status: TimeOffStatus.Approved,
          requestedDays: [new Date("2023-01-01")],
        },
        {
          timeOffType: TimeOffType.dayLeave,
          status: TimeOffStatus.Rejected,
          requestedDays: [new Date("2023-02-01")],
        },
      ] as unknown as TimeOffRequestEntity[];
      // Replace with your actual data for testing

      expect(getPendingVacations(timeOffRequests)).toEqual([]);
    });
  });

  describe("calculateTotalVacationDays", () => {
    test("returns 0 if employment start date is after end date", () => {
      const employmentStartDate = new Date("2023-01-01");
      const endDate = new Date("2022-12-31");
      expect(calculateTotalVacationDays(employmentStartDate, endDate)).toBe(0);
    });

    test("returns 0 if employment start date is on end date", () => {
      const employmentStartDate = new Date("2022-12-31");
      const endDate = new Date("2022-12-31");
      expect(calculateTotalVacationDays(employmentStartDate, endDate)).toBe(0);
    });

    // BEFORE 2023
    test("returns correct total vacation days for employees that left before 2023. Less than a year", () => {
      const employmentStartDate = new Date("2016-12-01");
      const endDate = new Date("2017-06-01");

      const expectedTotalVacationDays = 3;
      expect(calculateTotalVacationDays(employmentStartDate, endDate)).toBe(
        expectedTotalVacationDays
      );
    });

    test("returns correct total vacation days for employees that left before 2023. Almost a year", () => {
      const employmentStartDate = new Date("2016-12-01");
      const endDate = new Date("2017-11-28");
      const expectedTotalVacationDays = 5;
      expect(calculateTotalVacationDays(employmentStartDate, endDate)).toBe(
        expectedTotalVacationDays
      );
    });

    test("returns correct total vacation days for employees that left before 2023. Exactly a year", () => {
      const employmentStartDate = new Date("2016-12-01");
      const endDate = new Date("2017-12-01");

      const expectedTotalVacationDays = 6;
      expect(calculateTotalVacationDays(employmentStartDate, endDate)).toBe(
        expectedTotalVacationDays
      );
    });

    test("returns correct total vacation days for employees that left before 2023. Year and a half", () => {
      const employmentStartDate = new Date("2016-12-01");
      const endDate = new Date("2018-06-01");

      const expectedTotalVacationDays = 10;
      expect(calculateTotalVacationDays(employmentStartDate, endDate)).toBe(
        expectedTotalVacationDays
      );
    });

    test("returns correct total vacation days for employees that left before 2023. 2 years", () => {
      const employmentStartDate = new Date("2016-12-01");
      const endDate = new Date("2018-12-01");

      const expectedTotalVacationDays = 14;
      expect(calculateTotalVacationDays(employmentStartDate, endDate)).toBe(
        expectedTotalVacationDays
      );
    });

    test("returns correct total vacation days for employees that left before 2023. 2.5 years", () => {
      const employmentStartDate = new Date("2016-12-01");
      const endDate = new Date("2019-06-01");

      const expectedTotalVacationDays = 19;
      expect(calculateTotalVacationDays(employmentStartDate, endDate)).toBe(
        expectedTotalVacationDays
      );
    });
    test("returns correct total vacation days for employees that left before 2023. 3 years", () => {
      const employmentStartDate = new Date("2016-12-01");
      const endDate = new Date("2019-12-01");

      const expectedTotalVacationDays = 24;
      expect(calculateTotalVacationDays(employmentStartDate, endDate)).toBe(
        expectedTotalVacationDays
      );
    });

    test("returns correct total vacation days for employees that left before 2023. 5.5 years", () => {
      const employmentStartDate = new Date("2016-12-01");
      const endDate = new Date("2022-06-01");

      const expectedTotalVacationDays = 57;
      expect(calculateTotalVacationDays(employmentStartDate, endDate)).toBe(
        expectedTotalVacationDays
      );
    });

    // AFTER 2023
    test("returns correct total vacation days for employees that joined after 2022. Less than a year", () => {
      const employmentStartDate = new Date("2023-06-01");
      const endDate = new Date("2023-12-01");

      const expectedTotalVacationDays = 6;
      expect(calculateTotalVacationDays(employmentStartDate, endDate)).toBe(
        expectedTotalVacationDays
      );
    });

    test("returns correct total vacation days for employees that joined after 2022. Almost a year", () => {
      const employmentStartDate = new Date("2023-06-01");
      const endDate = new Date("2024-05-28");
      const expectedTotalVacationDays = 11;
      expect(calculateTotalVacationDays(employmentStartDate, endDate)).toBe(
        expectedTotalVacationDays
      );
    });

    test("returns correct total vacation days for employees that joined after 2022. Exactly a year", () => {
      const employmentStartDate = new Date("2023-06-01");
      const endDate = new Date("2024-06-01");

      const expectedTotalVacationDays = 12;
      expect(calculateTotalVacationDays(employmentStartDate, endDate)).toBe(
        expectedTotalVacationDays
      );
    });

    test("returns correct total vacation days for employees that joined after 2022. Year and a half", () => {
      const employmentStartDate = new Date("2023-06-01");
      const endDate = new Date("2024-12-01");

      const expectedTotalVacationDays = 19;
      expect(calculateTotalVacationDays(employmentStartDate, endDate)).toBe(
        expectedTotalVacationDays
      );
    });

    test("returns correct total vacation days for employees that joined after 2022. 2 years", () => {
      const employmentStartDate = new Date("2023-06-01");
      const endDate = new Date("2025-06-01");

      const expectedTotalVacationDays = 26;
      expect(calculateTotalVacationDays(employmentStartDate, endDate)).toBe(
        expectedTotalVacationDays
      );
    });

    test("returns correct total vacation days for employees that joined after 2022. 2.5 years", () => {
      const employmentStartDate = new Date("2023-06-01");
      const endDate = new Date("2025-12-01");

      const expectedTotalVacationDays = 34;
      expect(calculateTotalVacationDays(employmentStartDate, endDate)).toBe(
        expectedTotalVacationDays
      );
    });

    test("returns correct total vacation days for employees that joined after 2022. 3 years", () => {
      const employmentStartDate = new Date("2023-06-01");
      const endDate = new Date("2026-06-01");

      const expectedTotalVacationDays = 42;
      expect(calculateTotalVacationDays(employmentStartDate, endDate)).toBe(
        expectedTotalVacationDays
      );
    });

    test("returns correct total vacation days for employees that joined after 2022. 5.5 years", () => {
      const employmentStartDate = new Date("2023-06-01");
      const endDate = new Date("2028-12-01");

      const expectedTotalVacationDays = 91;
      expect(calculateTotalVacationDays(employmentStartDate, endDate)).toBe(
        expectedTotalVacationDays
      );
    });

    // PERSONAL USE CASES

    test("returns correct total vacation days for RGL", () => {
      const employmentStartDate = new Date("2016-12-01");
      const endDate = new Date("2024-03-19");

      const expectedTotalVacationDays = 92;
      expect(calculateTotalVacationDays(employmentStartDate, endDate)).toBe(
        expectedTotalVacationDays
      );
    });

    test("returns correct total vacation days for ADG", () => {
      const employmentStartDate = new Date("2016-12-16");
      const endDate = new Date("2024-03-19");

      const expectedTotalVacationDays = 91;
      expect(calculateTotalVacationDays(employmentStartDate, endDate)).toBe(
        expectedTotalVacationDays
      );
    });

    test("returns correct total vacation days for SCP", () => {
      const employmentStartDate = new Date("2017-10-03");
      const endDate = new Date("2024-03-19");

      const expectedTotalVacationDays = 82;
      expect(calculateTotalVacationDays(employmentStartDate, endDate)).toBe(
        expectedTotalVacationDays
      );
    });

    test("returns correct total vacation days for MAT", () => {
      const employmentStartDate = new Date("2018-08-15");
      const endDate = new Date("2024-03-19");

      const expectedTotalVacationDays = 69;
      expect(calculateTotalVacationDays(employmentStartDate, endDate)).toBe(
        expectedTotalVacationDays
      );
    });

    test("returns correct total vacation days for AAA", () => {
      const employmentStartDate = new Date("2019-07-01");
      const endDate = new Date("2024-03-19");

      const expectedTotalVacationDays = 56;
      expect(calculateTotalVacationDays(employmentStartDate, endDate)).toBe(
        expectedTotalVacationDays
      );
    });

    test("returns correct total vacation days for JLP", () => {
      const employmentStartDate = new Date("2020-01-24");
      const endDate = new Date("2024-03-19");

      const expectedTotalVacationDays = 51;
      expect(calculateTotalVacationDays(employmentStartDate, endDate)).toBe(
        expectedTotalVacationDays
      );
    });

    test("returns correct total vacation days for PCS", () => {
      const employmentStartDate = new Date("2021-07-19");
      const endDate = new Date("2024-03-19");

      const expectedTotalVacationDays = 30;
      expect(calculateTotalVacationDays(employmentStartDate, endDate)).toBe(
        expectedTotalVacationDays
      );
    });

    test("returns correct total vacation days for ACP", () => {
      const employmentStartDate = new Date("2021-10-21");
      const endDate = new Date("2024-03-19");

      const expectedTotalVacationDays = 26;
      expect(calculateTotalVacationDays(employmentStartDate, endDate)).toBe(
        expectedTotalVacationDays
      );
    });

    test("returns correct total vacation days for LCM", () => {
      const employmentStartDate = new Date("2022-12-13");
      const endDate = new Date("2024-03-19");

      const expectedTotalVacationDays = 15;
      expect(calculateTotalVacationDays(employmentStartDate, endDate)).toBe(
        expectedTotalVacationDays
      );
    });

    test("returns correct total vacation days for AAT", () => {
      const employmentStartDate = new Date("2023-01-16");
      const endDate = new Date("2024-03-19");

      const expectedTotalVacationDays = 14;
      expect(calculateTotalVacationDays(employmentStartDate, endDate)).toBe(
        expectedTotalVacationDays
      );
    });

    test("returns correct total vacation days for FVC", () => {
      const employmentStartDate = new Date("2023-03-14");
      const endDate = new Date("2024-03-19");

      const expectedTotalVacationDays = 12;
      expect(calculateTotalVacationDays(employmentStartDate, endDate)).toBe(
        expectedTotalVacationDays
      );
    });

    test("returns correct total vacation days for FVC", () => {
      const employmentStartDate = new Date("2023-09-25");
      const endDate = new Date("2024-03-19");

      const expectedTotalVacationDays = 5;
      expect(calculateTotalVacationDays(employmentStartDate, endDate)).toBe(
        expectedTotalVacationDays
      );
    });
  });

  describe("calculateVacationDaysBefore2023", () => {
    test("returns 0 if employment start date is after 2022-12-31", () => {
      const employmentStartDate = new Date("2023-01-01");
      expect(calculateVacationDaysBefore2023(employmentStartDate)).toBe(0);
    });

    test("returns 0 if employment start date is on 2022-12-31", () => {
      const employmentStartDate = new Date("2022-12-31");
      expect(calculateVacationDaysBefore2023(employmentStartDate)).toBe(0);
    });

    test("returns correct vacation days for worked years before 2023", () => {
      // Replace with your actual values for testing
      const employmentStartDate = new Date("2018-01-01");

      const expectedVacationDays = 36; // Adjust based on your expected result
      expect(calculateVacationDaysBefore2023(employmentStartDate)).toBe(
        expectedVacationDays
      );
    });

    // Add more test cases as needed, including edge cases and invalid inputs
  });

  describe("calculateVacationsForFullYearsBefore2023", () => {
    test("returns correct total vacation days for full years before 2023 when input is 0", () => {
      const yearsWorkedBefore2023 = 0;

      const expectedTotalDays = 0; // Replace with your expected result
      expect(
        calculateVacationsForFullYearsBefore2023(yearsWorkedBefore2023)
      ).toBe(expectedTotalDays);
    });
    test("returns correct total vacation days for full years before 2023 when input is 2", () => {
      const yearsWorkedBefore2023 = 2;

      const expectedTotalDays = 14; // Replace with your expected result
      expect(
        calculateVacationsForFullYearsBefore2023(yearsWorkedBefore2023)
      ).toBe(expectedTotalDays);
    });
    test("returns correct total vacation days for full years before 2023 when input is -5", () => {
      const yearsWorkedBefore2023 = -5;

      const expectedTotalDays = 0; // Replace with your expected result
      expect(
        calculateVacationsForFullYearsBefore2023(yearsWorkedBefore2023)
      ).toBe(expectedTotalDays);
    });

    test("returns correct total vacation days for full years before 2023 when input is 5", () => {
      const yearsWorkedBefore2023 = 5;

      const expectedTotalDays = 50; // Replace with your expected result
      expect(
        calculateVacationsForFullYearsBefore2023(yearsWorkedBefore2023)
      ).toBe(expectedTotalDays);
    });
  });

  describe("calculateVacationDaysForYearBefore2023", () => {
    test("returns correct number of vacation days for various years of working", () => {
      // Replace with your actual values for testing
      expect(calculateVacationDaysForYearBefore2023(1)).toBe(6);
      expect(calculateVacationDaysForYearBefore2023(5)).toBe(14);
      expect(calculateVacationDaysForYearBefore2023(6)).toBe(14);
      expect(calculateVacationDaysForYearBefore2023(10)).toBe(16);
      expect(calculateVacationDaysForYearBefore2023(11)).toBe(16);
      expect(calculateVacationDaysForYearBefore2023(15)).toBe(18);
      expect(calculateVacationDaysForYearBefore2023(16)).toBe(18);
      expect(calculateVacationDaysForYearBefore2023(20)).toBe(20);
      expect(calculateVacationDaysForYearBefore2023(21)).toBe(20);
      expect(calculateVacationDaysForYearBefore2023(25)).toBe(22);
      expect(calculateVacationDaysForYearBefore2023(26)).toBe(22);
      // Add more test cases as needed
    });

    test("returns 0 for invalid input", () => {
      expect(calculateVacationDaysForYearBefore2023(0)).toBe(0);
      expect(calculateVacationDaysForYearBefore2023(-5)).toBe(0);
      expect(calculateVacationDaysForYearBefore2023(31)).toBe(0);
      // Add more test cases for invalid input
    });
  });

  describe("calculateVacationsAfter2022", () => {
    test("returns correct calculation when the worker has not worked before 2023", () => {
      const employmentStartDate = new Date("2023-01-01");
      const endDate = new Date("2023-12-31");

      const expectedTotalDays = 11; // Replace with your expected result
      expect(calculateVacationsAfter2022(employmentStartDate, endDate)).toBe(
        expectedTotalDays
      );
    });

    test("returns correct calculation when the worker has not worked after 2022", () => {
      const employmentStartDate = new Date("2021-01-01");
      const endDate = new Date("2022-12-31");

      const expectedTotalDays = 0; // Replace with your expected result
      expect(calculateVacationsAfter2022(employmentStartDate, endDate)).toBe(
        expectedTotalDays
      );
    });

    test("returns correct calculation when the worker has worked a lot of years", () => {
      const employmentStartDate = new Date("2018-01-01");
      const endDate = new Date("2023-12-31");

      const expectedTotalDays = 41; // Replace with your expected result
      expect(calculateVacationsAfter2022(employmentStartDate, endDate)).toBe(
        expectedTotalDays
      );
    });

    // Add more test cases as needed, including edge cases and invalid inputs
  });

  describe("calculateVacationsForFullYearsAfter2022", () => {
    test("returns correct calculation when the worker has not worked before 2023", () => {
      const yearsWorkedBefore2023 = 0;
      const yearsAfter2022 = 1;

      const expectedTotalDays = 12; // Replace with your expected result
      expect(
        calculateVacationsForFullYearsAfter2022(
          yearsWorkedBefore2023,
          yearsAfter2022
        )
      ).toBe(expectedTotalDays);
    });

    test("returns correct total vacation days for full years after 2022", () => {
      // Replace with your actual values for testing
      const yearsWorkedBefore2023 = 1;
      const yearsAfter2022 = 1;

      const expectedTotalDays = 14; // Replace with your expected result
      expect(
        calculateVacationsForFullYearsAfter2022(
          yearsWorkedBefore2023,
          yearsAfter2022
        )
      ).toBe(expectedTotalDays);
    });

    test("returns correct calculation when the worker has not worked after 2022", () => {
      const yearsWorkedBefore2023 = 2;
      const yearsAfter2022 = 0;

      const expectedTotalDays = 0; // Replace with your expected result
      expect(
        calculateVacationsForFullYearsAfter2022(
          yearsWorkedBefore2023,
          yearsAfter2022
        )
      ).toBe(expectedTotalDays);
    });

    test("returns correct calculation when it has worked a lot of years", () => {
      const yearsWorkedBefore2023 = 5;
      const yearsAfter2022 = 5;
      // it should start 6 with 22 days, 7 with 22 days, 8 with 22 days, 9 with 22 days and 10 with 22 days. 110 days total

      const expectedTotalDays = 110; // Replace with your expected result
      expect(
        calculateVacationsForFullYearsAfter2022(
          yearsWorkedBefore2023,
          yearsAfter2022
        )
      ).toBe(expectedTotalDays);
    });

    // Add more test cases as needed, including edge cases and invalid inputs
  });

  describe("calculateVacationsForYearAfter2022", () => {
    test("returns correct vacation days for various years of working", () => {
      expect(calculateVacationsForYearAfter2022(1)).toBe(12);
      expect(calculateVacationsForYearAfter2022(5)).toBe(20);
      expect(calculateVacationsForYearAfter2022(6)).toBe(22);
      expect(calculateVacationsForYearAfter2022(10)).toBe(22);
      expect(calculateVacationsForYearAfter2022(11)).toBe(24);
      expect(calculateVacationsForYearAfter2022(15)).toBe(24);
      expect(calculateVacationsForYearAfter2022(16)).toBe(26);
      expect(calculateVacationsForYearAfter2022(20)).toBe(26);
      expect(calculateVacationsForYearAfter2022(21)).toBe(28);
      expect(calculateVacationsForYearAfter2022(25)).toBe(28);
      expect(calculateVacationsForYearAfter2022(26)).toBe(30);
      expect(calculateVacationsForYearAfter2022(30)).toBe(30);
      // Add more test cases as needed
    });

    test("returns 0 for invalid input", () => {
      expect(calculateVacationsForYearAfter2022(0)).toBe(0);
      expect(calculateVacationsForYearAfter2022(-5)).toBe(0);
      expect(calculateVacationsForYearAfter2022(31)).toBe(0);
      // Add more test cases for invalid input
    });
  });

  describe("calculateYears", () => {
    test("returns correct number of years between two dates when endDate is not sent", () => {
      const startDate = new Date("2021-01-01");

      jest.useFakeTimers().setSystemTime(new Date("2023-12-31"));
      const expectedYears = 3;
      expect(calculateYears(startDate)).toBeCloseTo(expectedYears);

      // Restore the original Date object
      global.Date = Date;
    });

    test("returns correct number of years between two dates when endDate is sent", () => {
      const startDate = new Date("2021-01-01");
      const endDate = new Date("2023-01-01");
      const expectedYears = 2;
      expect(calculateYears(startDate, endDate)).toBe(expectedYears);
    });

    test("returns 0 when endDate is previos", () => {
      const startDate = new Date("2021-01-01");
      const endDate = new Date("2020-12-31");
      const expectedYears = 0;
      expect(calculateYears(startDate, endDate)).toBe(expectedYears);
    });

    test("returns correct number of years when start date and end date are at random days", () => {
      const startDate = new Date("2021-07-01");
      const endDate = new Date("2023-04-31");
      expect(calculateYears(startDate, endDate)).toBeLessThan(2);
      expect(calculateYears(startDate, endDate)).toBeGreaterThan(1.7);
    });
  });

  describe("getLastAnniversaryDate", () => {
    it("should return the last anniversary date", () => {
      const startDate = new Date("2018-01-10");

      jest.useFakeTimers().setSystemTime(new Date("2025-10-10"));

      const result = getLastAnniversaryDate(startDate).toISOString();
      const expected = "2025-01-10T00:00:00.000Z";

      expect(result).toEqual(expected);

      jest.useRealTimers();
    });
  });
});
