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
import { CommissionsStats } from "../../domain/read-models/commissions-stats";
import dayjs, { Dayjs } from "dayjs";
import { CommissionAllocationFlattedVO } from "../../domain/value-objects/commissions.vo";

type CommissionableService = {
  serviceId: string;
  serviceName: string;
  count: number;
};

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

    const { date, period } = filteringDto as any;
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

    const collaborators =
      await this.collaboratorService.getCollaboratorsByDateRange(
        periodData.extendedStartDate,
        periodData.extendedEndDate
      );

    const simpCols = collaborators.map((col) => ({
      id: col.id,
      code: col.col_code,
      startDate: col.startDate,
      endDate: col.endDate,
    }));

    const allocations = await this.getAll(allocationQueryOptions);
    const flattenedCommissions = this.flatCommissions(allocations, period);
    const periodCommissions = flattenedCommissions.filter(
      (commission) =>
        commission.date >= periodData.periodStartDate &&
        commission.date <= periodData.periodEndDate
    );
    const periodCommissionableServices =
      this.getCommissionableServices(periodCommissions);

    const collaboratorCodes = collaborators.map((col) => col.col_code);

    const chartData = this.getChartData(flattenedCommissions, periodData);
    const consultationChartData = this.getStatsByService(
      flattenedCommissions,
      periodData,
      ["consulta", "especialista"],
      "count"
    );

    const vaccinationChartData = this.getStatsByService(
      flattenedCommissions,
      periodData,
      ["vacuna"],
      "count"
    );

    const periodCollaboratorServicesData = this.gerCollaboratorServicesData(
      periodCommissions,
      periodCommissionableServices
    );

    const periodStatsByCollaborator =
      this.getPeriodStatsByCollaborator(periodCommissions);

    // get periods, startDate, endDate, extendedStartDate, extendedEndDate
    // get the right start and end date
    // get the commissions
    // transform the commissions to facilitate processing

    return {
      id: 2,
      simpCols,
      periodStatsByCollaborator,
      chartData,
      consultationChartData,
      vaccinationChartData,
      collaboratorCodes,
      flattedCommissions: flattenedCommissions,
      collaboratorServicesData: periodCollaboratorServicesData,
    } as unknown as CommissionsStats;
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
        }))
      )
    );

    return flattedCommissions.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  private getCollaboratorCodes(
    commissions: CommissionAllocationFlattedVO[]
  ): string[] {
    return [
      ...new Set(commissions.map((commission) => commission.collaboratorCode)),
    ];
  }

  private getChartData(
    commissions: CommissionAllocationFlattedVO[],
    periodData: PeriodData,
    statsType: "count" | "amount" = "amount"
  ) {
    const { period, extendedStartDate, extendedEndDate } = periodData;

    // Initialize a map to store the results
    const resultMap = new Map<string, Record<string, number | string>>();

    // Iterate over each commission
    commissions.forEach((commission) => {
      // Determine the period key based on the commission date and the specified period type
      const periodKey = getMxPeriodKey(commission.date, period);

      // If the periodKey is not in the map, initialize it
      if (!resultMap.has(periodKey)) {
        resultMap.set(periodKey, { period: periodKey });
      }

      // Get the current period data
      const periodData = resultMap.get(periodKey)!;

      // Initialize the collaboratorCode entry as a number
      if (!periodData[commission.collaboratorCode]) {
        periodData[commission.collaboratorCode] = 0;
      }

      if (statsType === "count") {
        periodData[commission.collaboratorCode] =
          (periodData[commission.collaboratorCode] as number) + 1;
      } else {
        periodData[commission.collaboratorCode] = parseFloat(
          (
            (periodData[commission.collaboratorCode] as number) +
            commission.commissionAmount
          ).toFixed(2)
        );
      }
    });

    // Convert the map to an array and sort by period
    const sortedPeriods = Array.from(resultMap.values()).sort((a, b) => {
      return (
        new Date(a.period as string).getTime() -
        new Date(b.period as string).getTime()
      );
    });

    // Sort collaborators by highest amount within each period
    sortedPeriods.forEach((periodData) => {
      const entries = Object.entries(periodData)
        .filter(([key]) => key !== "period")
        .sort(
          ([, amountA], [, amountB]) =>
            (amountB as number) - (amountA as number)
        );

      // Reconstruct the periodData with sorted collaborators
      entries.forEach(([key, value], index) => {
        periodData[key] = value;
      });
    });

    return sortedPeriods;
  }

  private getStatsByService(
    commissions: CommissionAllocationFlattedVO[],
    periodData: PeriodData,
    serviceName: string[],
    statsType: "count" | "amount"
  ) {
    const { period, extendedStartDate, extendedEndDate } = periodData;
    const filteredCommissions = commissions.filter(
      (commission) =>
        serviceName.includes(commission.serviceName.toLowerCase()) &&
        (commission.commissionType === CommissionType.SIMPLE ||
          commission.commissionType === CommissionType.MENTOREE)
    );

    const stats = this.getChartData(filteredCommissions, periodData, "count");

    return stats;
  }

  /*
    array {
      colCode: string,
      colId: string,
      period: string,
      count: number,
      amount: number
    }
  */

  private getPeriodStatsByCollaborator = (
    flattenedCommissions: CommissionAllocationFlattedVO[]
  ) => {
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

    return Array.from(resultMap.values());
  };

  private gerCollaboratorServicesData = (
    flattenedCommissions: CommissionAllocationFlattedVO[],
    commissionableServices: CommissionableService[]
  ) => {
    const resultMap = new Map<
      string,
      {
        serviceId: string;
        serviceName: string;
        collaborators: {
          collaboratorCode: string;
          collaboratorId: string;
          commissionAmount: number;
          commissionCount: number;
        }[];
      }
    >();

    flattenedCommissions.forEach((commission) => {
      const key = commission.serviceId;

      if (!resultMap.has(key)) {
        resultMap.set(key, {
          serviceId: commission.serviceId,
          serviceName: commission.serviceName,
          collaborators: [],
        });
      }

      const serviceData = resultMap.get(key)!;
      const collaboratorData = serviceData.collaborators.find(
        (c) => c.collaboratorCode === commission.collaboratorCode
      );

      if (!collaboratorData) {
        serviceData.collaborators.push({
          collaboratorCode: commission.collaboratorCode,
          collaboratorId: commission.collaboratorId,
          commissionAmount: Number(commission.commissionAmount.toFixed(2)),
          commissionCount: 1,
        });
      } else {
        // Debug log for commission amount before update
        console.log(
          `Before update - Collaborator: ${collaboratorData.collaboratorCode}, Amount: ${collaboratorData.commissionAmount}`
        );

        collaboratorData.commissionAmount = Number(
          (
            collaboratorData.commissionAmount + commission.commissionAmount
          ).toFixed(2)
        );
        collaboratorData.commissionCount += 1;

        // Debug log for commission amount after update
        console.log(
          `After update - Collaborator: ${collaboratorData.collaboratorCode}, Amount: ${collaboratorData.commissionAmount}`
        );
      }
    });

    return Array.from(resultMap.values());
  };

  private getCommissionableServices = (
    commissions: CommissionAllocationFlattedVO[]
  ): CommissionableService[] => {
    const serviceMap = new Map<
      string,
      { serviceName: string; count: number }
    >();

    commissions.forEach((commission) => {
      if (!serviceMap.has(commission.serviceId)) {
        serviceMap.set(commission.serviceId, {
          serviceName: commission.serviceName,
          count: 0,
        });
      }
      serviceMap.get(commission.serviceId)!.count += 1;
    });

    return Array.from(serviceMap.entries())
      .map(([serviceId, { serviceName, count }]) => ({
        serviceId,
        serviceName,
        count,
      }))
      .sort((a, b) => b.count - a.count); // Sort by count in descending order
  };
}
