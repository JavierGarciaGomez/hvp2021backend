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
import dayjs from "dayjs";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { createJobService } from "../factories";

dayjs.extend(quarterOfYear);
dayjs.extend(utc);
dayjs.extend(timezone);

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
      this.collaboratorService.getCollaboratorsWithJobAndEmployment(
        extendedEndDate.toISOString()
      ),
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
      stats.complexSurgeries++;
    } else if (serviceName.includes(SERVICE_TYPES.SURGERY.name)) {
      stats.surgeries++;
    } else if (
      SERVICE_TYPES.SURGERY_ASSISTANCE.names.some((name) =>
        serviceName.includes(name)
      )
    ) {
      stats.surgeryAssistances++;
    } else if (
      SERVICE_TYPES.CONSULTATION.names.some((name) =>
        serviceName.includes(name)
      )
    ) {
      stats.consultations++;
    } else if (serviceName.includes(SERVICE_TYPES.VACCINE.name)) {
      stats.vaccines++;
    }

    stats.totalServices++;
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
      collaboratorData.commissionCount += 1;
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
        servicesCount: isCommissionable ? 1 : 0,
      });
    } else {
      existingCollaborator.commissionAmount = Number(
        (
          existingCollaborator.commissionAmount + commission.commissionAmount
        ).toFixed(2)
      );
      if (isCommissionable) {
        existingCollaborator.servicesCount += 1;
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
          servicesCount: isCommissionable ? 1 : 0,
        });
      } else {
        const totalData = totalsByCollaborator.get(
          commission.collaboratorCode
        )!;
        totalData.commissionAmount = Number(
          (totalData.commissionAmount + commission.commissionAmount).toFixed(2)
        );
        if (isCommissionable) {
          totalData.servicesCount += 1;
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
      countPeriodData[collaboratorCode] = currentCount + 1;
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

  public getResourceName(): string {
    return "commission-allocation";
  }
}
