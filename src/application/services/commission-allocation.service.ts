import { createCollaboratorService } from "./../factories/collaborator2.factory";

import { CommissionAllocationEntity } from "../../domain/entities";
import { BaseService } from "./base.service";
import {
  CommissionAllocationRepository,
  CommissionBonusType,
  CommissionType,
} from "../../domain";
import { CommissionAllocationDTO } from "../dtos";
import {
  BaseError,
  buildQueryOptions,
  CustomQueryOptions,
  getCommissionsStatsPeriodsByPeriodAndDates,
  getMxPeriodKey,
  PeriodData,
} from "../../shared";
import {
  CommissionsStats,
  CommissionsTableRow,
  PeriodCollaboratorStats,
} from "../../domain/read-models/commissions-stats";

import { CommissionAllocationFlattedVO } from "../../domain/value-objects/commissions.vo";
import {
  CommissionsPromotionStats,
  PromotionChartPeriod,
  PromotionMetricRow,
} from "../../domain/read-models/commission-promotion-stats.rm";
import { CollaboratorCommissionStats } from "../../domain/read-models/collaborator-commission-stats.rm";
import dayjs from "dayjs";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import minMax from "dayjs/plugin/minMax";
import { createJobService } from "../factories";

dayjs.extend(quarterOfYear);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(minMax);

const MX_TIMEZONE = "America/Mexico_City";

const SERVICE_TYPES = {
  COMPLEX_SURGERY: {
    name: "cirugía",
    minPrice: 2500,
  },
  SURGERY: {
    name: "cirugía",
  },
  SURGERY_ASSISTANCE: {
    names: ["primer ayudante", "anestesista"],
  },
  CONSULTATION: {
    names: [
      "consulta",
      "consulta no convencionales",
      "especialista",
      "revisión",
      "revisión especialista",
    ],
  },
  VACCINE: {
    name: "vacuna",
  },
} as const;

interface ServiceStats {
  complexSurgeries: number;
  surgeries: number;
  surgeryAssistances: number;
  consultations: number;
  vaccines: number;
  totalServices: number;
  amount?: number;
}

export class CommissionAllocationService extends BaseService<
  CommissionAllocationEntity,
  CommissionAllocationDTO
