import { HRPaymentType, PayrollEntity, PayrollStatus } from "../../domain";
import { createPayrollService } from "../factories";
import { PayrollService } from "./payroll.service";
import { YEAR_END_BONUS_DAYS } from "../../shared/constants/hris.constants";
import { PayrollEarnings, PayrollDeductions } from "../../domain/value-objects/payroll.vo";

describe("PayrollService Validation", () => {
  const payrollService = createPayrollService();

  describe("validatePayrollDoesNotExist", () => {
    it("should throw error when payroll already exists for collaborator and end date", async () => {
      // Mock the repository to return an existing payroll
      const mockRepository = {
        getAll: jest.fn().mockResolvedValue([{ id: "existing-payroll" }]),
      };

      // Create a service instance with mocked repository
      const serviceWithMock = new PayrollService(mockRepository as any);

      const collaboratorId = "test-collaborator";
      const periodEndDate = new Date("2025-01-31");

      await expect(
        serviceWithMock.create({
          collaboratorId,
          periodEndDate,
          periodStartDate: new Date("2025-01-16"),
          generalData: {
            fullName: "Test User",
            collaboratorCode: "TEST001",
            curp: "",
            socialSecurityNumber: "",
            rfcNumber: "",
            jobTitle: "Test Job",
            paymentType: HRPaymentType.SALARY,
            contributionBaseSalary: 1000,
          },
          earnings: {},
          deductions: {},
          totals: {
            totalIncome: 0,
            totalDeductions: 0,
            netPay: 0,
          },
          contextData: {
            attendanceFactor: 1,
            employerImssRate: 0,
            workedHours: 0,
          },
        } as any)
      ).rejects.toThrow(
        "Payroll already exists for collaborator test-collaborator with end date 2025-01-31"
      );
    });

    it("should not throw error when no payroll exists for collaborator and end date", async () => {
      // Mock the repository to return no existing payrolls
      const mockRepository = {
        getAll: jest.fn().mockResolvedValue([]),
        create: jest.fn().mockResolvedValue({ id: "new-payroll" }),
      };

      // Create a service instance with mocked repository
      const serviceWithMock = new PayrollService(mockRepository as any);

      const collaboratorId = "test-collaborator";
      const periodEndDate = new Date("2025-01-31");

      // This should not throw an error
      await expect(
        serviceWithMock.create({
          collaboratorId,
          periodEndDate,
          periodStartDate: new Date("2025-01-16"),
          generalData: {
            fullName: "Test User",
            collaboratorCode: "TEST001",
            curp: "",
            socialSecurityNumber: "",
            rfcNumber: "",
            jobTitle: "Test Job",
            paymentType: HRPaymentType.SALARY,
            contributionBaseSalary: 1000,
          },
          earnings: {},
          deductions: {},
          totals: {
            totalIncome: 0,
            totalDeductions: 0,
            netPay: 0,
          },
          contextData: {
            attendanceFactor: 1,
            employerImssRate: 0,
            workedHours: 0,
          },
        } as any)
      ).resolves.toBeDefined();
    });
  });

  describe("validatePayrollsDoNotExist", () => {
    it("should throw error when any payroll in bulk creation already exists", async () => {
      // Mock the repository to return existing payrolls for some collaborators
      const mockRepository = {
        getAll: jest
          .fn()
          .mockResolvedValueOnce([{ id: "existing-payroll" }]) // First call returns existing
          .mockResolvedValueOnce([]), // Second call returns empty
        createMany: jest.fn(),
      };

      // Create a service instance with mocked repository
      const serviceWithMock = new PayrollService(mockRepository as any);

      const payrolls = [
        {
          collaboratorId: "collaborator-1",
          periodEndDate: new Date("2025-01-31"),
        },
        {
          collaboratorId: "collaborator-2",
          periodEndDate: new Date("2025-01-31"),
        },
      ] as any[];

      await expect(serviceWithMock.createMany(payrolls)).rejects.toThrow(
        "One or more payrolls already exist for the specified collaborators and end dates. No payrolls will be created."
      );
    });
  });
});

