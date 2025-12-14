export interface BaseVO {
  id?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}

export interface BaseVOConstructor<T extends BaseVO> {
  new (data: any): T; // Add constructor signature
  fromDocument(data: any): T;
}
