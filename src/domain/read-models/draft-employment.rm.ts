import { EmploymentEntity } from "../entities";

export interface DraftEmploymentReadModel {
  simplifiedCollaborator: { id: string; col_code: string };
  prevEmployment: EmploymentEntity | null;
  newEmployment: EmploymentEntity;
}
