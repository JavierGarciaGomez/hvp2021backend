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
import { CommissionsPromotionStats } from "../../domain/read-models/commission-promotion-stats.rm";
import dayjs from "dayjs";

export class CommissionAllocationService extends BaseService<
  CommissionAllocationEntity,
  CommissionAllocationDTO
> {
  private readonly collaboratorService = createCollaboratorService();
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

    const allocationQueryOptions = buildQueryOptions({
      date: {
        $gte: periodData.extendedStartDate,
        $lte: periodData.extendedEndDate,
      },
    });

    const allocations = await this.getAll(allocationQueryOptions);
    const flattenedCommissions = this.flatCommissions(allocations, period);
    const periodCommissions = flattenedCommissions.filter(
      (commission) =>
        commission.date >= periodData.periodStartDate &&
        commission.date <= periodData.periodEndDate
    );

    // DATA

    const globalStats = this.getGlobalStats(periodCommissions);
    const periodStatsByCollaborator =
      this.getPeriodStatsByCollaborator(periodCommissions);

    const periodServicesByCollaborator =
      this.getCollaboratorServicesData(periodCommissions);

    const { amountData, countData } = this.getChartData(
      flattenedCommissions,
      periodData
    );

    // get periods, startDate, endDate, extendedStartDate, extendedEndDate
    // get the right start and end date
    // get the commissions
    // transform the commissions to facilitate processing

    const result: CommissionsStats = {
      startDate: periodData.periodStartDate.toISOString(),
      endDate: periodData.periodEndDate.toISOString(),
      periodStats: {
        global: globalStats,
        periodStatsByCollaborator,
        periodServicesByCollaborator: periodServicesByCollaborator,
      },
      globalData: {
        commissionsAmountTable: amountData,
        commissionsNumberTable: countData,
      },
    };

    return result;
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

    const quarterStartDate = dayjs(startDate).toDate();
    const quarterEndDate = dayjs(endDate).toDate();
    const extendedStartDate = dayjs(quarterEndDate)
      .subtract(4, "years")
      .add(1, "millisecond")
      .toDate();
    const extendedEndDate = quarterEndDate;

    const allocationQueryOptions = buildQueryOptions({
      date: {
        $gte: extendedStartDate,
        $lte: extendedEndDate,
      },
    });

    console.log({
      quarterStartDate: quarterStartDate.toISOString(),
      extendedStartDate: extendedStartDate.toISOString(),
      extendedEndDate: extendedEndDate.toISOString(),
    });

    // const allocations = await this.getAll(allocationQueryOptions);

    // fetch active collaborators with job and employment
    const collaborators =
      await this.collaboratorService.getCollaboratorsWithJobAndEmployment(
        extendedEndDate.toISOString()
      );

    console.log({ collaborators });

    // fetch all jobs
    // generate the data

    // const flattenedCommissions = this.flatCommissions(allocations, "quarter");

    return {
      collaborators: collaborators.map((col) => {
        return {
          id: col.collaborator.id,
          code: col.collaborator.col_code,
          job: col.job?.id,
          jobName: col.job?.title,
          employment: col.employment?.id,
          employmentName: col.employment?.jobId,
        };
      }),
      // flattenedCommissions,
    } as any;
  };

  public getResourceName(): string {
    return "commission-allocation";
  }

  private flatCommissions(
    commissions: CommissionAllocationEntity[],
    period: string
  ): CommissionAllocationFlattedVO[] {
    const flattedCommissions = commissions.flatMap((commission) =>
      commission.services.flatMap((service) =>
        service.commissions.map((nestedCommission) => ({
          date: commission.date,
          branch: commission.branch,
          ticketNumber: commission.ticketNumber,
          serviceId: service.serviceId,
          serviceName: service.serviceName,
          modality: service.modality,
          bonusType: service.bonusType as CommissionBonusType,
          collaboratorId: nestedCommission.collaboratorId.toString(),
          collaboratorCode: nestedCommission.collaboratorCode,
          commissionName: nestedCommission.commissionName,
          commissionType: nestedCommission.commissionType,
          commissionAmount: nestedCommission.commissionAmount,
          id: nestedCommission.id?.toString()!,
          period: getMxPeriodKey(commission.date, period),
          basePrice: service.basePrice,
        }))
      )
    );

    return flattedCommissions.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  private getChartData(
    commissions: CommissionAllocationFlattedVO[],
    periodData: PeriodData
  ): { amountData: CommissionsTableRow[]; countData: CommissionsTableRow[] } {
    const { period } = periodData;

    const amountMap = new Map<string, CommissionsTableRow>();
    const countMap = new Map<string, CommissionsTableRow>();

    commissions.forEach((commission) => {
      const periodKey = getMxPeriodKey(commission.date, period);

      // Amount data
      if (!amountMap.has(periodKey)) {
        amountMap.set(periodKey, { period: periodKey });
      }
      const amountPeriodData = amountMap.get(periodKey)!;
      if (!amountPeriodData[commission.collaboratorCode]) {
        amountPeriodData[commission.collaboratorCode] = 0;
      }
      amountPeriodData[commission.collaboratorCode] = parseFloat(
        (
          (amountPeriodData[commission.collaboratorCode] as number) +
          commission.commissionAmount
        ).toFixed(2)
      );

      // Count data
      if (!countMap.has(periodKey)) {
        countMap.set(periodKey, { period: periodKey });
      }
      const countPeriodData = countMap.get(periodKey)!;
      if (!countPeriodData[commission.collaboratorCode]) {
        countPeriodData[commission.collaboratorCode] = 0;
      }
      countPeriodData[commission.collaboratorCode] =
        (countPeriodData[commission.collaboratorCode] as number) + 1;
    });

    // Sort both datasets the same way
    const sortAndProcess = (dataMap: Map<string, CommissionsTableRow>) => {
      const sorted = Array.from(dataMap.values()).sort(
        (a, b) =>
          new Date(a.period as string).getTime() -
          new Date(b.period as string).getTime()
      );

      sorted.forEach((periodData, index) => {
        const entries = Object.entries(periodData)
          .filter(([key]) => key !== "period")
          .sort(
            ([, amountA], [, amountB]) =>
              (amountB as number) - (amountA as number)
          );

        // Create new object with sorted properties
        const sortedPeriodData: CommissionsTableRow = {
          period: periodData.period,
        };

        entries.forEach(([key, value]) => {
          sortedPeriodData[key] = value;
        });

        sorted[index] = sortedPeriodData;
      });

      return sorted;
    };

    return {
      amountData: sortAndProcess(amountMap),
      countData: sortAndProcess(countMap),
    };
  }

  private getPeriodStatsByCollaborator = (
    flattenedCommissions: CommissionAllocationFlattedVO[]
  ): PeriodCollaboratorStats[] => {
    const resultMap = new Map<
      string,
      {
        collaboratorId: string;
        collaboratorCode: string;
        commissionAmount: number;
        commissionCount: number;
      }
    >();

    flattenedCommissions.forEach((commission) => {
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

    const array = Array.from(resultMap.values()).sort(
      (a, b) => b.commissionAmount - a.commissionAmount
    );

    return array;
  };

  private getCollaboratorServicesData = (
    flattenedCommissions: CommissionAllocationFlattedVO[]
  ) => {
    const serviceMap = this.buildServiceMap(flattenedCommissions);
    const totalsByCollaborator =
      this.buildCollaboratorTotals(flattenedCommissions);

    const services = this.sortServicesByCommissionCount(
      serviceMap,
      flattenedCommissions
    );
    const totalRow = this.buildTotalRow(totalsByCollaborator);

    return [...services, totalRow];
  };

  private buildServiceMap(
    flattenedCommissions: CommissionAllocationFlattedVO[]
  ) {
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

    flattenedCommissions.forEach((commission) => {
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
    flattenedCommissions: CommissionAllocationFlattedVO[]
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

    flattenedCommissions.forEach((commission) => {
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
    flattenedCommissions: CommissionAllocationFlattedVO[]
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

  private isCommissionableService = (
    commissionType: CommissionType
  ): boolean => {
    return (
      commissionType === CommissionType.SIMPLE ||
      commissionType === CommissionType.MENTOREE
    );
  };

  private getGlobalStats = (commissions: CommissionAllocationFlattedVO[]) => {
    const globalStats = {
      numCommissions: 0,
      numServices: 0,
      totalAmount: 0,
    };

    commissions.forEach((commission) => {
      globalStats.numCommissions += 1;
      if (this.isCommissionableService(commission.commissionType)) {
        globalStats.numServices += 1;
      }
      globalStats.totalAmount = Number(
        (globalStats.totalAmount + commission.commissionAmount).toFixed(2)
      );
    });

    return globalStats;
  };
}
