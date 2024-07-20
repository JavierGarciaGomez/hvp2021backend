export interface BaseDTO {
  id?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}

export interface BaseDTOConstructor<T extends BaseDTO> {
  create(data: any): T;
  update(data: any): T;
}
