import {
  TimeOffRequestEntity,
  TimeOffRequestResponse,
} from "../../domain/entities";
import { BaseService } from "./base.service";
import {
  TimeOffRequestRepository,
  TimeOffStatus,
  TimeOffType,
} from "../../domain";
import { TimeOffRequestDTO } from "../dtos";

import {
  AuthenticatedCollaborator,
  BaseError,
  buildQueryOptions,
  getLatestDate,
  LEGAL_VACATIONS,
} from "../../shared";
import isAuthorized from "../../presentation/middlewares/isAuthorized";
import { createCollaboratorService } from "../factories";
import { AuthorizationService } from "./authorizationService";
import dayjs from "dayjs";
import {
  calculateTotalVacationDays,
  getApprovedVacations,
  getPendingVacations,
} from "../../shared/helpers/timeOffHelpers";
import {
  CollaboratorTimeOffOverview,
  DateTimeOffRequest,
} from "../../domain/read-models";

export class TimeOffRequestService extends BaseService<
  TimeOffRequestEntity,
  TimeOffRequestDTO
> {
  private collaboratorService = createCollaboratorService();
  constructor(protected readonly repository: TimeOffRequestRepository) {
    super(repository, TimeOffRequestEntity);
  }

  public getResourceName(): string {
    return "time-off-request";
  }

  public create = async (
    dto: TimeOffRequestDTO,
    authUser?: AuthenticatedCollaborator
  ): Promise<TimeOffRequestResponse> => {
    try {
      if (!authUser) throw BaseError.badRequest("User not authenticated");

      await this.validatePermissionRights(dto, authUser);
      await this.validateTimeOffRequest(dto);
      await this.checkForExistentTimeOffRequests(dto);
      await this.checkIfHasEnoughVacationDays(dto.collaborator!, dto);
      const entity = new TimeOffRequestEntity(dto);
      const result = await this.repository.create(entity);
      return this.transformToResponse(result);
    } catch (error: any) {
      if (error._message) {
        throw BaseError.badRequest(error.message);
      }
      throw error;
    }
  };

  public update = async (
    id: string,
    dto: TimeOffRequestDTO,
    authUser: AuthenticatedCollaborator
  ): Promise<TimeOffRequestEntity> => {
    if (!authUser) throw BaseError.badRequest("User not authenticated");
    await this.validatePermissionRights(dto, authUser);
    await this.validateTimeOffRequest(dto);
    // await this.checkIfHasEnoughVacationDays(dto.collaborator!, dto);
    const entity = new TimeOffRequestEntity(dto);
    const result = await this.repository.update(id, entity);
    return this.transformToResponse(result);
  };

  private validateTimeOffRequest = async (
    dto: TimeOffRequestDTO
  ): Promise<void> => {};

  private validatePermissionRights = async (
    dto: TimeOffRequestDTO,
    authUser: AuthenticatedCollaborator
  ): Promise<void> => {
    const { approvedAt } = dto;
    if (!approvedAt) return;
    const timeOffRequest = await this.repository.getById(dto.id!);
    if (!timeOffRequest) throw BaseError.notFound("Time off request not found");

    if (timeOffRequest.approvedAt) return;

    if (!AuthorizationService.isAdminOrManager(authUser))
      throw BaseError.badRequest(
        "You are not authorized to update this time off request"
      );
  };

  private checkForExistentTimeOffRequests = async (
    dto: TimeOffRequestDTO,
    excludedId?: string
  ): Promise<void> => {
    const query = buildQueryOptions({
      collaborator: dto.collaborator!,
      $requestedDays: this.buildRequestedDaysQuery(dto),
    });

    let timeOffRequests = await this.repository.getAll(query);
    timeOffRequests = timeOffRequests.filter(
      (timeOffRequest) =>
        timeOffRequest.id !== excludedId &&
        timeOffRequest.status !== TimeOffStatus.Canceled
    );

    if (timeOffRequests.length > 0) {
      throw BaseError.badRequest(
        "The collaborator already has a time off request for the date"
      );
    }
  };

  public transformToResponse = async (
    entity: TimeOffRequestEntity
  ): Promise<TimeOffRequestResponse> => {
    return {
      ...entity,
    };
  };

  private buildRequestedDaysQuery = (dto: TimeOffRequestDTO) => {
    const { requestedDays } = dto;
    const sortedDays = requestedDays.sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    const firstDay = sortedDays[0];
    const lastDay = sortedDays[sortedDays.length - 1];

    return `$range: ${firstDay}...${lastDay}`;
  };

  private checkIfHasEnoughVacationDays = async (
    collaboratorId: string,
    timeOffRequestDto: TimeOffRequestDTO
  ): Promise<void> => {
    const { requestedDays, timeOffType } = timeOffRequestDto;
    const isVacation =
      timeOffType === TimeOffType.Vacation ||
      timeOffType === TimeOffType.PersonalLeave;
    if (!isVacation) return;
    const periodLength = requestedDays.length;
    const lastDay = getLatestDate(requestedDays);
    const { remainingVacationDays } = await this.getCollaboratorTimeOffOverview(
      collaboratorId,
      lastDay
    );

    if (remainingVacationDays < periodLength) {
      throw BaseError.badRequest(
        `The collaborator has ${remainingVacationDays} vacations days for the ${lastDay.toISOString()}.`
      );
    }
  };

  public getCollaboratorTimeOffOverview = async (
    collaboratorId: string,
    endDate: Date = new Date(),
    excludedTimeOffRequestId?: string
  ) => {
    const query = buildQueryOptions({
      collaborator: collaboratorId,
    });
    let collaboratorTimeOffRequests = await this.repository.getAll(query);
    if (excludedTimeOffRequestId) {
      collaboratorTimeOffRequests = collaboratorTimeOffRequests.filter(
        (timeOffRequest) => timeOffRequest.id !== excludedTimeOffRequestId
      );
    }
    const collaborator = await this.collaboratorService.getById(collaboratorId);
    const { startDate, endDate: collaboratorEndDate } = collaborator!;

    const vacationPeriods = this.getVacationPeriods(
      startDate!,
      endDate,
      collaboratorTimeOffRequests
    );

    const lastAnniversaryDate = this.getLastAnniversaryDate(
      startDate ?? new Date()
    );
    const legalVacationDays = calculateTotalVacationDays(
      startDate!,
      lastAnniversaryDate,
      collaboratorEndDate
    );
    const totalVacationDays = calculateTotalVacationDays(
      startDate!,
      endDate,
      collaboratorEndDate
    );
    const vacationsTaken: Date[] = getApprovedVacations(
      collaboratorTimeOffRequests
    );

    const vacationsRequested: Date[] = getPendingVacations(
      collaboratorTimeOffRequests
    );

    const dateTimeOffRequests: DateTimeOffRequest[] = [];

    collaboratorTimeOffRequests
      .filter(
        (collaboratorTimeOffRequest) =>
          collaboratorTimeOffRequest.status !== TimeOffStatus.Rejected
      )
      .forEach((collaboratorTimeOffRequest) => {
        const { collaborator, timeOffType, status } =
          collaboratorTimeOffRequest;
        collaboratorTimeOffRequest.requestedDays.forEach((date) => {
          dateTimeOffRequests.push({
            date,
            id: `${collaboratorTimeOffRequest.id}-${date
              .getTime()
              .toString()}-${collaborator}}`,
            timeOffType,
            status,
            collaborator,
          });
        });
      });

    const takenOrRequestedVacationDays =
      vacationsRequested.length + vacationsTaken.length;

    const remainingVacationDays =
      totalVacationDays - takenOrRequestedVacationDays;
    0;

    const remainingLegalVacationDays = Math.max(
      legalVacationDays - takenOrRequestedVacationDays,
      0
    );

    const thisYearVacationDays = totalVacationDays - legalVacationDays;

    const remainingcurrentYearVacationDays =
      thisYearVacationDays -
      Math.max(0, takenOrRequestedVacationDays - legalVacationDays);

    // todo: working

    const currentPeriod = vacationPeriods[vacationPeriods.length - 1];

    const rawVacations = [];
    for (const period of vacationPeriods) {
      for (const request of period.vacationRequests) {
        rawVacations.push(request);
      }
    }
    const vacationsTaken2 = rawVacations.map(
      (v) => v.status === TimeOffStatus.Approved
    );
    const vacationsRequested2 = rawVacations.map(
      (v) => v.status === TimeOffStatus.Pending
    );

    const remainingVacationDays2 = currentPeriod.accumulatedBalance;

    const data: CollaboratorTimeOffOverview = {
      collaboratorId,
      totalVacationDays,
      vacationsTaken,
      vacationsRequested: vacationsRequested,
      remainingVacationDays,
      dateTimeOffRequests,
      lastAnniversaryDate,
      legalVacationDays,
      remainingLegalVacationDays,
      remainingcurrentYearVacationDays,
    };

    return data;
  };

  public getCollaboratorsTimeOffOverview = async () => {
    const query = buildQueryOptions({
      isActive: true,
    });
    const collaborators = await this.collaboratorService.getAll(query);

    const collaboratorsTimeOffOverview: CollaboratorTimeOffOverview[] = [];
    for (const collaborator of collaborators) {
      const collaboratorId = collaborator.id!;
      const overview = await this.getCollaboratorTimeOffOverview(
        collaboratorId
      );
      collaboratorsTimeOffOverview.push(overview);
    }
    return collaboratorsTimeOffOverview;
  };

  private getLastAnniversaryDate = (startDate: Date): Date => {
    const start = dayjs(startDate);
    const current = dayjs();

    // Calculate the last anniversary date in the previous year
    let lastAnniversaryDate = start.add(current.year() - start.year(), "year");

    // If the last anniversary date is after the current date, subtract one more year
    if (lastAnniversaryDate.isAfter(current)) {
      lastAnniversaryDate = lastAnniversaryDate.subtract(1, "year");
    }

    return lastAnniversaryDate.toDate();
  };

  private getVacationPeriods = (
    startDate: Date,
    cutoffDate: Date,
    collaboratorTimeOffRequests: TimeOffRequestEntity[]
  ) => {
    const vacationPeriods: VacationPeriod[] = [];
    let currentStart = new Date(startDate);
    let years = 1;
    let accumulatedBalance = 0;

    const getLegalDays = (years: number, anniversaryYear: number): number => {
      const law = anniversaryYear >= 2023 ? "new" : "old";
      const table = LEGAL_VACATIONS[law];
      return table[Math.min(years, table.length - 1)];
    };

    while (currentStart < cutoffDate) {
      const nextAnniversary = new Date(currentStart);
      nextAnniversary.setFullYear(nextAnniversary.getFullYear() + 1);
      const isCurrent = nextAnniversary > cutoffDate;
      const periodEnd = isCurrent ? cutoffDate : nextAnniversary;

      // LEGAL: sólo si ya cumplió aniversario
      const anniversaryYear = nextAnniversary.getFullYear();
      const legalCalc = getLegalDays(years, anniversaryYear);
      const legalVacationDays = isCurrent ? 0 : legalCalc;

      // EXTRA: desde 2025, 2 por año natural
      let extra = 0;
      if (periodEnd.getFullYear() >= 2025) {
        // Check if January 1st of this year falls within the period
        const januaryFirst = new Date(periodEnd.getFullYear(), 0, 1);
        if (januaryFirst >= currentStart && januaryFirst < periodEnd) {
          extra = 2;
        }
      }
      // PROVISIONAL (solo periodo actual)
      let provisional = 0;
      if (isCurrent) {
        const expected = legalCalc;
        const elapsedDays = Math.floor(
          (cutoffDate.getTime() - currentStart.getTime()) /
            (1000 * 60 * 60 * 24)
        );
        provisional = +(expected * (elapsedDays / 365)).toFixed(0);
      }

      const total = +(legalVacationDays + extra + provisional).toFixed(2);

      // TODO
      // Vacaciones tomadas en este periodo

      const periodVacationRequests = this.getVacationDaysTaken(
        collaboratorTimeOffRequests,
        currentStart,
        isCurrent ? new Date(9999, 11, 31) : periodEnd
      );
      const takenDays = periodVacationRequests.reduce(
        (sum, v) => sum + v.requestedDays.length,
        0
      );

      const periodBalance = +(total - takenDays).toFixed(2);

      accumulatedBalance += periodBalance;

      vacationPeriods.push({
        startDate: currentStart,
        endDate: periodEnd,
        legalVacationDays: legalVacationDays,
        extraVacationDays: extra,
        provisionalVacationDays: provisional,
        totalVacationDays: total,
        vacationDaysTaken: takenDays,
        periodBalance,
        accumulatedBalance,
        vacationRequests: periodVacationRequests,
      });

      currentStart = nextAnniversary;
      years += 1;
    }

    return vacationPeriods;
  };

  private getVacationDaysTaken = (
    collaboratorTimeOffRequests: TimeOffRequestEntity[],
    startDate: Date,
    endDate: Date
  ) => {
    return collaboratorTimeOffRequests.filter(
      (v) =>
        v.requestedDays.some((d) => d >= startDate && d < endDate) &&
        (v.status === TimeOffStatus.Approved ||
          v.status === TimeOffStatus.Pending) &&
        (v.timeOffType === TimeOffType.Vacation ||
          v.timeOffType === TimeOffType.PersonalLeave)
    );
  };
}

type VacationPeriod = {
  startDate: Date;
  endDate: Date;
  legalVacationDays: number;
  extraVacationDays: number;
  provisionalVacationDays: number;
  totalVacationDays: number;
  vacationDaysTaken: number;
  periodBalance: number;
  accumulatedBalance: number;
  vacationRequests: TimeOffRequestEntity[];
};
