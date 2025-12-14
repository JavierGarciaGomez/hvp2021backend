import { HRPaymentType } from "../../domain";
import { createPayrollService } from "../factories";
import { PayrollService } from "./payroll.service";

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