describe("PayrollService - calculateYearEndBonus", () => {
  // Default earnings template with all required properties
  const defaultEarnings: PayrollEarnings = {
    halfWeekFixedIncome: 5000,
    halfWeekHourlyPay: 0,
    additionalFixedIncomes: [],
    commissions: 0,
    punctualityBonus: 0,
    receptionBonus: 0,
    expressBranchCompensation: 0,
    vacationCompensation: 0,
    specialBonuses: [],
    guaranteedIncomeCompensation: 0,
    simpleOvertimeHours: 0,
    doubleOvertimeHours: 0,
    tripleOvertimeHours: 0,
    sundayBonus: 0,
    holidayOrRestExtraPay: 0,
    endYearBonus: 0,
    vacationBonus: 0,
    profitSharing: 0,
    employmentSubsidy: 0,
    traniningActivitySupport: 0,
    physicalActivitySupport: 0,
    extraVariableCompensations: [],
  };

  // Default deductions template
  const defaultDeductions: PayrollDeductions = {
    justifiedAbsencesDiscount: 0,
    unjustifiedAbsencesDiscount: 0,
    unworkedHoursDiscount: 0,
    tardinessDiscount: 0,
    nonCountedDaysDiscount: 0,
    incomeTaxWithholding: 0,
    socialSecurityWithholding: 0,
    otherFixedDeductions: [],
    otherVariableDeductions: [],
  };

  // Helper to create mock payrolls
  // Helper to create Mexico timezone dates (00:00 Mexico = 06:00 UTC in winter)
  const mxDate = (year: number, month: number, day: number) =>
    new Date(Date.UTC(year, month, day, 6, 0, 0, 0));

  const createMockPayroll = (overrides: {
    periodStartDate?: Date;
    periodEndDate?: Date;
    earnings?: Partial<PayrollEarnings>;
    deductions?: Partial<PayrollDeductions>;
  } = {}): PayrollEntity => ({
    collaboratorId: "test-collaborator",
    periodStartDate: overrides.periodStartDate ?? mxDate(2025, 0, 1),
    periodEndDate: overrides.periodEndDate ?? mxDate(2025, 0, 15),
    payrollStatus: PayrollStatus.Pending,
    generalData: {
      fullName: "Test User",
      collaboratorCode: "TEST",
      curp: "",
      socialSecurityNumber: "",
      rfcNumber: "",
      jobTitle: "Test",
      paymentType: HRPaymentType.SALARY,
      contributionBaseSalary: 500,
    },
    earnings: { ...defaultEarnings, ...overrides.earnings },
    deductions: { ...defaultDeductions, ...overrides.deductions },
    totals: { totalIncome: 5000, totalDeductions: 0, netPay: 5000 },
    contextData: { attendanceFactor: 1, employerImssRate: 0, workedHours: 80 },
  } as PayrollEntity);

  describe("Full year collaborator (started before current year)", () => {
    it("should calculate year-end bonus based on all payrolls", async () => {
      // 24 bi-weekly payrolls (full year), each with 5000 base income
      const payrolls: PayrollEntity[] = [];
      for (let i = 0; i < 24; i++) {
        const month = Math.floor(i / 2);
        const isFirstHalf = i % 2 === 0;
        const startDay = isFirstHalf ? 1 : 16;
        const endDay = isFirstHalf ? 15 : new Date(2025, month + 1, 0).getDate();

        payrolls.push(createMockPayroll({
          periodStartDate: mxDate(2025, month, startDay),
          periodEndDate: mxDate(2025, month, endDay),
          earnings: {
            halfWeekFixedIncome: 5000,
          },
        }));
      }

      const mockRepository = {
        getAll: jest.fn().mockResolvedValue(payrolls),
      };

      const serviceWithMock = new PayrollService(mockRepository as any);

      // Access private method for testing
      const calculateYearEndBonus = (serviceWithMock as any).calculateYearEndBonus.bind(serviceWithMock);

      const hireDate = mxDate(2020, 0, 15); // Started years ago
      const minimumWage = 278.80; // 2025 minimum wage

      const result = await calculateYearEndBonus({
        collaboratorId: "test-collaborator",
        calculationYear: 2025,
        hireDate,
        minimumDailyWage: minimumWage,
        applyMinimumWageFloor: true,
      });

      // Total base income: 24 payrolls * 5000 = 120,000
      // Days covered: Jan 1 to Dec 31 = 365 days
      // Daily average: 120,000 / 365 ≈ 328.77
      // Year-end bonus: 328.77 * 15 * (365/365) = 4,931.55
      expect(result).toBeGreaterThan(4000);
      expect(result).toBeLessThan(6000);
    });
  });

  describe("Collaborator who started mid-year", () => {
    it("should calculate year-end bonus proportionally for collaborator who started in July", async () => {
      // Only 12 payrolls (July-December), each with 5000 base income
      const payrolls: PayrollEntity[] = [];
      for (let i = 0; i < 12; i++) {
        const month = 6 + Math.floor(i / 2); // July = 6
        const isFirstHalf = i % 2 === 0;
        const startDay = isFirstHalf ? 1 : 16;
        const endDay = isFirstHalf ? 15 : new Date(2025, month + 1, 0).getDate();

        payrolls.push(createMockPayroll({
          periodStartDate: mxDate(2025, month, startDay),
          periodEndDate: mxDate(2025, month, endDay),
          earnings: {
            halfWeekFixedIncome: 5000,
          },
        }));
      }

      const mockRepository = {
        getAll: jest.fn().mockResolvedValue(payrolls),
      };

      const serviceWithMock = new PayrollService(mockRepository as any);
      const calculateYearEndBonus = (serviceWithMock as any).calculateYearEndBonus.bind(serviceWithMock);

      const hireDate = mxDate(2025, 6, 1); // Started mid-year (July 1)
      const minimumWage = 278.80;

      const result = await calculateYearEndBonus({
        collaboratorId: "test-collaborator",
        calculationYear: 2025,
        hireDate,
        minimumDailyWage: minimumWage,
        applyMinimumWageFloor: true,
      });

      // Total base income: 12 payrolls * 5000 = 60,000
      // Days covered: Jul 1 to Dec 31 = 184 days
      // Daily average: 60,000 / 184 ≈ 326.09
      // Proportion of year: 184 / 365 = 0.504
      // Year-end bonus: 326.09 * 15 * 0.504 ≈ 2,465
      expect(result).toBeGreaterThan(2000);
      expect(result).toBeLessThan(3000);
    });
  });

  describe("Collaborator with no payrolls", () => {
    it("should return 0 when no payrolls exist", async () => {
      const mockRepository = {
        getAll: jest.fn().mockResolvedValue([]),
      };

      const serviceWithMock = new PayrollService(mockRepository as any);
      const calculateYearEndBonus = (serviceWithMock as any).calculateYearEndBonus.bind(serviceWithMock);

      const hireDate = mxDate(2025, 11, 1); // Just started
      const minimumWage = 278.80;

      const result = await calculateYearEndBonus({
        collaboratorId: "test-collaborator",
        calculationYear: 2025,
        hireDate,
        minimumDailyWage: minimumWage,
        applyMinimumWageFloor: true,
      });

      expect(result).toBe(0);
    });
  });

  describe("Collaborator with commissions", () => {
    it("should include only 50% of commissions in calculation", async () => {
      const payrolls = [
        createMockPayroll({
          periodStartDate: mxDate(2025, 0, 1),
          periodEndDate: mxDate(2025, 0, 15),
          earnings: {
            halfWeekFixedIncome: 5000,
            commissions: 2000, // Only 1000 (50%) should be included
          },
        }),
      ];

      const mockRepository = {
        getAll: jest.fn().mockResolvedValue(payrolls),
      };

      const serviceWithMock = new PayrollService(mockRepository as any);
      const calculateYearEndBonus = (serviceWithMock as any).calculateYearEndBonus.bind(serviceWithMock);

      const hireDate = mxDate(2020, 0, 15);
      const minimumWage = 278.80;

      const result = await calculateYearEndBonus({
        collaboratorId: "test-collaborator",
        calculationYear: 2025,
        hireDate,
        minimumDailyWage: minimumWage,
        applyMinimumWageFloor: true,
      });

      // Total: 5000 + (2000 * 0.5) = 6000
      // Days covered by payrolls: 15
      // Daily average: 6000 / 15 = 400
      // Days worked in year: 365 (hireDate 2020, so Jan 1 - Dec 31)
      // Proportion: 365 / 365 = 1
      // Year-end bonus: 400 * 15 * 1 = 6000
      expect(result).toBe(6000);
    });
  });

  describe("Collaborator with attendance deductions", () => {
    it("should subtract attendance deductions from total", async () => {
      const payrolls = [
        createMockPayroll({
          periodStartDate: mxDate(2025, 0, 1),
          periodEndDate: mxDate(2025, 0, 15),
          earnings: {
            halfWeekFixedIncome: 5000,
          },
          deductions: {
            justifiedAbsencesDiscount: 200,
            unjustifiedAbsencesDiscount: 300,
            tardinessDiscount: 100,
          },
        }),
      ];

      const mockRepository = {
        getAll: jest.fn().mockResolvedValue(payrolls),
      };

      const serviceWithMock = new PayrollService(mockRepository as any);
      const calculateYearEndBonus = (serviceWithMock as any).calculateYearEndBonus.bind(serviceWithMock);

      const hireDate = mxDate(2020, 0, 15);
      const minimumWage = 278.80;

      const result = await calculateYearEndBonus({
        collaboratorId: "test-collaborator",
        calculationYear: 2025,
        hireDate,
        minimumDailyWage: minimumWage,
        applyMinimumWageFloor: true,
      });

      // Total income: 5000
      // Total deductions: 200 + 300 + 100 = 600
      // Base: 5000 - 600 = 4400
      // Days: 15
      // Daily average: 4400 / 15 = 293.33
      // Days worked in year: 365 (hireDate 2020)
      // Proportion: 1
      // Year-end bonus: 293.33 * 15 * 1 = 4400
      expect(result).toBe(4400);
    });
  });

  describe("Minimum wage floor", () => {
    it("should apply minimum wage floor when daily average is below minimum", async () => {
      const payrolls = [
        createMockPayroll({
          periodStartDate: mxDate(2025, 0, 1),
          periodEndDate: mxDate(2025, 0, 15),
          earnings: {
            halfWeekFixedIncome: 1000, // Very low income
          },
        }),
      ];

      const mockRepository = {
        getAll: jest.fn().mockResolvedValue(payrolls),
      };

      const serviceWithMock = new PayrollService(mockRepository as any);
      const calculateYearEndBonus = (serviceWithMock as any).calculateYearEndBonus.bind(serviceWithMock);

      const hireDate = mxDate(2020, 0, 15);
      const minimumWage = 278.80; // Higher than daily average

      const result = await calculateYearEndBonus({
        collaboratorId: "test-collaborator",
        calculationYear: 2025,
        hireDate,
        minimumDailyWage: minimumWage,
        applyMinimumWageFloor: true,
      });

      // Daily average: 1000 / 15 = 66.67 (below minimum wage)
      // Effective daily average: 278.80 (minimum wage)
      // Days worked in year: 365 (hireDate 2020)
      // Proportion: 1
      // Year-end bonus: 278.80 * 15 * 1 = 4182
      expect(result).toBe(minimumWage * YEAR_END_BONUS_DAYS);
    });

    it("should NOT apply minimum wage floor when daily average is above minimum", async () => {
      const payrolls = [
        createMockPayroll({
          periodStartDate: mxDate(2025, 0, 1),
          periodEndDate: mxDate(2025, 0, 15),
          earnings: {
            halfWeekFixedIncome: 10000, // High income
          },
        }),
      ];

      const mockRepository = {
        getAll: jest.fn().mockResolvedValue(payrolls),
      };

      const serviceWithMock = new PayrollService(mockRepository as any);
      const calculateYearEndBonus = (serviceWithMock as any).calculateYearEndBonus.bind(serviceWithMock);

      const hireDate = mxDate(2020, 0, 15);
      const minimumWage = 278.80;

      const result = await calculateYearEndBonus({
        collaboratorId: "test-collaborator",
        calculationYear: 2025,
        hireDate,
        minimumDailyWage: minimumWage,
        applyMinimumWageFloor: true,
      });

      // Daily average: 10000 / 15 = 666.67 (above minimum wage)
      // Days worked in year: 365 (hireDate 2020)
      // Proportion: 1
      // Year-end bonus: 666.67 * 15 * 1 = 10000
      expect(result).toBe(10000);
    });
  });

  describe("Additional fixed incomes", () => {
    it("should include additional fixed incomes in calculation", async () => {
      const payrolls = [
        createMockPayroll({
          periodStartDate: mxDate(2025, 0, 1),
          periodEndDate: mxDate(2025, 0, 15),
          earnings: {
            halfWeekFixedIncome: 5000,
            additionalFixedIncomes: [
              { name: "Bonus", amount: 500 },
              { name: "Allowance", amount: 300 },
            ],
          },
        }),
      ];

      const mockRepository = {
        getAll: jest.fn().mockResolvedValue(payrolls),
      };

      const serviceWithMock = new PayrollService(mockRepository as any);
      const calculateYearEndBonus = (serviceWithMock as any).calculateYearEndBonus.bind(serviceWithMock);

      const hireDate = mxDate(2020, 0, 15);
      const minimumWage = 278.80;

      const result = await calculateYearEndBonus({
        collaboratorId: "test-collaborator",
        calculationYear: 2025,
        hireDate,
        minimumDailyWage: minimumWage,
        applyMinimumWageFloor: true,
      });

      // Total: 5000 + 500 + 300 = 5800
      // Days: 15
      // Daily average: 5800 / 15 = 386.67
      // Days worked in year: 365 (hireDate 2020)
      // Proportion: 1
      // Year-end bonus: 386.67 * 15 * 1 = 5800
      expect(result).toBe(5800);
    });
  });

  describe("Hourly employee", () => {
    it("should use halfWeekHourlyPay instead of halfWeekFixedIncome", async () => {
      const payrolls = [
        createMockPayroll({
          periodStartDate: mxDate(2025, 0, 1),
          periodEndDate: mxDate(2025, 0, 15),
          earnings: {
            halfWeekFixedIncome: 0,
            halfWeekHourlyPay: 4500,
          },
        }),
      ];

      const mockRepository = {
        getAll: jest.fn().mockResolvedValue(payrolls),
      };

      const serviceWithMock = new PayrollService(mockRepository as any);
      const calculateYearEndBonus = (serviceWithMock as any).calculateYearEndBonus.bind(serviceWithMock);

      const hireDate = mxDate(2020, 0, 15);
      const minimumWage = 278.80;

      const result = await calculateYearEndBonus({
        collaboratorId: "test-collaborator",
        calculationYear: 2025,
        hireDate,
        minimumDailyWage: minimumWage,
        applyMinimumWageFloor: true,
      });

      // Total: 4500
      // Days: 15
      // Daily average: 4500 / 15 = 300
      // Days worked in year: 365 (hireDate 2020)
      // Proportion: 1
      // Year-end bonus: 300 * 15 * 1 = 4500
      expect(result).toBe(4500);
    });
  });
});
