import { AttendanceReportService } from "./attendance-report.service";
import {
  AttendanceRecordEntity,
  BranchEntity,
  CollaboratorEntity,
  EmploymentEntity,
  JobEntity,
  PublicHolidaysEntity,
  TimeOffRequestEntity,
  TimeOffStatus,
  TimeOffType,
  WeekShiftEntity,
  WorkingDayType,
  HRPaymentType,
} from "../../domain";
import dayjs from "dayjs";
import { BaseError } from "../../shared";

// Mock the service dependencies
jest.mock("../factories", () => ({
  createWeekShiftService: jest.fn(() => ({
    getAll: jest.fn(),
  })),
  createTimeOffRequestService: jest.fn(() => ({
    getAll: jest.fn(),
  })),
  createAttendanceRecordService: jest.fn(() => ({
    getAll: jest.fn(),
  })),
  createJobService: jest.fn(() => ({
    getAll: jest.fn(),
  })),
  createCollaboratorService: jest.fn(() => ({
    getAll: jest.fn(),
  })),
  createPublicHolidaysService: jest.fn(() => ({
    getAll: jest.fn(),
  })),
  createEmploymentService: jest.fn(() => ({
    getAll: jest.fn(),
  })),
  createBranchService: jest.fn(() => ({
    getAll: jest.fn(),
  })),
}));

describe("AttendanceReportService", () => {
  let service: AttendanceReportService;

  beforeEach(() => {
    service = new AttendanceReportService();
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should throw error when periodStartDate is missing", async () => {
      const queryOptions = {
        filteringDto: {
          periodEndDate: "2024-03-20",
        },
      };

      await expect(service.getAll(queryOptions)).rejects.toThrow(
        "Missing required fields: periodStartDate"
      );
    });

    it("should throw error when periodEndDate is missing", async () => {
      const queryOptions = {
        filteringDto: {
          periodStartDate: "2024-03-20",
        },
      };

      await expect(service.getAll(queryOptions)).rejects.toThrow(
        "Missing required fields: periodEndDate"
      );
    });

    it("should generate attendance reports for all active collaborators", async () => {
      const mockCollaborator: Partial<CollaboratorEntity> = {
        id: "1",
        col_code: "TEST001",
        isActive: true,
        weeklyHours: 48,
        startDate: new Date("2024-01-01"),
        jobId: "1",
      };

      const mockJob: Partial<JobEntity> = {
        id: "1",
        title: "Test Job",
        active: true,
      };

      const mockEmployment: Partial<EmploymentEntity> = {
        id: "1",
        collaboratorId: "1",
        employmentStartDate: new Date("2024-01-01"),
        weeklyHours: 48,
        jobId: "1",
        isActive: true,
        paymentType: HRPaymentType.SALARY,
        seniorityBonusPercentage: 0,

        baseSalary: 1000,
        paymentFrequency: "WEEKLY",
        paymentDay: 1,
        paymentMethod: "BANK_TRANSFER",
        bankName: "TEST BANK",
        bankAccount: "1234567890",
        bankAccountType: "CHECKING",
        bankAccountHolder: "Test User",
        bankAccountHolderRfc: "TEST123456XXX",
      } as unknown as EmploymentEntity;

      const mockBranch: Partial<BranchEntity> = {
        id: "1",
        name: "Test Branch",
        isActive: true,
      } as unknown as BranchEntity;

      // Mock service responses
      service.collaboratorService.getAll = jest
        .fn()
        .mockResolvedValue([mockCollaborator]);
      service.jobService.getAll = jest.fn().mockResolvedValue([mockJob]);
      service.employmentService.getAll = jest
        .fn()
        .mockResolvedValue([mockEmployment]);
      service.branchService.getAll = jest.fn().mockResolvedValue([mockBranch]);
      service.weekshiftService.getAll = jest.fn().mockResolvedValue([]);
      service.timeOffRequestService.getAll = jest.fn().mockResolvedValue([]);
      service.attendanceRecordService.getAll = jest.fn().mockResolvedValue([]);
      service.publicHolidaysService.getAll = jest.fn().mockResolvedValue([]);

      const queryOptions = {
        filteringDto: {
          periodStartDate: "2024-03-01",
          periodEndDate: "2024-03-15",
        },
      };

      const result = await service.getAll(queryOptions);

      expect(result).toHaveLength(1);
      expect(result[0].collaboratorId).toBe("1");
      expect(result[0].startDate).toEqual(new Date("2024-03-01"));
      expect(result[0].endDate).toEqual(new Date("2024-03-15"));
    });
  });

  describe("getByCollaboratorId", () => {
    it("should throw error when collaborator is not found", async () => {
      service.collaboratorService.getAll = jest.fn().mockResolvedValue([]);

      const queryOptions = {
        filteringDto: {
          periodStartDate: "2024-03-01",
          periodEndDate: "2024-03-15",
        },
      };

      await expect(
        service.getByCollaboratorId("nonexistent", queryOptions)
      ).rejects.toThrow("Collaborator with id nonexistent not found");
    });

    it("should generate attendance report for specific collaborator", async () => {
      const mockCollaborator: Partial<CollaboratorEntity> = {
        id: "1",
        col_code: "TEST001",
        isActive: true,
        weeklyHours: 48,
        startDate: new Date("2024-01-01"),
        jobId: "1",
      };

      // Mock service responses
      service.collaboratorService.getAll = jest
        .fn()
        .mockResolvedValue([mockCollaborator]);
      service.jobService.getAll = jest.fn().mockResolvedValue([]);
      service.employmentService.getAll = jest.fn().mockResolvedValue([]);
      service.branchService.getAll = jest.fn().mockResolvedValue([]);
      service.weekshiftService.getAll = jest.fn().mockResolvedValue([]);
      service.timeOffRequestService.getAll = jest.fn().mockResolvedValue([]);
      service.attendanceRecordService.getAll = jest.fn().mockResolvedValue([]);
      service.publicHolidaysService.getAll = jest.fn().mockResolvedValue([]);

      const queryOptions = {
        filteringDto: {
          periodStartDate: "2024-03-01",
          periodEndDate: "2024-03-15",
        },
      };

      const result = await service.getByCollaboratorId("1", queryOptions);

      expect(result.collaboratorId).toBe("1");
      expect(result.startDate).toEqual(new Date("2024-03-01"));
      expect(result.endDate).toEqual(new Date("2024-03-15"));
    });
  });

  describe("calculateShiftHoursInPeriod", () => {
    it("should calculate period hours correctly for ordinary shifts", () => {
      const dayReports = [
        {
          date: dayjs("2024-03-01"),
          workingDayType: WorkingDayType.OrdinaryShift,
          assignedHours: 8,
          workedHours: 8,
          extraHours: 0,
          delayMinutes: 0,
          anticipatedMinutes: 0,
        },
      ];

      const result = service["calculateShiftHoursInPeriod"](dayReports, 48);

      expect(result.workedHours).toBe(8);
      expect(result.estimatedWorkedHours).toBe(0);
      expect(result.mealDays).toBe(0);
    });

    it("should calculate period hours correctly with overtime", () => {
      const dayReports = [
        {
          date: dayjs("2024-03-01"),
          workingDayType: WorkingDayType.OrdinaryShift,
          assignedHours: 8,
          workedHours: 10,
          extraHours: 2,
          delayMinutes: 0,
          anticipatedMinutes: 0,
        },
      ];

      const result = service["calculateShiftHoursInPeriod"](dayReports, 48);

      expect(result.workedHours).toBe(10);
      expect(result.mealDays).toBe(1);
    });
  });
});