> {
  private readonly collaboratorService = createCollaboratorService();
  private readonly jobService = createJobService();

  constructor(protected readonly repository: CommissionAllocationRepository) {
    super(repository, CommissionAllocationEntity);
  }

  public getCommissionsStats = async (
    queryOptions: CustomQueryOptions
  ): Promise<CommissionsStats> => {
    const { filteringDto } = queryOptions;
    const date = filteringDto?.date || new Date().toISOString();
    const { period } = filteringDto as any;

    if (!date || !period) {
      throw BaseError.badRequest("Date and period are required");
    }

    const { $gte: startDate, $lte: endDate } = date;
    const periodData = getCommissionsStatsPeriodsByPeriodAndDates(
      period,
      startDate,
      endDate
    );

    const allocations = await this.getAll(
      buildQueryOptions({
        date: {
          $gte: periodData.extendedStartDate,
          $lte: periodData.extendedEndDate,
        },
        projection: {
          date: 1,
          branch: 1,
          ticketNumber: 1,
          "services.serviceId": 1,
          "services.serviceName": 1,
          "services.modality": 1,
          "services.bonusType": 1,
          "services.basePrice": 1,
          "services.commissions.collaboratorId": 1,
          "services.commissions.collaboratorCode": 1,
          "services.commissions.commissionName": 1,
          "services.commissions.commissionType": 1,
          "services.commissions.commissionAmount": 1,
          "services.commissions._id": 1,
        },
      })
    );

    const flattenedCommissions = this.flatCommissions(allocations, period);
    const periodCommissions = this.filterCommissionsByPeriod(
      flattenedCommissions,
      periodData
    );

    return {
      startDate: periodData.periodStartDate.toISOString(),
      endDate: periodData.periodEndDate.toISOString(),
      periodStats: {
        global: this.getGlobalStats(periodCommissions),
        periodStatsByCollaborator:
          this.getPeriodStatsByCollaborator(periodCommissions),
        periodServicesByCollaborator:
          this.getCollaboratorServicesData(periodCommissions),
      },
      globalData: this.getChartDataOptimized(flattenedCommissions, periodData),
    };
  };

  public getCommissionPromotionStats = async (
    queryOptions: CustomQueryOptions
  ): Promise<CommissionsPromotionStats> => {
    const { filteringDto } = queryOptions;
    const date = filteringDto?.date || new Date().toISOString();

    if (!date) {
      throw BaseError.badRequest("Date is required");
    }

    const { $gte: startDate, $lte: endDate } = date;
    const quarterStartDate = dayjs.tz(startDate, MX_TIMEZONE).toDate();
    const quarterEndDate = dayjs.tz(endDate, MX_TIMEZONE).toDate();
    const extendedStartDate = dayjs
      .tz(quarterEndDate, MX_TIMEZONE)
      .subtract(4, "years")
      .add(1, "millisecond")
      .toDate();
    const extendedEndDate = quarterEndDate;

    const [allocations, unsortedCollaborators, jobs] = await Promise.all([
      this.getAll(
        buildQueryOptions({
          date: {
            $gte: extendedStartDate,
            $lte: extendedEndDate,
          },
          projection: {
            date: 1,
            branch: 1,
            ticketNumber: 1,
            "services.serviceId": 1,
            "services.serviceName": 1,
            "services.modality": 1,
            "services.bonusType": 1,
            "services.basePrice": 1,
            "services.commissions.collaboratorId": 1,
            "services.commissions.collaboratorCode": 1,
            "services.commissions.commissionName": 1,
            "services.commissions.commissionType": 1,
            "services.commissions.commissionAmount": 1,
            "services.commissions._id": 1,
          },
        })
      ),
      this.collaboratorService?.getCollaboratorsWithJobAndEmployment?.(
        extendedEndDate.toISOString()
      ) || [],
      this.jobService.getAll({
        filteringDto: { active: true },
      }),
    ]);

    const collaborators = unsortedCollaborators.sort((a, b) => {
      const dateA = new Date(a.collaborator?.startDate || 0);
      const dateB = new Date(b.collaborator?.startDate || 0);
      return dateA.getTime() - dateB.getTime();
    });

    const flattenedCommissions = this.flatCommissions(allocations, "quarter");
    const nextPositionTitles = new Map(
      jobs
        .filter((job) => job.id !== undefined)
        .map((job) => [job.id!.toString(), job.title])
    );

    const processedData = this.preprocessCommissionData(
      flattenedCommissions,
      collaborators,
      quarterStartDate,
      quarterEndDate,
      nextPositionTitles
    );

    return {
      general: {
        quarterly: processedData.quarterlyStats,
        historical: processedData.historicalStats,
      },
      individual: processedData.individualStats,
    };
  };

  public getCollaboratorCommissionStats = async (
    collaboratorId: string,
    queryOptions: CustomQueryOptions
  ): Promise<CollaboratorCommissionStats> => {
    const { filteringDto } = queryOptions;
    const date = filteringDto?.date || new Date().toISOString();
    const { period } = filteringDto as any;

    if (!date || !period) {
      throw BaseError.badRequest("Date and period are required");
    }

    const { $gte: startDate, $lte: endDate } = date;
    const periodData = getCommissionsStatsPeriodsByPeriodAndDates(
      period,
      startDate,
      endDate
    );

    // Get allocations for this collaborator
    const allocations = await this.getAll(
      buildQueryOptions({
        date: {
          $gte: periodData.extendedStartDate,
          $lte: periodData.extendedEndDate,
        },
        "services.commissions.collaboratorId": collaboratorId,
        projection: {
          date: 1,
          branch: 1,
          ticketNumber: 1,
          "services.serviceId": 1,
          "services.serviceName": 1,
          "services.modality": 1,
          "services.bonusType": 1,
          "services.basePrice": 1,
          "services.commissions.collaboratorId": 1,
          "services.commissions.collaboratorCode": 1,
          "services.commissions.commissionName": 1,
          "services.commissions.commissionType": 1,
          "services.commissions.commissionAmount": 1,
          "services.commissions._id": 1,
        },
      })
    );

    const flattenedCommissions = this.flatCommissions(allocations, period);

    // Filter to only this specific collaborator's commissions
    const collaboratorCommissions =
      flattenedCommissions.filter(
        (commission) => commission.collaboratorId === collaboratorId
      ) ?? [];

    const collaborator = await this.collaboratorService?.getById?.(
      collaboratorId
    );
    if (!collaborator) {
      throw BaseError.notFound("Collaborator not found");
    }

    const collaboratorCode = collaborator.col_code;

    const periodCommissions = this.filterCommissionsByPeriod(
      collaboratorCommissions,
      periodData
    );

    return {
      collaboratorId,
      collaboratorCode,
      startDate: periodData.periodStartDate.toISOString(),
      endDate: periodData.periodEndDate.toISOString(),
      period: this.buildCollaboratorPeriodStats(periodCommissions),
      results: this.buildCollaboratorResultsStats(
        collaboratorCommissions,
        periodData
      ),
      periodCommissions: periodCommissions,
    };
  };

  private preprocessCommissionData(
    commissions: CommissionAllocationFlattedVO[],
    collaborators: any[],
    quarterStartDate: Date,
    quarterEndDate: Date,
    nextPositionTitles: Map<string, string>
  ) {
    // Create a Set of target collaborator IDs for fast lookup
    const targetCollaboratorIds = new Set(
      collaborators.map((col) => col.collaborator.id)
    );

    // Filter commissions early to only include target collaborators
    const relevantCommissions = commissions.filter((commission) =>
      targetCollaboratorIds.has(commission.collaboratorId)
    );

    // Group commissions by collaborator ID once
    const commissionsByCollaborator = new Map<
      string,
      {
        quarterly: CommissionAllocationFlattedVO[];
        historical: CommissionAllocationFlattedVO[];
      }
    >();

    // Pre-convert dates to timestamps for faster comparison
    const quarterStartTime = quarterStartDate.getTime();
    const quarterEndTime = quarterEndDate.getTime();

    // Single pass through relevant commissions only
    relevantCommissions.forEach((commission) => {
      // Use native Date comparison instead of dayjs for better performance
      const commissionTime = new Date(commission.date).getTime();
      const isInQuarter =
        commissionTime > quarterStartTime && commissionTime < quarterEndTime;

      if (!commissionsByCollaborator.has(commission.collaboratorId)) {
        commissionsByCollaborator.set(commission.collaboratorId, {
          quarterly: [],
          historical: [],
        });
      }

      const data = commissionsByCollaborator.get(commission.collaboratorId)!;
      data.historical.push(commission);
      if (isInQuarter) {
        data.quarterly.push(commission);
      }
    });

    // Process each collaborator once
    const quarterlyStats: any[] = [];
    const historicalStats: any[] = [];
    const individualStats: any[] = [];

    collaborators.forEach((col) => {
      const { quarterly, historical } = commissionsByCollaborator.get(
        col.collaborator.id
      ) || { quarterly: [], historical: [] };

      const quarterlyServiceStats = this.calculateServiceStats(quarterly);
      const historicalServiceStats = this.calculateServiceStats(historical);

      const baseCollaboratorData = {
        collaborator: col.collaborator.col_code,
        positionName: col.job?.title || "Unknown",
        nextPositionName: col.job?.promotionJobId
          ? nextPositionTitles.get(col.job.promotionJobId.toString()) ||
            "Unknown"
          : "N/A",
      };

      // Quarterly stats
      quarterlyStats.push({
        ...baseCollaboratorData,
        ...quarterlyServiceStats,
      });

      // Historical stats
      historicalStats.push({
        ...baseCollaboratorData,
        ...historicalServiceStats,
      });

      // Individual stats
      const requirements = col.job?.quarterPromotionRequirements || {
        complexSurgeries: 0,
        surgeries: 0,
        surgeryAssistances: 0,
        consultations: 0,
        vaccines: 0,
        totalServices: 0,
      };

      const historicalRequirements =
        col.job?.historicalPromotionRequirements || requirements;

      individualStats.push({
        ...baseCollaboratorData,
        metricsTable: this.buildMetricsTable(
          quarterlyServiceStats,
          historicalServiceStats,
          requirements,
          historicalRequirements
        ),
        progressChart: this.generateQuarterlyServiceStatsOptimized(
          historical,
          quarterStartDate,
          quarterEndDate
        ),
      });
    });

    return {
      quarterlyStats,
      historicalStats,
      individualStats,
    };
  }

  private generateQuarterlyServiceStatsOptimized(
    commissions: CommissionAllocationFlattedVO[],
    startDate: Date,
    endDate: Date
  ): PromotionChartPeriod[] {
    // Pre-group commissions by quarter in a single pass using native Date operations
    const commissionsByQuarter = new Map<
      string,
      CommissionAllocationFlattedVO[]
    >();

    commissions.forEach((commission) => {
      const commissionDate = new Date(commission.date);
      const year = commissionDate.getFullYear();
      const month = commissionDate.getMonth(); // 0-based
      const quarter = Math.floor(month / 3) + 1;
      const quarterKey = `${quarter}-${year}`;

      if (!commissionsByQuarter.has(quarterKey)) {
        commissionsByQuarter.set(quarterKey, []);
      }
      commissionsByQuarter.get(quarterKey)!.push(commission);
    });

    // Generate 13 quarters of data using native Date operations
    const periods: PromotionChartPeriod[] = [];
    let currentDate = new Date(startDate);
    currentDate.setMonth(Math.floor(currentDate.getMonth() / 3) * 3); // Start of quarter
    currentDate.setDate(1);

    for (let i = 0; i < 13; i++) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const quarter = Math.floor(month / 3) + 1;
      const quarterKey = `${quarter}-${year}`;
      const periodCommissions = commissionsByQuarter.get(quarterKey) || [];

      periods.push({
        period: `Q${quarter} ${year}`,
        data: this.calculateServiceStats(periodCommissions, true),
      });

      // Move to previous quarter
      currentDate.setMonth(currentDate.getMonth() - 3);
    }

    return periods.reverse();
  }

  private calculateCollaboratorStats(
    collaborators: any[],
    commissions: CommissionAllocationFlattedVO[],
    startDate: Date,
    endDate: Date,
    nextPositionTitles: Map<string, string>
  ) {
    // Pre-group commissions by collaborator ID for O(1) lookup
    const commissionsByCollaborator = new Map<
      string,
      CommissionAllocationFlattedVO[]
    >();
    commissions.forEach((commission) => {
      const existing =
        commissionsByCollaborator.get(commission.collaboratorId) || [];
      existing.push(commission);
      commissionsByCollaborator.set(commission.collaboratorId, existing);
    });

    return collaborators.map((col) => {
      const collaboratorCommissions =
        commissionsByCollaborator.get(col.collaborator.id) || [];

      // Filter by date range once
      const filteredCommissions = collaboratorCommissions.filter(
        (c) =>
          dayjs.tz(c.date, MX_TIMEZONE).isAfter(startDate) &&
          dayjs.tz(c.date, MX_TIMEZONE).isBefore(endDate)
      );

      const stats = this.calculateServiceStats(filteredCommissions);

      return {
        collaborator: col.collaborator.col_code,
        positionName: col.job?.title || "Unknown",
        nextPositionName: col.job?.promotionJobId
          ? nextPositionTitles.get(col.job.promotionJobId.toString()) ||
            "Unknown"
          : "N/A",
        ...stats,
      };
    });
  }

  private buildMetricsTable(
    quarterlyStats: ServiceStats,
    historicalStats: ServiceStats,
    requirements: any,
    historicalRequirements: any
  ): PromotionMetricRow[] {
    return [
      {
        concept: "Complex Surgeries",
        quarterly: this.calculateMetric(
          quarterlyStats.complexSurgeries,
          requirements.complexSurgeries
        ),
        historical: this.calculateMetric(
          historicalStats.complexSurgeries,
          historicalRequirements.complexSurgeries
        ),
      },
      {
        concept: "Surgeries",
        quarterly: this.calculateMetric(
          quarterlyStats.surgeries,
          requirements.surgeries
        ),
        historical: this.calculateMetric(
          historicalStats.surgeries,
          historicalRequirements.surgeries
        ),
      },
      {
        concept: "Surgery Assistances",
        quarterly: this.calculateMetric(
          quarterlyStats.surgeryAssistances,
          requirements.surgeryAssistances
        ),
        historical: this.calculateMetric(
          historicalStats.surgeryAssistances,
          historicalRequirements.surgeryAssistances
        ),
      },
      {
        concept: "Consultations",
        quarterly: this.calculateMetric(
          quarterlyStats.consultations,
          requirements.consultations
        ),
        historical: this.calculateMetric(
          historicalStats.consultations,
          historicalRequirements.consultations
        ),
      },
      {
        concept: "Vaccines",
        quarterly: this.calculateMetric(
          quarterlyStats.vaccines,
          requirements.vaccines
        ),
        historical: this.calculateMetric(
          historicalStats.vaccines,
          historicalRequirements.vaccines
        ),
      },
      {
        concept: "Total Services",
        quarterly: this.calculateMetric(
          quarterlyStats.totalServices,
          requirements.totalServices
        ),
        historical: this.calculateMetric(
          historicalStats.totalServices,
          historicalRequirements.totalServices
        ),
      },
    ];
  }

  private calculateMetric(performed: number, required: number) {
    return {
      performed,
      required,
      percentage: required
        ? Math.round((performed / required) * 100 * 10) / 10
        : 0,
    };
  }

  private filterCommissionsByPeriod(
    commissions: CommissionAllocationFlattedVO[],
    periodData: PeriodData
  ) {
    const startTime = periodData.periodStartDate.getTime();
    const endTime = periodData.periodEndDate.getTime();

    return commissions.filter((commission) => {
      const commissionTime = commission.date.getTime();
      return commissionTime >= startTime && commissionTime <= endTime;
    });
  }

  private calculateServiceStats(
    commissions: CommissionAllocationFlattedVO[],
    excludeAmount: boolean = false
  ): ServiceStats {
    const stats: ServiceStats = {
      complexSurgeries: 0,
      surgeries: 0,
      surgeryAssistances: 0,
      consultations: 0,
      vaccines: 0,
      totalServices: 0,
      ...(excludeAmount ? {} : { amount: 0 }),
    };

    commissions.forEach((commission) => {
      if (!excludeAmount && stats.amount !== undefined) {
        stats.amount = Number(
          (stats.amount + commission.commissionAmount).toFixed(2)
        );
      }

      if (
        commission.commissionType === CommissionType.MENTOREE ||
        commission.commissionType === CommissionType.SIMPLE
      ) {
        this.updateServiceStats(stats, commission);
      }
    });

    return stats;
  }

  private updateServiceStats(
    stats: ServiceStats,
    commission: CommissionAllocationFlattedVO
  ) {
    const serviceName = commission.serviceName.toLowerCase();

    if (
      serviceName.includes(SERVICE_TYPES.COMPLEX_SURGERY.name) &&
      commission.basePrice > SERVICE_TYPES.COMPLEX_SURGERY.minPrice
    ) {
      stats.complexSurgeries += commission.quantity;
    } else if (serviceName.includes(SERVICE_TYPES.SURGERY.name)) {
      stats.surgeries += commission.quantity;
    } else if (
      SERVICE_TYPES.SURGERY_ASSISTANCE.names.some((name) =>
        serviceName.includes(name)
      )
    ) {
      stats.surgeryAssistances += commission.quantity;
    } else if (
      SERVICE_TYPES.CONSULTATION.names.some((name) =>
        serviceName.includes(name)
      )
    ) {
      stats.consultations += commission.quantity;
    } else if (serviceName.includes(SERVICE_TYPES.VACCINE.name)) {
      stats.vaccines += commission.quantity;
    }

    stats.totalServices += commission.quantity;
  }

  private getGlobalStats(commissions: CommissionAllocationFlattedVO[]) {
    const stats = this.calculateServiceStats(commissions);
    return {
      numCommissions: commissions.length,
      numServices: stats.totalServices,
      totalAmount: stats.amount || 0,
    };
  }

  private getPeriodStatsByCollaborator(
    commissions: CommissionAllocationFlattedVO[]
  ): PeriodCollaboratorStats[] {
    const resultMap = new Map<
      string,
      {
        collaboratorId: string;
        collaboratorCode: string;
        commissionAmount: number;
        commissionCount: number;
      }
    >();

    commissions.forEach((commission) => {
      const key = commission.collaboratorId;

      if (!resultMap.has(key)) {
        resultMap.set(key, {
          collaboratorId: commission.collaboratorId,
          collaboratorCode: commission.collaboratorCode,
          commissionAmount: 0,
          commissionCount: 0,
        });
      }

      const collaboratorData = resultMap.get(key)!;
      collaboratorData.commissionAmount = Number(
        (
          collaboratorData.commissionAmount + commission.commissionAmount
        ).toFixed(2)
      );
      collaboratorData.commissionCount += commission.quantity;
    });

    return Array.from(resultMap.values()).sort(
      (a, b) => b.commissionAmount - a.commissionAmount
    );
  }

  private getCollaboratorServicesData(
    commissions: CommissionAllocationFlattedVO[]
  ) {
    const serviceMap = this.buildServiceMap(commissions);
    const totalsByCollaborator = this.buildCollaboratorTotals(commissions);

    const services = this.sortServicesByCommissionCount(
      serviceMap,
      commissions
    );
    const totalRow = this.buildTotalRow(totalsByCollaborator);

    return [...services, totalRow];
  }

  private buildServiceMap(commissions: CommissionAllocationFlattedVO[]) {
    const resultMap = new Map<
      string,
      {
        serviceId: string;
        serviceName: string;
        collaborators: {
          collaboratorCode: string;
          collaboratorId: string;
          commissionAmount: number;
          servicesCount: number;
        }[];
      }
    >();

    commissions.forEach((commission) => {
      if (!resultMap.has(commission.serviceId)) {
        resultMap.set(commission.serviceId, {
          serviceId: commission.serviceId,
          serviceName: commission.serviceName,
          collaborators: [],
        });
      }

      const serviceData = resultMap.get(commission.serviceId)!;
      this.updateOrAddCollaborator(serviceData, commission);
    });

    return resultMap;
  }

  private updateOrAddCollaborator(
    serviceData: { collaborators: any[] },
    commission: CommissionAllocationFlattedVO
  ) {
    const existingCollaborator = serviceData.collaborators.find(
      (c) => c.collaboratorCode === commission.collaboratorCode
    );

    const isCommissionable = this.isCommissionableService(
      commission.commissionType
    );

    if (!existingCollaborator) {
      serviceData.collaborators.push({
        collaboratorCode: commission.collaboratorCode,
        collaboratorId: commission.collaboratorId,
        commissionAmount: Number(commission.commissionAmount.toFixed(2)),
        servicesCount: isCommissionable ? commission.quantity : 0,
      });
    } else {
      existingCollaborator.commissionAmount = Number(
        (
          existingCollaborator.commissionAmount + commission.commissionAmount
        ).toFixed(2)
      );
      if (isCommissionable) {
        existingCollaborator.servicesCount += commission.quantity;
      }
    }
  }

  private buildCollaboratorTotals(
    commissions: CommissionAllocationFlattedVO[]
  ) {
    const totalsByCollaborator = new Map<
      string,
      {
        collaboratorCode: string;
        collaboratorId: string;
        commissionAmount: number;
        servicesCount: number;
      }
    >();

    commissions.forEach((commission) => {
      const isCommissionable = this.isCommissionableService(
        commission.commissionType
      );

      if (!totalsByCollaborator.has(commission.collaboratorCode)) {
        totalsByCollaborator.set(commission.collaboratorCode, {
          collaboratorCode: commission.collaboratorCode,
          collaboratorId: commission.collaboratorId,
          commissionAmount: Number(commission.commissionAmount.toFixed(2)),
          servicesCount: isCommissionable ? commission.quantity : 0,
        });
      } else {
        const totalData = totalsByCollaborator.get(
          commission.collaboratorCode
        )!;
        totalData.commissionAmount = Number(
          (totalData.commissionAmount + commission.commissionAmount).toFixed(2)
        );
        if (isCommissionable) {
          totalData.servicesCount += commission.quantity;
        }
      }
    });

    return totalsByCollaborator;
  }

  private sortServicesByCommissionCount(
    serviceMap: Map<string, any>,
    commissions: CommissionAllocationFlattedVO[]
  ) {
    return Array.from(serviceMap.values())
      .map((service) => ({
        ...service,
        collaborators: service.collaborators.sort(
          (a: any, b: any) => b.servicesCount - a.servicesCount
        ),
      }))
      .sort((a, b) => {
        const totalAmountA = a.collaborators.reduce(
          (sum: number, col: any) => sum + col.commissionAmount,
          0
        );
        const totalAmountB = b.collaborators.reduce(
          (sum: number, col: any) => sum + col.commissionAmount,
          0
        );
        return totalAmountB - totalAmountA;
      });
  }

  private buildTotalRow(totalsByCollaborator: Map<string, any>) {
    return {
      serviceId: "TOTAL",
      serviceName: "TOTAL",
      collaborators: Array.from(totalsByCollaborator.values()).sort(
        (a, b) => b.commissionAmount - a.commissionAmount
      ),
    };
  }

  private isCommissionableService(commissionType: CommissionType): boolean {
    return (
      commissionType === CommissionType.SIMPLE ||
      commissionType === CommissionType.MENTOREE
    );
  }

  private getChartDataOptimized(
    commissions: CommissionAllocationFlattedVO[],
    periodData: PeriodData
  ): {
    commissionsAmountTable: CommissionsTableRow[];
    commissionsNumberTable: CommissionsTableRow[];
  } {
    const { period } = periodData;
    const amountMap = new Map<string, CommissionsTableRow>();
    const countMap = new Map<string, CommissionsTableRow>();

    // Process all commissions in a single pass
    commissions.forEach((commission) => {
      const periodKey = getMxPeriodKey(commission.date, period);
      const collaboratorCode = commission.collaboratorCode;
      const commissionAmount = commission.commissionAmount;

      // Amount data - optimized
      let amountPeriodData = amountMap.get(periodKey);
      if (!amountPeriodData) {
        amountPeriodData = { period: periodKey };
        amountMap.set(periodKey, amountPeriodData);
      }

      const currentAmount = (amountPeriodData[collaboratorCode] as number) || 0;
      amountPeriodData[collaboratorCode] = parseFloat(
        (currentAmount + commissionAmount).toFixed(2)
      );

      // Count data - optimized
      let countPeriodData = countMap.get(periodKey);
      if (!countPeriodData) {
        countPeriodData = { period: periodKey };
        countMap.set(periodKey, countPeriodData);
      }

      const currentCount = (countPeriodData[collaboratorCode] as number) || 0;
      countPeriodData[collaboratorCode] = currentCount + commission.quantity;
    });

    return {
      commissionsAmountTable: this.sortAndProcessDataOptimized(amountMap),
      commissionsNumberTable: this.sortAndProcessDataOptimized(countMap),
    };
  }

  private sortAndProcessDataOptimized(
    dataMap: Map<string, CommissionsTableRow>
  ) {
    // Convert to array and sort by date
    const sortedEntries = Array.from(dataMap.entries()).sort(
      ([periodA], [periodB]) => {
        return new Date(periodA).getTime() - new Date(periodB).getTime();
      }
    );

    return sortedEntries.map(([, periodData]) => {
      // Get all collaborator entries and sort by amount/count
      const collaboratorEntries = Object.entries(periodData)
        .filter(([key]) => key !== "period")
        .sort(
          ([, amountA], [, amountB]) =>
            (amountB as number) - (amountA as number)
        );

      // Build the sorted result
      const sortedPeriodData: CommissionsTableRow = {
        period: periodData.period,
      };
      collaboratorEntries.forEach(([key, value]) => {
        sortedPeriodData[key] = value;
      });

      return sortedPeriodData;
    });
  }

  private flatCommissions(
    commissions: CommissionAllocationEntity[],
    period: string
  ): CommissionAllocationFlattedVO[] {
    // Pre-calculate total size to avoid array reallocations
    let totalCommissions = 0;
    commissions.forEach((commission) => {
      commission.services.forEach((service) => {
        totalCommissions += service.commissions.length;
      });
    });

    const flattedCommissions: CommissionAllocationFlattedVO[] = new Array(
      totalCommissions
    );
    let index = 0;

    commissions.forEach((commission) => {
      const commissionDate = commission.date;
      const commissionBranch = commission.branch;
      const commissionTicketNumber = commission.ticketNumber;

      commission.services.forEach((service) => {
        const serviceId = service.serviceId;
        const serviceName = service.serviceName;
        const serviceModality = service.modality;
        const serviceBonusType = service.bonusType as CommissionBonusType;
        const serviceBasePrice = service.basePrice;

        service.commissions.forEach((nestedCommission) => {
          flattedCommissions[index++] = {
            date: commissionDate,
            branch: commissionBranch,
            ticketNumber: commissionTicketNumber,
            serviceId: serviceId,
            serviceName: serviceName,
            modality: serviceModality,
            bonusType: serviceBonusType,
            quantity: service.quantity,
            collaboratorId: nestedCommission.collaboratorId.toString(),
            collaboratorCode: nestedCommission.collaboratorCode,
            commissionName: nestedCommission.commissionName,
            commissionType: nestedCommission.commissionType,
            commissionAmount: nestedCommission.commissionAmount,
            id: nestedCommission.id?.toString()!,
            basePrice: serviceBasePrice,
          };
        });
      });
    });

    // Sort using a more efficient comparison
    return flattedCommissions.sort((a, b) => {
      return a.date.getTime() - b.date.getTime();
    });
  }

  private buildCollaboratorPeriodStats(
    periodCommissions: CommissionAllocationFlattedVO[]
  ) {
    const stats = this.calculateServiceStats(periodCommissions);

    // Services table - only commissionable services
    const servicesMap = new Map<string, { quantity: number; amount: number }>();
    periodCommissions.forEach((commission) => {
      if (this.isCommissionableService(commission.commissionType)) {
        const serviceName = commission.serviceName;
        if (!servicesMap.has(serviceName)) {
          servicesMap.set(serviceName, { quantity: 0, amount: 0 });
        }
        const service = servicesMap.get(serviceName)!;
        service.quantity += commission.quantity;
        service.amount = Number(
          (service.amount + commission.commissionAmount).toFixed(2)
        );
      }
    });

    const servicesTable = Array.from(servicesMap.entries())
      .map(([serviceName, data]) => ({
        serviceName,
        quantity: data.quantity,
        amount: data.amount,
      }))
      .sort((a, b) => b.amount - a.amount);

    // Commission percentages by type
    const totalAmount = stats.amount || 0;
    const typeAmounts = new Map<string, number>();
    const typeCounts = new Map<string, number>();

    periodCommissions.forEach((commission) => {
      const type = commission.commissionType;

      // Track amounts
      const currentAmount = typeAmounts.get(type) || 0;
      typeAmounts.set(type, currentAmount + commission.commissionAmount);

      // Track counts
      const currentCount = typeCounts.get(type) || 0;
      typeCounts.set(type, currentCount + commission.quantity);
    });

    // Calculate total count from ALL commission types, not just commissionable ones
    const totalCountAllTypes = Array.from(typeCounts.values()).reduce(
      (sum, count) => sum + count,
      0
    );

    const commissionPercentagesByType = Array.from(typeAmounts.entries()).map(
      ([type, amount]) => ({
        commissionType: type,
        percentage:
          totalCountAllTypes > 0
            ? Number(
                (
                  ((typeCounts.get(type) || 0) / totalCountAllTypes) *
                  100
                ).toFixed(2)
              )
            : 0,
        count: typeCounts.get(type) || 0,
        amount: Number(amount.toFixed(2)),
      })
    );

    return {
      globalAmounts: {
        numCommissions: periodCommissions.length,
        totalAmount: totalAmount,
      },
      servicesTable,
      commissionPercentagesByType,
    };
  }

  private buildCollaboratorResultsStats(
    collaboratorCommissions: CommissionAllocationFlattedVO[],
    periodData: PeriodData
  ) {
    // Historical commission amounts chart
    const historicalCommissionsAmount = this.buildHistoricalChart(
      collaboratorCommissions,
      periodData,
      "amount"
    );

    // Historical services number chart (mentoree and normal only)
    const mentoreeAndNormalCommissions = collaboratorCommissions.filter(
      (commission) =>
        commission.commissionType === CommissionType.MENTOREE ||
        commission.commissionType === CommissionType.SIMPLE
    );
    const historicalServicesNumber = this.buildHistoricalChart(
      mentoreeAndNormalCommissions,
      periodData,
      "count"
    );

    // Historical career services chart (similar to promotion stats)
    const historicalCareerServices = this.buildCareerServicesChart(
      mentoreeAndNormalCommissions,
      periodData
    );

    // Historical commission types chart
    const historicalCommissionTypes = this.buildCommissionTypesChart(
      collaboratorCommissions,
      periodData
    );

    return {
      historicalCommissionsAmountChart: historicalCommissionsAmount,
      historicalServicesNumberChart: historicalServicesNumber,
      historicalCareerServicesChart: historicalCareerServices,
      historicalCommissionTypeChart: historicalCommissionTypes,
    };
  }

  private buildCollaboratorPeriodCommissions(
    periodCommissions: CommissionAllocationFlattedVO[]
  ) {
    return periodCommissions.map((commission) => ({
      id: commission.id,
      date: commission.date.toISOString(),
      ticketNumber: commission.ticketNumber,
      serviceName: commission.serviceName,
      commissionType: commission.commissionType,
      commissionAmount: commission.commissionAmount,
      basePrice: commission.basePrice,
    }));
  }

  private buildHistoricalChart(
    commissions: CommissionAllocationFlattedVO[],
    periodData: PeriodData,
    type: "amount" | "count"
  ) {
    const periodsMap = new Map<string, number>();

    commissions.forEach((commission) => {
      const periodKey = getMxPeriodKey(commission.date, periodData.period);
      const current = periodsMap.get(periodKey) || 0;

      if (type === "amount") {
        periodsMap.set(periodKey, current + commission.commissionAmount);
      } else {
        periodsMap.set(periodKey, current + commission.quantity);
      }
    });

    // Generate all periods in range
    const periods: { period: string; value: number }[] = [];
    const startDate = dayjs.tz(periodData.extendedStartDate, MX_TIMEZONE);
    const endDate = dayjs.tz(periodData.extendedEndDate, MX_TIMEZONE);

    if (periodData.period === "half-month") {
      // Special handling for half-month periods
      this.generateHalfMonthPeriods(startDate, endDate, periodsMap, periods);
    } else {
      // Standard period generation for other period types
      let currentDate = startDate.clone();
      const periodUnit =
        periodData.period === "quarter"
          ? "quarter"
          : periodData.period === "year"
          ? "year"
          : "month";

      while (
        currentDate.isBefore(endDate) ||
        currentDate.isSame(endDate, periodUnit as any)
      ) {
        const periodKey = getMxPeriodKey(
          currentDate.toDate(),
          periodData.period
        );
        periods.push({
          period: periodKey,
          value: Number((periodsMap.get(periodKey) || 0).toFixed(2)),
        });
        currentDate = currentDate.add(1, periodUnit as any);
      }
    }

    return periods;
  }

  private generateHalfMonthPeriods(
    startDate: dayjs.Dayjs,
    endDate: dayjs.Dayjs,
    periodsMap: Map<string, number>,
    periods: { period: string; value: number }[]
  ) {
    let currentDate = startDate.clone().startOf("month");

    // Determine if we should start with first or second half of the month
    const startDay = startDate.date();
    let isSecondHalf = startDay > 15;

    // If starting date is after 15th, start with second half
    if (isSecondHalf) {
      currentDate = currentDate.date(16);
    } else {
      currentDate = currentDate.date(1);
    }

    while (currentDate.isSameOrBefore(endDate, "day")) {
      const periodKey = getMxPeriodKey(currentDate.toDate(), "half-month");
      periods.push({
        period: periodKey,
        value: Number((periodsMap.get(periodKey) || 0).toFixed(2)),
      });

      // Move to next half-month
      if (currentDate.date() <= 15) {
        // Currently in first half, move to second half of same month
        currentDate = currentDate.date(16);
      } else {
        // Currently in second half, move to first half of next month
        currentDate = currentDate.add(1, "month").date(1);
      }
    }
  }

  private buildCareerServicesChart(
    commissions: CommissionAllocationFlattedVO[],
    periodData: PeriodData
  ) {
    const periodsMap = new Map<string, ServiceStats>();

    commissions.forEach((commission) => {
      const periodKey = getMxPeriodKey(commission.date, periodData.period);
      if (!periodsMap.has(periodKey)) {
        periodsMap.set(periodKey, {
          complexSurgeries: 0,
          surgeries: 0,
          surgeryAssistances: 0,
          consultations: 0,
          vaccines: 0,
          totalServices: 0,
        });
      }

      const stats = periodsMap.get(periodKey)!;
      this.updateServiceStats(stats, commission);
    });

    // Generate all periods in range
    const periods: { period: string; data: ServiceStats }[] = [];
    const startDate = dayjs.tz(periodData.extendedStartDate, MX_TIMEZONE);
    const endDate = dayjs.tz(periodData.extendedEndDate, MX_TIMEZONE);

    if (periodData.period === "half-month") {
      // Special handling for half-month periods
      this.generateHalfMonthPeriodsForServiceStats(
        startDate,
        endDate,
        periodsMap,
        periods
      );
    } else {
      // Standard period generation for other period types
      let currentDate = startDate.clone();
      const periodUnit =
        periodData.period === "quarter"
          ? "quarter"
          : periodData.period === "year"
          ? "year"
          : "month";

      while (
        currentDate.isBefore(endDate) ||
        currentDate.isSame(endDate, periodUnit as any)
      ) {
        const periodKey = getMxPeriodKey(
          currentDate.toDate(),
          periodData.period
        );
        const stats = periodsMap.get(periodKey) || {
          complexSurgeries: 0,
          surgeries: 0,
          surgeryAssistances: 0,
          consultations: 0,
          vaccines: 0,
          totalServices: 0,
        };
        periods.push({
          period: periodKey,
          data: stats,
        });
        currentDate = currentDate.add(1, periodUnit as any);
      }
    }

    return periods;
  }

  private generateHalfMonthPeriodsForServiceStats(
    startDate: dayjs.Dayjs,
    endDate: dayjs.Dayjs,
    periodsMap: Map<string, ServiceStats>,
    periods: { period: string; data: ServiceStats }[]
  ) {
    let currentDate = startDate.clone().startOf("month");

    // Determine if we should start with first or second half of the month
    const startDay = startDate.date();
    let isSecondHalf = startDay > 15;

    // If starting date is after 15th, start with second half
    if (isSecondHalf) {
      currentDate = currentDate.date(16);
    } else {
      currentDate = currentDate.date(1);
    }

    while (currentDate.isSameOrBefore(endDate, "day")) {
      const periodKey = getMxPeriodKey(currentDate.toDate(), "half-month");
      const stats = periodsMap.get(periodKey) || {
        complexSurgeries: 0,
        surgeries: 0,
        surgeryAssistances: 0,
        consultations: 0,
        vaccines: 0,
        totalServices: 0,
      };
      periods.push({
        period: periodKey,
        data: stats,
      });

      // Move to next half-month
      if (currentDate.date() <= 15) {
        // Currently in first half, move to second half of same month
        currentDate = currentDate.date(16);
      } else {
        // Currently in second half, move to first half of next month
        currentDate = currentDate.add(1, "month").date(1);
      }
    }
  }

  private buildCommissionTypesChart(
    commissions: CommissionAllocationFlattedVO[],
    periodData: PeriodData
  ) {
    const periodsMap = new Map<string, Map<string, number>>();

    commissions.forEach((commission) => {
      const periodKey = getMxPeriodKey(commission.date, periodData.period);
      if (!periodsMap.has(periodKey)) {
        periodsMap.set(periodKey, new Map());
      }

      const typeMap = periodsMap.get(periodKey)!;
      const current = typeMap.get(commission.commissionType) || 0;
      typeMap.set(commission.commissionType, current + commission.quantity);
    });

    // Generate all periods in range
    const periods: any[] = [];
    const startDate = dayjs.tz(periodData.extendedStartDate, MX_TIMEZONE);
    const endDate = dayjs.tz(periodData.extendedEndDate, MX_TIMEZONE);

    if (periodData.period === "half-month") {
      // Special handling for half-month periods
      this.generateHalfMonthPeriodsForCommissionTypes(
        startDate,
        endDate,
        periodsMap,
        periods
      );
    } else {
      // Standard period generation for other period types
      let currentDate = startDate.clone();
      const periodUnit =
        periodData.period === "quarter"
          ? "quarter"
          : periodData.period === "year"
          ? "year"
          : "month";

      while (
        currentDate.isBefore(endDate) ||
        currentDate.isSame(endDate, periodUnit as any)
      ) {
        const periodKey = getMxPeriodKey(
          currentDate.toDate(),
          periodData.period
        );
        const typeMap = periodsMap.get(periodKey) || new Map();

        const periodDataRow: any = { period: periodKey };

        // Initialize all commission types with 0, then override with actual values
        Object.values(CommissionType).forEach((type) => {
          periodDataRow[type] = 0;
        });

        typeMap.forEach((count, type) => {
          periodDataRow[type] = count;
        });

        periods.push(periodDataRow);
        currentDate = currentDate.add(1, periodUnit as any);
      }
    }

    return periods;
  }

  private generateHalfMonthPeriodsForCommissionTypes(
    startDate: dayjs.Dayjs,
    endDate: dayjs.Dayjs,
    periodsMap: Map<string, Map<string, number>>,
    periods: any[]
  ) {
    let currentDate = startDate.clone().startOf("month");

    // Determine if we should start with first or second half of the month
    const startDay = startDate.date();
    let isSecondHalf = startDay > 15;

    // If starting date is after 15th, start with second half
    if (isSecondHalf) {
      currentDate = currentDate.date(16);
    } else {
      currentDate = currentDate.date(1);
    }

    while (currentDate.isSameOrBefore(endDate, "day")) {
      const periodKey = getMxPeriodKey(currentDate.toDate(), "half-month");
      const typeMap = periodsMap.get(periodKey) || new Map();

      const periodDataRow: any = { period: periodKey };

      // Initialize all commission types with 0, then override with actual values
      Object.values(CommissionType).forEach((type) => {
        periodDataRow[type] = 0;
      });

      typeMap.forEach((count, type) => {
        periodDataRow[type] = count;
      });

      periods.push(periodDataRow);

      // Move to next half-month
      if (currentDate.date() <= 15) {
        // Currently in first half, move to second half of same month
        currentDate = currentDate.date(16);
      } else {
        // Currently in second half, move to first half of next month
        currentDate = currentDate.add(1, "month").date(1);
      }
    }
  }

  public getCollaboratorHourlyCommissionAverage = async (
    collaboratorId: string,
    newStartingDate: string
  ): Promise<{
    collaboratorId: string;
    startDate: string;
    endDate: string;
    totalCommissions: number;
    totalHoursWorked: number;
    hourlyCommissionAverage: number;
  }> => {
    // Calculate end date (end of day before newStartingDate)
    const endDate = dayjs
      .tz(newStartingDate, MX_TIMEZONE)
      .subtract(1, "day")
      .endOf("day")
      .toDate();

    // Calculate start date (1 year before endDate, start of day)
    const startDate = dayjs
      .tz(endDate, MX_TIMEZONE)
      .subtract(1, "year")
      .add(1, "day")
      .startOf("day")
      .toDate();

    // Get all employments for the collaborator in the period
    const employments = await this.getEmploymentsByCollaboratorAndPeriod(
      collaboratorId,
      startDate.toISOString(),
      endDate.toISOString()
    );

    // Get all commissions for the collaborator in the period
    const commissions = await this.getCommissionsByCollaboratorAndPeriod(
      collaboratorId,
      startDate,
      endDate
    );

    // Calculate total hours worked
    const totalHoursWorked = this.calculateTotalHoursWorked(
      employments,
      startDate,
      endDate
    );

    // Calculate total commissions
    const totalCommissions = commissions.reduce(
      (sum, commission) => sum + commission.commissionAmount,
      0
    );

    // Calculate hourly commission average
    const hourlyCommissionAverage =
      totalHoursWorked > 0 ? totalCommissions / totalHoursWorked : 0;

    return {
      collaboratorId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      totalCommissions,
      totalHoursWorked,
      hourlyCommissionAverage,
    };
  };

  private async getEmploymentsByCollaboratorAndPeriod(
    collaboratorId: string,
    periodStartDate: string,
    periodEndDate: string
  ) {
    const employmentService = this.createEmploymentService();
    return await employmentService.getAll({
      filteringDto: {
        collaboratorId,
        employmentStartDate: { $lte: periodEndDate },
        $or: [
          { employmentEndDate: { $exists: false } },
          { employmentEndDate: { $gte: periodStartDate } },
        ],
      },
      sortingDto: {
        sort_by: "employmentStartDate",
        direction: "asc",
      },
    });
  }

  private async getCommissionsByCollaboratorAndPeriod(
    collaboratorId: string,
    startDate: Date,
    endDate: Date
  ) {
    const allocations = await this.getAll(
      buildQueryOptions({
        date: {
          $gte: startDate,
          $lte: endDate,
        },
        "services.commissions.collaboratorId": collaboratorId,
        projection: {
          date: 1,
          "services.commissions": 1,
        },
      })
    );

    // Flatten commissions for the specific collaborator
    const commissions: Array<{
      commissionAmount: number;
      date: Date;
    }> = [];

    for (const allocation of allocations) {
      for (const service of allocation.services || []) {
        for (const commission of service.commissions || []) {
          if (commission.collaboratorId === collaboratorId) {
            commissions.push({
              commissionAmount: commission.commissionAmount,
              date: allocation.date,
            });
          }
        }
      }
    }

    return commissions;
  }

  private calculateTotalHoursWorked(
    employments: any[],
    periodStartDate: Date,
    periodEndDate: Date
  ): number {
    let totalHours = 0;

    for (const employment of employments) {
      // Determine the actual start and end dates for this employment within the period
      const employmentStart = dayjs.max(
        dayjs(employment.employmentStartDate),
        dayjs(periodStartDate)
      );

      const employmentEnd = employment.employmentEndDate
        ? dayjs.min(dayjs(employment.employmentEndDate), dayjs(periodEndDate))
        : dayjs(periodEndDate);

      // Calculate number of weeks worked
      const weeksWorked = employmentEnd.diff(employmentStart, "week", true);

      // Calculate hours worked for this employment period
      const hoursWorked = weeksWorked * employment.weeklyHours;

      totalHours += Math.max(0, hoursWorked);
    }

    return totalHours;
  }

  private createEmploymentService() {
    // Import the factory function dynamically to avoid circular dependencies
    const { createEmploymentService } = require("../factories");
    return createEmploymentService();
  }

  public getResourceName(): string {
    return "commission-allocation";
  }
}
