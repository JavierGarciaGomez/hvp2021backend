import { HRPaymentType } from "../../domain";
import {
  CollaboratorEntity,
  EmploymentEntity,
  JobEntity,
} from "../../domain/entities";
import { SalaryDataEntity } from "../../domain/entities/salary-data.entity";
import {
  CollaboratorAttendanceReport,
  PayrollCollaboratorRawData,
} from "../../domain/read-models";
import { ExtraCompensationVO } from "../../domain/value-objects";
import { createPayrollService } from "../factories";

describe("PayrollService", () => {
  const payrollService = createPayrollService();
  let defaultMockData: {
    collaborator: CollaboratorEntity;
    employment: EmploymentEntity;
    job: JobEntity;
    attendanceReport: CollaboratorAttendanceReport;
    salaryData: SalaryDataEntity;
  };
  let inputArgs: {
    id: string;
    filteringDto: {
      periodStartDate: string;
      periodEndDate: string;
      commissions: number;
      specialCompensation: number;
    };
  };

  beforeEach(() => {
    // Set up default mock data
    const mockCollaborator = {
      id: "2",
      first_name: "John",
      last_name: "Doe",
      col_code: "EMP",
      curp: "CURP123",
      imssNumber: "IMSS123",
      rfcCode: "RFC123",
      startDate: new Date("2020-01-24"),
      endDate: undefined,
      degree: "Titulado",
    } as unknown as CollaboratorEntity;

    const mockEmployment = {
      id: "1",
      jobId: "1",
      weeklyHours: 36,
      fixedIncome: 3746.25,
      averageOrdinaryIncome: 6992,
      averageIntegratedIncome: 9808,
      averageCommissionIncome: 4647,
      minimumOrdinaryIncome: 7875,
      receptionBonus: 0,
      degreeBonus: 225,
      trainingSupport: 0,
      physicalActivitySupport: 0,
      extraCompensations: [
        { name: "Extra1", amount: 1000 } as ExtraCompensationVO,
      ],
      otherDeductions: [
        {
          name: "infonavitLoanWithholding",
          amount: 2000,
          _id: "67acca515c9d3fca5b6889f8",
        },
      ],
      paymentType: HRPaymentType.SALARY,
      contributionBaseSalary: 454.9,
    } as unknown as EmploymentEntity;

    const mockJob = {
      annualRaisePercent: 2.5,
      quarterlyCommissionRaisePercent: 2.5,
      paymentType: "SALARY",
      sortingOrder: 22,
      incomeMultiplier: 1,
      expectedCommissionsPercentage: 0.4,
      expectedMinimumIncome: 10500,
      expressBranchCompensation: 100,
      active: true,
      baseIncome: 4440,
      description: "",
      hourlyRate: 0,
      minimumIncome: 10500,
      title: "Veterinario B",
      createdAt: "2024-10-12T11:47:20.879Z",
      updatedAt: "2025-02-01T19:23:52.980Z",
      updatedBy: "61dff1cb4131595911ad13fb",
      id: "670a61c88ff5ac02957e5208",
      createdBy: undefined,
    } as unknown as JobEntity;

    const mockAttendanceReport = {
      collaboratorId: "123",
      startDate: "2025-01-16T06:00:00.000Z",
      endDate: "2025-01-31T06:00:00.000Z",
      collaboratorDayReports: [],
      periodHours: {
        workedHours: 109.11666666666666,
        estimatedWorkedHours: 0,
        simulatedAsistanceHours: 0,
        toBeCompensatedHours: 0,
        vacationHours: 0,
        personalLeaveHours: 0,
        justifiedAbsenceByCompanyHours: 0,
        nonComputableHours: 0,
        compensationHours: 0,
        sickLeaveHours: 0,
        authorizedUnjustifiedAbsenceHours: 0,
        unjustifiedAbsenceHours: 0,
        publicHolidaysHours: 0,
        workedSundayHours: 12.366666666666667,
        expressHours: 0,
        mealDays: 9,
      },
      concludedWeeksHours: {
        restWorkedHours: 0,
        singlePlayWorkedExtraHours: 24,
        doublePlayWorkedExtraHours: 1.43333333333333,
        triplePlayWorkedExtraHours: 0,
        notWorkedHours: 0,
      },
      tardiness: 3,
      punctualityBonus: false,
    } as unknown as CollaboratorAttendanceReport;

    const mockSalaryData = {
      maxWorkingHours: 48,
      receptionBonus: 0,
      degreeBonus: 300,
      trainingSupport: 0,
      physicalActivitySupport: 0,
      avgMonthlyOvertimeHours: 10,
      avgMonthlySundayHours: 25,
      avgMonthlyHolidayHours: 4.5,
      justifiedAbsenceCompensationPercent: 0,
      foodDayCompensation: 0,
      year: 2025,
      minimumWage: 278.8,
      uma: 113.14,
      ocupationalRisk: 0.005436,
      imssEmployerRates: {
        sicknessAndMaternity: {
          fixedFee: {
            name: "Cuota fija",
            description: "Base: UMA. 106.I",
            rate: 0.204,
          },
          surplus: {
            name: "Excedente",
            description: "Base: Diferencia entre SBC y 3 veces la UMA. 106.II",
            rate: 0.011,
          },
          cashBenefits: {
            name: "Prestaciones en dinero",
            description: "Base: SBC. 107",
            rate: 0.007,
          },
          pensionersAndBeneficiaries: {
            name: "Pensionados y beneficiarios",
            description: "Base: SBC. ???",
            rate: 0.0105,
          },
        },
        disabilityAndLife: {
          disabilityAndLife: {
            name: "Invalidez y vida",
            description: "Base: SBC. ???",
            rate: 0.0175,
          },
        },
        workRisk: {
          workRisk: {
            name: "Riesgos de trabajo",
            description: "Base: SBC. ???",
            rate: 0.005436,
          },
        },
        daycareAndSocialBenefits: {
          daycareAndSocialBenefits: {
            name: "Guarderías y prestaciones sociales",
            description: "Base: SBC. ???",
            rate: 0.01,
          },
        },
        oldAge: {
          retirement: {
            name: "Retiro",
            description: "Base: SBC. ???",
            rate: 0.02,
          },
          oldAge: [
            {
              umaLimit: 1,
              rate: 0.0315,
            },
            {
              umaLimit: 1.5,
              rate: 0.03544,
            },
            {
              umaLimit: 2,
              rate: "0.0426",
            },
            {
              umaLimit: 2.5,
              rate: "0.04954",
            },
            {
              umaLimit: 3,
              rate: "0.0537",
            },
            {
              umaLimit: 3.5,
              rate: "0.0559",
            },
            {
              umaLimit: 4,
              rate: "0.05747",
            },
            {
              umaLimit: 1000,
              rate: "0.06422",
            },
          ],
        },
        infonavit: {
          infonavit: {
            name: "Infonavit",
            description: "Base: SBC. ???",
            rate: 0.05,
          },
        },
      },
      imssEmployeeRates: {
        sicknessAndMaternity: {
          fixedFee: {
            name: "Cuota fija",
            description: "Base: UMA. 106.I",
            rate: 0,
          },
          surplus: {
            name: "Excedente",
            description: "Base: Diferencia entre SBC y 3 veces la UMA. 106.II",
            rate: 0.004,
          },
          cashBenefits: {
            name: "Prestaciones en dinero",
            description: "Base: SBC. 107",
            rate: 0.0025,
          },
          pensionersAndBeneficiaries: {
            name: "Pensionados y beneficiarios",
            description: "Base: SBC. ???",
            rate: 0.00375,
          },
        },
        disabilityAndLife: {
          disabilityAndLife: {
            name: "Invalidez y vida",
            description: "Base: SBC. ???",
            rate: 0.00625,
          },
        },
        workRisk: {
          workRisk: {
            name: "Riesgos de trabajo",
            description: "Base: SBC. ???",
            rate: 0,
          },
        },
        daycareAndSocialBenefits: {
          daycareAndSocialBenefits: {
            name: "Guarderías y prestaciones sociales",
            description: "Base: SBC. ???",
            rate: 0,
          },
        },
        oldAge: {
          retirement: {
            name: "Retiro",
            description: "Base: SBC. ???",
            rate: 0,
          },
          oldAge: [
            {
              umaLimit: 1,
              rate: 0.01125,
            },
            {
              umaLimit: 1.5,
              rate: 0.01125,
            },
            {
              umaLimit: 2,
              rate: 0.01125,
            },
            {
              umaLimit: 2.5,
              rate: 0.01125,
            },
            {
              umaLimit: 3,
              rate: 0.01125,
            },
            {
              umaLimit: 3.5,
              rate: 0.01125,
            },
            {
              umaLimit: 4,
              rate: 0.01125,
            },
            {
              umaLimit: 1000,
              rate: 0.01125,
            },
          ],
        },
        infonavit: {
          infonavit: {
            name: "Infonavit",
            description: "Base: SBC. ???",
            rate: 0,
          },
        },
      },
      halfMonthIsrRates: [
        {
          lowerLimit: 0.01,
          upperLimit: 368.1,
          fixedFee: 0,
          rate: 0.0192,
          _id: "67ac040a14730839d3d612b5",
        },
        {
          lowerLimit: 368.11,
          upperLimit: 3124.35,
          fixedFee: 7.05,
          rate: 0.064,
          _id: "67ac040a14730839d3d612b6",
        },
        {
          lowerLimit: 3124.36,
          upperLimit: 5490.75,
          fixedFee: 183.45,
          rate: 0.1088,
          _id: "67ac040a14730839d3d612b7",
        },
        {
          lowerLimit: 5490.76,
          upperLimit: 6382.8,
          fixedFee: 441,
          rate: 0.16,
          _id: "67ac040a14730839d3d612b8",
        },
        {
          lowerLimit: 6382.81,
          upperLimit: 7641.9,
          fixedFee: 583.65,
          rate: 0.1792,
          _id: "67ac040a14730839d3d612b9",
        },
        {
          lowerLimit: 7641.91,
          upperLimit: 15412.8,
          fixedFee: 809.25,
          rate: 0.2136,
          _id: "67ac040a14730839d3d612ba",
        },
        {
          lowerLimit: 15412.81,
          upperLimit: 24292.65,
          fixedFee: 2469.15,
          rate: 0.2352,
          _id: "67ac040a14730839d3d612bb",
        },
        {
          lowerLimit: 24292.66,
          upperLimit: 46378.5,
          fixedFee: 4557.75,
          rate: 0.3,
          _id: "67ac040a14730839d3d612bc",
        },
        {
          lowerLimit: 46378.51,
          upperLimit: 61838.1,
          fixedFee: 11183.4,
          rate: 0.32,
          _id: "67ac040a14730839d3d612bd",
        },
        {
          lowerLimit: 61838.11,
          upperLimit: 185514.3,
          fixedFee: 16130.55,
          rate: 0.34,
          _id: "67ac040a14730839d3d612be",
        },
        {
          lowerLimit: 185514.31,
          upperLimit: 10000000,
          fixedFee: 58180.35,
          rate: 0.35,
          _id: "67ac040a14730839d3d612bf",
        },
      ],
      createdAt: "2024-10-12T11:49:00.490Z",
      createdBy: "61dff1cb4131595911ad13fb",
      updatedAt: "2025-02-02T01:23:03.821Z",
      annualIncreasePercentage: 2.5,
      employmentSubsidyAmount: 474,
      employmentSubsidyLimit: 10171,
      updatedBy: "61dff1cb4131595911ad13fb",
      minimumWageHVP: 8500,
      id: "670a622c8ff5ac02957e525a",
    } as unknown as SalaryDataEntity;

    defaultMockData = {
      collaborator: mockCollaborator,
      employment: mockEmployment,
      job: mockJob,
      attendanceReport: mockAttendanceReport,
      salaryData: mockSalaryData,
    };

    inputArgs = {
      id: "1",
      filteringDto: {
        periodStartDate: "2025-01-15T06:00:00.000Z",
        periodEndDate: "2025-01-15T06:00:00.000Z",
        commissions: 3000,
        specialCompensation: 500,
      },
    };

    // Always mock getRawData with the current mockData
    jest
      .spyOn(payrollService as any, "getRawData")
      .mockImplementation(async () => ({ ...defaultMockData }));
  });

  describe("getPayrollEstimateByCollaboratorId", () => {
    it("should calculate payroll estimate correctly", async () => {
      const result = await payrollService.getPayrollEstimateByCollaboratorId(
        inputArgs.id,
        { filteringDto: inputArgs.filteringDto }
      );

      const { payroll } = result;
      const { fixedIncome } = payroll;

      expect(fixedIncome).toBe(1873.125);

      // Add your expectations here
    });

    describe("fixed income calcs", () => {
      it("should not discount any hour", async () => {
        const result = await payrollService.getPayrollEstimateByCollaboratorId(
          inputArgs.id,
          { filteringDto: inputArgs.filteringDto }
        );
        const { fixedIncome } = result.payroll;
        expect(fixedIncome).toBe(1873.125);
      });

      it("should discount non computable hours", async () => {
        const modifiedMockData = {
          ...defaultMockData,
          attendanceReport: {
            ...defaultMockData.attendanceReport,
            periodHours: {
              ...defaultMockData.attendanceReport.periodHours,
              nonComputableHours: 10,
            },
          } as unknown as CollaboratorAttendanceReport,
        };
        jest
          .spyOn(payrollService as any, "getRawData")
          .mockImplementation(async () => modifiedMockData);

        const result = await payrollService.getPayrollEstimateByCollaboratorId(
          inputArgs.id,
          { filteringDto: inputArgs.filteringDto }
        );

        const { fixedIncome } = result.payroll;
        expect(fixedIncome).toBeCloseTo(1633.64);
      });

      it("should discount justified absence by company hours", async () => {
        const modifiedMockData = {
          ...defaultMockData,
          attendanceReport: {
            ...defaultMockData.attendanceReport,
            periodHours: {
              ...defaultMockData.attendanceReport.periodHours,
              justifiedAbsenceByCompanyHours: 10,
            },
          } as unknown as CollaboratorAttendanceReport,
        };

        jest
          .spyOn(payrollService as any, "getRawData")
          .mockImplementation(async () => modifiedMockData);

        const result = await payrollService.getPayrollEstimateByCollaboratorId(
          inputArgs.id,
          { filteringDto: inputArgs.filteringDto }
        );

        const { fixedIncome, justifiedAbsencesCompensation } = result.payroll;

        expect(fixedIncome).toBeCloseTo(1633.64);
        expect(justifiedAbsencesCompensation).toBeCloseTo(233.07);
      });

      it("should discount unjustified absence hours", async () => {
        const modifiedMockData = {
          ...defaultMockData,
          attendanceReport: {
            ...defaultMockData.attendanceReport,
            periodHours: {
              ...defaultMockData.attendanceReport.periodHours,
              unjustifiedAbsenceHours: 10,
            },
          } as unknown as CollaboratorAttendanceReport,
        };

        jest
          .spyOn(payrollService as any, "getRawData")
          .mockImplementation(async () => modifiedMockData);

        const result = await payrollService.getPayrollEstimateByCollaboratorId(
          inputArgs.id,
          { filteringDto: inputArgs.filteringDto }
        );

        const { fixedIncome } = result.payroll;
        expect(fixedIncome).toBeCloseTo(1633.64);
      });

      it("should discount sick leave hours", async () => {
        const modifiedMockData = {
          ...defaultMockData,
          attendanceReport: {
            ...defaultMockData.attendanceReport,
            periodHours: {
              ...defaultMockData.attendanceReport.periodHours,
              sickLeaveHours: 10,
            },
          } as unknown as CollaboratorAttendanceReport,
        };

        jest
          .spyOn(payrollService as any, "getRawData")
          .mockImplementation(async () => modifiedMockData);

        const result = await payrollService.getPayrollEstimateByCollaboratorId(
          inputArgs.id,
          { filteringDto: inputArgs.filteringDto }
        );

        const { fixedIncome } = result.payroll;
        expect(fixedIncome).toBeCloseTo(1633.64);
      });

      it("should discount authorized unjustified absence hours", async () => {
        const modifiedMockData = {
          ...defaultMockData,
          attendanceReport: {
            ...defaultMockData.attendanceReport,
            periodHours: {
              ...defaultMockData.attendanceReport.periodHours,
              authorizedUnjustifiedAbsenceHours: 10,
            },
          } as unknown as CollaboratorAttendanceReport,
        };

        jest
          .spyOn(payrollService as any, "getRawData")
          .mockImplementation(async () => modifiedMockData);

        const result = await payrollService.getPayrollEstimateByCollaboratorId(
          inputArgs.id,
          { filteringDto: inputArgs.filteringDto }
        );

        const { fixedIncome } = result.payroll;
        expect(fixedIncome).toBeCloseTo(1633.64);
      });

      it("should discount not worked hours", async () => {
        const modifiedMockData = {
          ...defaultMockData,
          attendanceReport: {
            ...defaultMockData.attendanceReport,
            concludedWeeksHours: {
              ...defaultMockData.attendanceReport.concludedWeeksHours,
              notWorkedHours: 10,
            },
          } as unknown as CollaboratorAttendanceReport,
        };

        jest
          .spyOn(payrollService as any, "getRawData")
          .mockImplementation(async () => modifiedMockData);

        const result = await payrollService.getPayrollEstimateByCollaboratorId(
          inputArgs.id,
          { filteringDto: inputArgs.filteringDto }
        );

        const { fixedIncome } = result.payroll;
        expect(fixedIncome).toBeCloseTo(1633.64);
      });
    });

    describe("compensations calcs", () => {
      it("should calculate vacations compensation", async () => {
        const modifiedMockData = {
          ...defaultMockData,
          attendanceReport: {
            ...defaultMockData.attendanceReport,
            periodHours: {
              ...defaultMockData.attendanceReport.periodHours,
              vacationHours: 24,
            },
          } as unknown as CollaboratorAttendanceReport,
        };

        jest
          .spyOn(payrollService as any, "getRawData")
          .mockImplementation(async () => modifiedMockData);

        const result = await payrollService.getPayrollEstimateByCollaboratorId(
          inputArgs.id,
          { filteringDto: inputArgs.filteringDto }
        );

        const { vacationsCompensation, vacationBonus } = result.payroll;
        expect(vacationsCompensation).toBeCloseTo(619.6);
        expect(vacationBonus).toBeCloseTo(283.33);
      });

      it("should calculate justified absences compensation", async () => {
        const modifiedMockData = {
          ...defaultMockData,
          attendanceReport: {
            ...defaultMockData.attendanceReport,
            periodHours: {
              ...defaultMockData.attendanceReport.periodHours,
              justifiedAbsenceByCompanyHours: 10,
            },
          } as unknown as CollaboratorAttendanceReport,
        };

        jest
          .spyOn(payrollService as any, "getRawData")
          .mockImplementation(async () => modifiedMockData);

        const result = await payrollService.getPayrollEstimateByCollaboratorId(
          inputArgs.id,
          { filteringDto: inputArgs.filteringDto }
        );

        const { justifiedAbsencesCompensation } = result.payroll;
        expect(justifiedAbsencesCompensation).toBeCloseTo(233.07);
      });

      it("should calculate express branch compensation", async () => {
        const modifiedMockData = {
          ...defaultMockData,
          attendanceReport: {
            ...defaultMockData.attendanceReport,
            periodHours: {
              ...defaultMockData.attendanceReport.periodHours,
              expressHours: 10,
            },
          } as unknown as CollaboratorAttendanceReport,
        };

        jest
          .spyOn(payrollService as any, "getRawData")
          .mockImplementation(async () => modifiedMockData);

        const result = await payrollService.getPayrollEstimateByCollaboratorId(
          inputArgs.id,
          { filteringDto: inputArgs.filteringDto }
        );

        const { expressBranchCompensation } = result.payroll;
        expect(expressBranchCompensation).toBeCloseTo(125);
      });

      it("should calculate minimum ordinary income compensation", async () => {
        const modifiedMockData = {
          ...defaultMockData,
        };

        jest
          .spyOn(payrollService as any, "getRawData")
          .mockImplementation(async () => modifiedMockData);

        const result = await payrollService.getPayrollEstimateByCollaboratorId(
          inputArgs.id,
          { filteringDto: { ...inputArgs.filteringDto, commissions: 1000 } }
        );

        const { minimumOrdinaryIncomeCompensation } = result.payroll;
        expect(minimumOrdinaryIncomeCompensation).toBeCloseTo(1376.875);
      });

      it("should calculate minimum ordinary income compensation with attendance proportion", async () => {
        const modifiedMockData = {
          ...defaultMockData,
          attendanceReport: {
            ...defaultMockData.attendanceReport,
            periodHours: {
              ...defaultMockData.attendanceReport.periodHours,
              unjustifiedAbsenceHours: 24,
            },
          } as unknown as CollaboratorAttendanceReport,
        };

        jest
          .spyOn(payrollService as any, "getRawData")
          .mockImplementation(async () => modifiedMockData);

        const result = await payrollService.getPayrollEstimateByCollaboratorId(
          inputArgs.id,
          { filteringDto: { ...inputArgs.filteringDto, commissions: 1000 } }
        );

        const { minimumOrdinaryIncomeCompensation } = result.payroll;
        expect(minimumOrdinaryIncomeCompensation).toBeCloseTo(1352.782);
      });

      it("should calculate minimum ordinary income compensation with attendance proportion, all absences", async () => {
        const modifiedMockData = {
          ...defaultMockData,
          attendanceReport: {
            ...defaultMockData.attendanceReport,
            periodHours: {
              ...defaultMockData.attendanceReport.periodHours,
              unjustifiedAbsenceHours: 20,
              justifiedAbsenceByCompanyHours: 20,
              authorizedUnjustifiedAbsenceHours: 20,
              sickLeaveHours: 20,
            },
          } as unknown as CollaboratorAttendanceReport,
        };

        jest
          .spyOn(payrollService as any, "getRawData")
          .mockImplementation(async () => modifiedMockData);

        const result = await payrollService.getPayrollEstimateByCollaboratorId(
          inputArgs.id,
          { filteringDto: { ...inputArgs.filteringDto, commissions: 1000 } }
        );

        const { minimumOrdinaryIncomeCompensation } = result.payroll;
        expect(minimumOrdinaryIncomeCompensation).toBeCloseTo(0);
      });
    });

    describe("legal allowances calcs", () => {
      it("should calculate year end bonus", async () => {
        expect(true).toBe(true);
      });

      it("should calculate vacation bonus", async () => {
        const modifiedMockData = {
          ...defaultMockData,
          attendanceReport: {
            ...defaultMockData.attendanceReport,
            periodHours: {
              ...defaultMockData.attendanceReport.periodHours,
              vacationHours: 24,
            },
          } as unknown as CollaboratorAttendanceReport,
        };

        jest
          .spyOn(payrollService as any, "getRawData")
          .mockImplementation(async () => modifiedMockData);

        const result = await payrollService.getPayrollEstimateByCollaboratorId(
          inputArgs.id,
          { filteringDto: inputArgs.filteringDto }
        );

        const { vacationBonus } = result.payroll;
        expect(vacationBonus).toBeCloseTo(283.33);
      });

      it("should calculate profit sharing", async () => {
        expect(true).toBe(true);
      });

      it("should calculate employment subsidy", async () => {
        const modifiedMockData = {
          ...defaultMockData,
          employment: {
            ...defaultMockData.employment,
            extraCompensations: [],
          } as unknown as EmploymentEntity,
          attendanceReport: {
            ...defaultMockData.attendanceReport,
            concludedWeeksHours: {
              ...defaultMockData.attendanceReport.concludedWeeksHours,
              singlePlayWorkedExtraHours: 0,
              doublePlayWorkedExtraHours: 0,
              triplePlayWorkedExtraHours: 0,
            },
            periodHours: {
              ...defaultMockData.attendanceReport.periodHours,
              mealDays: 0,
            },
          } as unknown as CollaboratorAttendanceReport,
        };

        jest
          .spyOn(payrollService as any, "getRawData")
          .mockImplementation(async () => modifiedMockData);

        const result = await payrollService.getPayrollEstimateByCollaboratorId(
          inputArgs.id,
          { filteringDto: { ...inputArgs.filteringDto, commissions: 0 } }
        );

        const { employmentSubsidy } = result.payroll;
        expect(employmentSubsidy).toBeCloseTo(237);
      });
    });

    describe("extra legal compensations calcs", () => {
      it("should calculate extra hours with a reduced week shift", async () => {
        const modifiedMockData = {
          ...defaultMockData,
          attendanceReport: {
            ...defaultMockData.attendanceReport,
            concludedWeeksHours: {
              ...defaultMockData.attendanceReport.concludedWeeksHours,
              singlePlayWorkedExtraHours: 8,
              doublePlayWorkedExtraHours: 8,
              triplePlayWorkedExtraHours: 8,
            },
          } as unknown as CollaboratorAttendanceReport,
        };

        jest
          .spyOn(payrollService as any, "getRawData")
          .mockImplementation(async () => modifiedMockData);

        const result = await payrollService.getPayrollEstimateByCollaboratorId(
          inputArgs.id,
          { filteringDto: inputArgs.filteringDto }
        );

        const {
          extraHoursSinglePlay,
          extraHoursDoublePlay,
          extraHoursTriplePlay,
        } = result.payroll;
        const singlePay = 310.755;

        expect(extraHoursSinglePlay).toBeCloseTo(singlePay);
        expect(extraHoursDoublePlay).toBeCloseTo(singlePay * 2);
        expect(extraHoursTriplePlay).toBeCloseTo(singlePay * 3);
      });

      it("should calculate sunday bonus extra pay", async () => {
        const result = await payrollService.getPayrollEstimateByCollaboratorId(
          inputArgs.id,
          { filteringDto: inputArgs.filteringDto }
        );

        const { sundayBonusExtraPay } = result.payroll;
        expect(sundayBonusExtraPay).toBeCloseTo(120.094);
      });

      it("should calculate holiday or rest extra pay", async () => {
        const modifiedMockData = {
          ...defaultMockData,
          attendanceReport: {
            ...defaultMockData.attendanceReport,
            periodHours: {
              ...defaultMockData.attendanceReport.periodHours,
              publicHolidaysHours: 12,
            },
          } as unknown as CollaboratorAttendanceReport,
        };

        jest
          .spyOn(payrollService as any, "getRawData")
          .mockImplementation(async () => modifiedMockData);

        const result = await payrollService.getPayrollEstimateByCollaboratorId(
          inputArgs.id,
          { filteringDto: inputArgs.filteringDto }
        );

        const { holidayOrRestExtraPay } = result.payroll;
        expect(holidayOrRestExtraPay).toBeCloseTo(932.267);
      });
    });

    describe("company benefits calcs", () => {
      it("should calculate punctuality bonus", async () => {
        const modifiedMockData = {
          ...defaultMockData,
          attendanceReport: {
            ...defaultMockData.attendanceReport,
            punctualityBonus: true,
          } as unknown as CollaboratorAttendanceReport,
        };

        jest
          .spyOn(payrollService as any, "getRawData")
          .mockImplementation(async () => modifiedMockData);

        const result = await payrollService.getPayrollEstimateByCollaboratorId(
          inputArgs.id,
          { filteringDto: inputArgs.filteringDto }
        );

        const { punctualityBonus } = result.payroll;
        expect(punctualityBonus).toBeCloseTo(283.33);
      });

      it("should calculate meal compensation", async () => {
        const modifiedMockData = {
          ...defaultMockData,
          attendanceReport: {
            ...defaultMockData.attendanceReport,
            periodHours: {
              ...defaultMockData.attendanceReport.periodHours,
              mealDays: 2,
            },
          } as unknown as CollaboratorAttendanceReport,
        };

        jest
          .spyOn(payrollService as any, "getRawData")
          .mockImplementation(async () => modifiedMockData);

        const result = await payrollService.getPayrollEstimateByCollaboratorId(
          inputArgs.id,
          { filteringDto: inputArgs.filteringDto }
        );

        const { mealCompensation } = result.payroll;
        expect(mealCompensation).toBeCloseTo(100);
      });
    });

    it("should throw error when required dates are missing", async () => {
      await expect(
        payrollService.getPayrollEstimateByCollaboratorId("1", {
          filteringDto: {},
        })
      ).rejects.toThrow("Missing required fields");
    });
  });

  describe("calculate fixedIncome", () => {
    const periodHours = {
      justifiedAbsenceByCompanyHours: 0,
      nonComputableHours: 0,
      sickLeaveHours: 0,
      authorizedUnjustifiedAbsenceHours: 0,
      unjustifiedAbsenceHours: 0,
    };

    const attendanceReport = {
      periodHours,
      concludedWeeksHours: {
        notWorkedHours: 0,
      },
    };

    const employment = {
      fixedIncome: 5000,
      weeklyHours: 36,
    } as unknown as EmploymentEntity;

    const rawData = {
      attendanceReport,
      employment,
    } as unknown as PayrollCollaboratorRawData;

    it("should calculate fixed income", async () => {
      const result = payrollService.calculateFixedAttendance(rawData);
      expect(result).toBeCloseTo(5000);
    });
  });
});
