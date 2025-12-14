import { AttendanceRecordEntity } from "../../domain/entities";
import { BaseService } from "./base.service";
import { AttendanceRecordRepository, SortingDto } from "../../domain";
import { FilteringDto, AttendanceRecordDTO } from "../dtos";
import { BaseError } from "../../shared";
import dayjs from "dayjs";
import { createAttendanceRecordService } from "../factories";

export class AttendanceRecordService extends BaseService<
  AttendanceRecordEntity,
  AttendanceRecordDTO
> {
  constructor(protected readonly repository: AttendanceRecordRepository) {
    super(repository, AttendanceRecordEntity);
  }

  public create = async (
    dto: AttendanceRecordDTO
  ): Promise<AttendanceRecordEntity> => {
    const entity = new this.entityClass(dto);
    await this.checkForExistingAttendanceRecord(
      entity.collaborator,
      entity.shiftDate
    );
    const result = await this.repository.create(entity);
    return this.transformToResponse(result);
  };

  async update(
    id: string,
    dto: AttendanceRecordDTO
  ): Promise<AttendanceRecordEntity> {
    const entity = new this.entityClass(dto);
    const result = await this.repository.update(id, entity);
    return this.transformToResponse(result);
  }

  public async getLastAttendanceRecordByCollaborator(
    collaboratorId: string
  ): Promise<AttendanceRecordEntity> {
    const service = createAttendanceRecordService();
    const filteringDto = FilteringDto.create({
      collaborator: collaboratorId,
    });

    const sortingDto = SortingDto.create("shiftDate", "desc");

    const result = await service.getAll({ filteringDto, sortingDto });

    return result[0];
  }

  async findByCollaboratorAndDateRange(
    collaboratorId: string,
    startDate: Date,
    endDate: Date
  ): Promise<AttendanceRecordEntity[]> {
    return this.repository.findByCollaboratorAndDateRange(
      collaboratorId,
      startDate,
      endDate
    );
  }

  private async checkForExistingAttendanceRecord(
    collaboratorId: string,
    shiftDate: Date
  ): Promise<void> {
    const startOfDay = dayjs(shiftDate).startOf("day").toDate();
    const endOfDay = dayjs(shiftDate).endOf("day").toDate();

    const existing = await this.findByCollaboratorAndDateRange(
      collaboratorId,
      startOfDay,
      endOfDay
    );
    if (existing.length > 0) {
      throw BaseError.badRequest(
        "Attendance record already exists for this collaborator and date"
      );
    }
  }

  public getResourceName(): string {
    return "attendance-record";
  }
}
