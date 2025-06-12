import {
  CommissionableServiceEntity,
  EmploymentEntity,
  JobEntity,
} from "../../domain/entities";
import { BaseService } from "./base.service";
import {
  CommissionableServiceRepository,
  CommissionCalculationType,
} from "../../domain";
import { CommissionableServiceDTO } from "../dtos";
import { CustomQueryOptions } from "../../shared";
import { createCollaboratorService } from "../factories";

export class CommissionableServiceService extends BaseService<
  CommissionableServiceEntity,
  CommissionableServiceDTO
> {
  constructor(protected readonly repository: CommissionableServiceRepository) {
    super(repository, CommissionableServiceEntity);
  }

  public getCommissionCalculation = async (
    queryOptions: CustomQueryOptions
    // todo change any
  ): Promise<any> => {
    // todo
    const calculationDate =
      queryOptions?.filteringDto?.date ?? new Date().toISOString();

    const collaboratorService = createCollaboratorService();
    const collaboratorsWithJobAndEmployment =
      await collaboratorService.getCollaboratorsWithJobAndEmployment(
        calculationDate
      );

    const commissionableServices = await this.repository.getAll();
    const result = {
      date: calculationDate,
      services: commissionableServices.map((service) => {
        return {
          ...service,
          collaborators: collaboratorsWithJobAndEmployment.map(
            (collaborator) => {
              return {
                serviceId: service.id,
                serviceName: service.name,
                collaboratorId: collaborator.collaborator.id!,
                collaboratorCode: collaborator.collaborator.col_code,
                commissionName: service.name,
                commissionAmount:
                  service.commissionCalculationType ===
                  CommissionCalculationType.FIXED
                    ? this.getCommissionAmount(
                        service,
                        collaborator.employment,
                        collaborator.job
                      )
                    : 0,
                commissionRate:
                  service.commissionCalculationType ===
                  CommissionCalculationType.PROPORTIONAL
                    ? this.getCommissionRate(
                        service,
                        collaborator.employment,
                        collaborator.job
                      )
                    : 0,
                maxAmount: service.maxCommission,
                maxRate: service.maxRate,
              };
            }
          ),
        };
      }),
    };

    return result;
  };

  public getCommissionAmount = (
    commisionableService: CommissionableServiceEntity,
    employment?: EmploymentEntity,
    job?: JobEntity
  ) => {
    const { baseCommission } = commisionableService;
    const commissionRateAdjustment = job?.commissionRateAdjustment ?? 40;
    const commissionBonusPercentage =
      employment?.commissionBonusPercentage ?? 0;

    return (
      baseCommission *
      (commissionRateAdjustment / 100) *
      (1 + commissionBonusPercentage)
    );
  };

  public getCommissionRate = (
    commisionableService: CommissionableServiceEntity,
    employment?: EmploymentEntity,
    job?: JobEntity
  ) => {
    const { baseRate, name } = commisionableService;
    let commissionRateAdjustment = job?.commissionRateAdjustment ?? 40;
    if (name.toLowerCase() === "venta") {
      commissionRateAdjustment = 100;
    }
    const commissionBonusPercentage =
      employment?.commissionBonusPercentage ?? 0;

    return (
      ((baseRate * commissionRateAdjustment) / 100) *
      (1 + commissionBonusPercentage)
    );
  };

  public getResourceName(): string {
    return "commissionable-service";
  }
}
