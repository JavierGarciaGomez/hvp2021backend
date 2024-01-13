"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const timeOffTypes_1 = require("../data/types/timeOffTypes");
const timeOffRequestsFixtures_1 = __importDefault(require("../tests/fixtures/timeOffRequestsFixtures"));
const timeOffHelpers_1 = require("./timeOffHelpers");
describe("timeOffHelpers", () => {
    describe("getNotRejectedVacations", () => {
        test("getNotRejectedTimeOffsByType returns correct filtered days", () => {
            const timeOffRequests = timeOffRequestsFixtures_1.default;
            const result = (0, timeOffHelpers_1.getNotRejectedTimeOffsByType)(timeOffRequests, timeOffTypes_1.TimeOffType.partialPermission);
            expect(result.length).toEqual(2);
        });
    });
    describe("getApprovedVacations", () => {
        test("returns an array of dates for approved vacation requests", () => {
            // Replace with your actual data for testing
            const timeOffRequests = timeOffRequestsFixtures_1.default;
            const result = (0, timeOffHelpers_1.getApprovedVacations)(timeOffRequests);
            expect(result.length).toEqual(24);
        });
        test("returns an empty array for not approved vacation requests", () => {
            // Replace with your actual data for testing
            const timeOffRequests = [];
            const result = (0, timeOffHelpers_1.getApprovedVacations)(timeOffRequests);
            expect(result.length).toEqual(0);
        });
    });
    describe("getPendingVacations", () => {
        test("returns an array of dates for pending vacation requests", () => {
            // Replace with your actual data for testing
            const pendingVacationRequests = timeOffRequestsFixtures_1.default;
            const expectedPendingVacationDates = [
                new Date("2023-10-01"),
                new Date("2023-10-02"),
            ];
            const result = (0, timeOffHelpers_1.getPendingVacations)(pendingVacationRequests);
            expect(result).toEqual(expectedPendingVacationDates);
        });
        test("returns an empty array for no pending vacation requests", () => {
            const timeOffRequests = [
                {
                    timeOffType: timeOffTypes_1.TimeOffType.vacation,
                    status: timeOffTypes_1.TimeOffStatus.approved,
                    requestedDays: [new Date("2023-01-01")],
                },
                {
                    timeOffType: timeOffTypes_1.TimeOffType.dayLeave,
                    status: timeOffTypes_1.TimeOffStatus.rejected,
                    requestedDays: [new Date("2023-02-01")],
                },
            ];
            // Replace with your actual data for testing
            expect((0, timeOffHelpers_1.getPendingVacations)(timeOffRequests)).toEqual([]);
        });
    });
    describe.only("calculateTotalVacationDays", () => {
        test("returns 0 if employment start date is after end date", () => {
            const employmentStartDate = new Date("2023-01-01");
            const endDate = new Date("2022-12-31");
            expect((0, timeOffHelpers_1.calculateTotalVacationDays)(employmentStartDate, endDate)).toBe(0);
        });
        test("returns 0 if employment start date is on end date", () => {
            const employmentStartDate = new Date("2022-12-31");
            const endDate = new Date("2022-12-31");
            expect((0, timeOffHelpers_1.calculateTotalVacationDays)(employmentStartDate, endDate)).toBe(0);
        });
        test("returns correct total vacation days for scenario 1", () => {
            // Replace with your actual values for testing
            const employmentStartDate = new Date("2018-01-01");
            // 2018  6 days
            // 2019  8 days
            // 2020  10 days
            // 2021  12 days
            // 2022  14 days
            const endDate = new Date("2022-12-31");
            // Replace 'expectedTotalVacationDays' with the expected result based on your provided dates
            const expectedTotalVacationDays = 50; // Adjust based on your expected result
            expect((0, timeOffHelpers_1.calculateTotalVacationDays)(employmentStartDate, endDate)).toBe(expectedTotalVacationDays);
        });
        test("returns correct total vacation days for scenario 2", () => {
            // Replace with your actual values for testing
            const employmentStartDate = new Date("2023-06-01");
            const endDate = new Date("2024-12-31");
            // Replace 'expectedTotalVacationDays' with the expected result based on your provided dates
            const expectedTotalVacationDays = 20; // Adjust based on your expected result
            expect((0, timeOffHelpers_1.calculateTotalVacationDays)(employmentStartDate, endDate)).toBe(expectedTotalVacationDays);
        });
        test("returns correct total vacation days for scenario 3", () => {
            // Replace with your actual values for testing
            const employmentStartDate = new Date("2020-06-30");
            const endDate = new Date("2024-12-31");
            // Replace 'expectedTotalVacationDays' with the expected result based on your provided dates
            const expectedTotalVacationDays = 58; // Adjust based on your expected result
            expect((0, timeOffHelpers_1.calculateTotalVacationDays)(employmentStartDate, endDate)).toBe(expectedTotalVacationDays);
        });
        test("returns correct total vacation days for scenario 4", () => {
            // Replace with your actual values for testing
            const employmentStartDate = new Date("2020-06-30");
            const endDate = new Date("2024-07-31");
            // Replace 'expectedTotalVacationDays' with the expected result based on your provided dates
            const expectedTotalVacationDays = 49; // Adjust based on your expected result
            expect((0, timeOffHelpers_1.calculateTotalVacationDays)(employmentStartDate, endDate)).toBe(expectedTotalVacationDays);
        });
        test("returns correct total vacation days for scenario 5", () => {
            // Replace with your actual values for testing
            const employmentStartDate = new Date("2022-01-01");
            const endDate = new Date("2022-12-31");
            // Replace 'expectedTotalVacationDays' with the expected result based on your provided dates
            const expectedTotalVacationDays = 6; // Adjust based on your expected result
            expect((0, timeOffHelpers_1.calculateTotalVacationDays)(employmentStartDate, endDate)).toBe(expectedTotalVacationDays);
        });
        test("returns correct total vacation days for scenario 6", () => {
            // Replace with your actual values for testing
            const employmentStartDate = new Date("2018-01-01");
            const endDate = new Date("2024-01-01");
            // Replace 'expectedTotalVacationDays' with the expected result based on your provided dates
            const expectedTotalVacationDays = 78; // Adjust based on your expected result
            expect((0, timeOffHelpers_1.calculateTotalVacationDays)(employmentStartDate, endDate)).toBe(expectedTotalVacationDays);
        });
        test("returns correct total vacation days for scenario 7", () => {
            // Replace with your actual values for testing
            const employmentStartDate = new Date("2017-05-15");
            /*
            15/5/2018 6
            15/5/2019 8
            15/5/2020 10
            15/5/2021 12
            15/5/2022 14
            15/5/2023 22
            02/1/2024 12
            */
            const endDate = new Date("2024-01-02");
            // Replace 'expectedTotalVacationDays' with the expected result based on your provided dates
            const expectedTotalVacationDays = 85; // Adjust based on your expected result
            expect((0, timeOffHelpers_1.calculateTotalVacationDays)(employmentStartDate, endDate)).toBe(expectedTotalVacationDays);
        });
        test.only("returns correct total vacation days for scenario 7", () => {
            // Replace with your actual values for testing
            const employmentStartDate = new Date("2016-12-01");
            /*
            15/5/2018 6
            15/5/2019 8
            15/5/2020 10
            15/5/2021 12
            15/5/2022 14
            15/5/2023 22
            02/1/2024 12
            */
            const endDate = new Date("2024-01-04");
            // Replace 'expectedTotalVacationDays' with the expected result based on your provided dates
            const expectedTotalVacationDays = 85; // Adjust based on your expected result
            expect((0, timeOffHelpers_1.calculateTotalVacationDays)(employmentStartDate, endDate)).toBe(expectedTotalVacationDays);
        });
    });
    describe("calculateVacationDaysBefore2023", () => {
        test("returns 0 if employment start date is after 2022-12-31", () => {
            const employmentStartDate = new Date("2023-01-01");
            expect((0, timeOffHelpers_1.calculateVacationDaysBefore2023)(employmentStartDate)).toBe(0);
        });
        test("returns 0 if employment start date is on 2022-12-31", () => {
            const employmentStartDate = new Date("2022-12-31");
            expect((0, timeOffHelpers_1.calculateVacationDaysBefore2023)(employmentStartDate)).toBe(0);
        });
        test("returns correct vacation days for worked years before 2023", () => {
            // Replace with your actual values for testing
            const employmentStartDate = new Date("2018-01-01");
            const expectedVacationDays = 36; // Adjust based on your expected result
            expect((0, timeOffHelpers_1.calculateVacationDaysBefore2023)(employmentStartDate)).toBe(expectedVacationDays);
        });
        // Add more test cases as needed, including edge cases and invalid inputs
    });
    describe("calculateVacationsForFullYearsBefore2023", () => {
        test("returns correct total vacation days for full years before 2023 when input is 0", () => {
            const yearsWorkedBefore2023 = 0;
            const expectedTotalDays = 0; // Replace with your expected result
            expect((0, timeOffHelpers_1.calculateVacationsForFullYearsBefore2023)(yearsWorkedBefore2023)).toBe(expectedTotalDays);
        });
        test("returns correct total vacation days for full years before 2023 when input is 2", () => {
            const yearsWorkedBefore2023 = 2;
            const expectedTotalDays = 14; // Replace with your expected result
            expect((0, timeOffHelpers_1.calculateVacationsForFullYearsBefore2023)(yearsWorkedBefore2023)).toBe(expectedTotalDays);
        });
        test("returns correct total vacation days for full years before 2023 when input is -5", () => {
            const yearsWorkedBefore2023 = -5;
            const expectedTotalDays = 0; // Replace with your expected result
            expect((0, timeOffHelpers_1.calculateVacationsForFullYearsBefore2023)(yearsWorkedBefore2023)).toBe(expectedTotalDays);
        });
        test("returns correct total vacation days for full years before 2023 when input is 5", () => {
            const yearsWorkedBefore2023 = 5;
            const expectedTotalDays = 50; // Replace with your expected result
            expect((0, timeOffHelpers_1.calculateVacationsForFullYearsBefore2023)(yearsWorkedBefore2023)).toBe(expectedTotalDays);
        });
    });
    describe("calculateVacationDaysForYearBefore2023", () => {
        test("returns correct number of vacation days for various years of working", () => {
            // Replace with your actual values for testing
            expect((0, timeOffHelpers_1.calculateVacationDaysForYearBefore2023)(1)).toBe(6);
            expect((0, timeOffHelpers_1.calculateVacationDaysForYearBefore2023)(5)).toBe(14);
            expect((0, timeOffHelpers_1.calculateVacationDaysForYearBefore2023)(6)).toBe(16);
            expect((0, timeOffHelpers_1.calculateVacationDaysForYearBefore2023)(10)).toBe(16);
            expect((0, timeOffHelpers_1.calculateVacationDaysForYearBefore2023)(11)).toBe(18);
            expect((0, timeOffHelpers_1.calculateVacationDaysForYearBefore2023)(15)).toBe(18);
            expect((0, timeOffHelpers_1.calculateVacationDaysForYearBefore2023)(16)).toBe(20);
            expect((0, timeOffHelpers_1.calculateVacationDaysForYearBefore2023)(20)).toBe(20);
            expect((0, timeOffHelpers_1.calculateVacationDaysForYearBefore2023)(21)).toBe(22);
            expect((0, timeOffHelpers_1.calculateVacationDaysForYearBefore2023)(25)).toBe(22);
            expect((0, timeOffHelpers_1.calculateVacationDaysForYearBefore2023)(26)).toBe(24);
            expect((0, timeOffHelpers_1.calculateVacationDaysForYearBefore2023)(30)).toBe(24);
            // Add more test cases as needed
        });
        test("returns 0 for invalid input", () => {
            expect((0, timeOffHelpers_1.calculateVacationDaysForYearBefore2023)(0)).toBe(0);
            expect((0, timeOffHelpers_1.calculateVacationDaysForYearBefore2023)(-5)).toBe(0);
            expect((0, timeOffHelpers_1.calculateVacationDaysForYearBefore2023)(31)).toBe(0);
            // Add more test cases for invalid input
        });
    });
    describe("calculateVacationsAfter2022", () => {
        test("returns correct calculation when the worker has not worked before 2023", () => {
            const employmentStartDate = new Date("2023-01-01");
            const endDate = new Date("2023-12-31");
            const expectedTotalDays = 12; // Replace with your expected result
            expect((0, timeOffHelpers_1.calculateVacationsAfter2022)(employmentStartDate, endDate)).toBe(expectedTotalDays);
        });
        test("returns correct calculation when the worker has not worked after 2022", () => {
            const employmentStartDate = new Date("2021-01-01");
            const endDate = new Date("2022-12-31");
            const expectedTotalDays = 0; // Replace with your expected result
            expect((0, timeOffHelpers_1.calculateVacationsAfter2022)(employmentStartDate, endDate)).toBe(expectedTotalDays);
        });
        test("returns correct calculation when the worker has worked a lot of years", () => {
            const employmentStartDate = new Date("2018-01-01");
            const endDate = new Date("2023-12-31");
            const expectedTotalDays = 42; // Replace with your expected result
            expect((0, timeOffHelpers_1.calculateVacationsAfter2022)(employmentStartDate, endDate)).toBe(expectedTotalDays);
        });
        // Add more test cases as needed, including edge cases and invalid inputs
    });
    describe("calculateVacationsForFullYearsAfter2022", () => {
        test("returns correct calculation when the worker has not worked before 2023", () => {
            const yearsWorkedBefore2023 = 0;
            const yearsAfter2022 = 1;
            const expectedTotalDays = 12; // Replace with your expected result
            expect((0, timeOffHelpers_1.calculateVacationsForFullYearsAfter2022)(yearsWorkedBefore2023, yearsAfter2022)).toBe(expectedTotalDays);
        });
        test("returns correct total vacation days for full years after 2022", () => {
            // Replace with your actual values for testing
            const yearsWorkedBefore2023 = 1;
            const yearsAfter2022 = 1;
            const expectedTotalDays = 14; // Replace with your expected result
            expect((0, timeOffHelpers_1.calculateVacationsForFullYearsAfter2022)(yearsWorkedBefore2023, yearsAfter2022)).toBe(expectedTotalDays);
        });
        test("returns correct calculation when the worker has not worked after 2022", () => {
            const yearsWorkedBefore2023 = 2;
            const yearsAfter2022 = 0;
            const expectedTotalDays = 0; // Replace with your expected result
            expect((0, timeOffHelpers_1.calculateVacationsForFullYearsAfter2022)(yearsWorkedBefore2023, yearsAfter2022)).toBe(expectedTotalDays);
        });
        test("returns correct calculation when it has worked a lot of years", () => {
            const yearsWorkedBefore2023 = 5;
            const yearsAfter2022 = 5;
            // it should start 6 with 22 days, 7 with 22 days, 8 with 22 days, 9 with 22 days and 10 with 22 days. 110 days total
            const expectedTotalDays = 110; // Replace with your expected result
            expect((0, timeOffHelpers_1.calculateVacationsForFullYearsAfter2022)(yearsWorkedBefore2023, yearsAfter2022)).toBe(expectedTotalDays);
        });
        // Add more test cases as needed, including edge cases and invalid inputs
    });
    describe("calculateVacationsForYearAfter2022", () => {
        test("returns correct vacation days for various years of working", () => {
            expect((0, timeOffHelpers_1.calculateVacationsForYearAfter2022)(1)).toBe(12);
            expect((0, timeOffHelpers_1.calculateVacationsForYearAfter2022)(5)).toBe(20);
            expect((0, timeOffHelpers_1.calculateVacationsForYearAfter2022)(6)).toBe(22);
            expect((0, timeOffHelpers_1.calculateVacationsForYearAfter2022)(10)).toBe(22);
            expect((0, timeOffHelpers_1.calculateVacationsForYearAfter2022)(11)).toBe(24);
            expect((0, timeOffHelpers_1.calculateVacationsForYearAfter2022)(15)).toBe(24);
            expect((0, timeOffHelpers_1.calculateVacationsForYearAfter2022)(16)).toBe(26);
            expect((0, timeOffHelpers_1.calculateVacationsForYearAfter2022)(20)).toBe(26);
            expect((0, timeOffHelpers_1.calculateVacationsForYearAfter2022)(21)).toBe(28);
            expect((0, timeOffHelpers_1.calculateVacationsForYearAfter2022)(25)).toBe(28);
            expect((0, timeOffHelpers_1.calculateVacationsForYearAfter2022)(26)).toBe(30);
            expect((0, timeOffHelpers_1.calculateVacationsForYearAfter2022)(30)).toBe(30);
            // Add more test cases as needed
        });
        test("returns 0 for invalid input", () => {
            expect((0, timeOffHelpers_1.calculateVacationsForYearAfter2022)(0)).toBe(0);
            expect((0, timeOffHelpers_1.calculateVacationsForYearAfter2022)(-5)).toBe(0);
            expect((0, timeOffHelpers_1.calculateVacationsForYearAfter2022)(31)).toBe(0);
            // Add more test cases for invalid input
        });
    });
    describe("calculateYears", () => {
        test("returns correct number of years between two dates when endDate is not sent", () => {
            const startDate = new Date("2021-01-01");
            jest.useFakeTimers().setSystemTime(new Date("2023-12-31"));
            const expectedYears = 3;
            expect((0, timeOffHelpers_1.calculateYears)(startDate)).toBe(expectedYears);
            // Restore the original Date object
            global.Date = Date;
        });
        test("returns correct number of years between two dates when endDate is sent", () => {
            const startDate = new Date("2021-01-01");
            const endDate = new Date("2023-12-31");
            const expectedYears = 3;
            expect((0, timeOffHelpers_1.calculateYears)(startDate, endDate)).toBe(expectedYears);
        });
        test("returns 0 when endDate is previos", () => {
            const startDate = new Date("2021-01-01");
            const endDate = new Date("2020-12-31");
            const expectedYears = 0;
            expect((0, timeOffHelpers_1.calculateYears)(startDate, endDate)).toBe(expectedYears);
        });
        test("returns correct number of years when start date and end date are at random days", () => {
            const startDate = new Date("2021-07-01");
            const endDate = new Date("2023-04-31");
            expect((0, timeOffHelpers_1.calculateYears)(startDate, endDate)).toBeLessThan(2);
            expect((0, timeOffHelpers_1.calculateYears)(startDate, endDate)).toBeGreaterThan(1.7);
        });
    });
});
