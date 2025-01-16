import { BaseEntity, BaseEntityProps } from "./base.entity";
import { AddressVO } from "../value-objects";

export interface CustomerProps extends BaseEntityProps {
  firstName: string;
  lastName: string;
  secondLastName: string;
  birthDate: Date;
  address?: AddressVO;
  phoneNumber?: string[];
  email?: string;
  qvetNumber?: string;
  balance?: number;
  isActive: boolean;
}

export interface CustomerDocument extends CustomerProps, Document {}

export class CustomerEntity implements BaseEntity {
  id?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  firstName!: string;
  lastName!: string;
  secondLastName!: string;
  birthDate!: Date;
  address?: AddressVO;
  phoneNumber?: string[];
  email?: string;
  qvetNumber?: string;
  balance?: number;
  isActive!: boolean;

  constructor(props: CustomerProps) {
    Object.assign(this, props);
  }

  // Método de fábrica para crear instancias
  public static create(props: CustomerProps): CustomerEntity {
    return new CustomerEntity(props);
  }

  // Método de actualización de balance
  public updateBalance(newBalance: number) {
    this.balance = newBalance;
  }

  public static fromDocument(document: CustomerDocument) {
    return new CustomerEntity({
      ...document,
    });
  }
}
