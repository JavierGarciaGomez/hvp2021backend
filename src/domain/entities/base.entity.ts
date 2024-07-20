export interface BaseEntity {
  id?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}

export interface BaseEntityConstructor<T extends BaseEntity> {
  new (data: any): T; // Add constructor signature
  fromDocument(data: any): T;
}
