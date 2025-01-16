import { BaseEntity, BaseEntityProps } from "./base.entity";
import { AccountClassification } from "../enums";
import { BankAccountVO } from "../value-objects/bank-account.vo";
import { Schema } from "mongoose";

export interface AccountProps extends BaseEntityProps {
  name: string;
  description?: string;
  accountClass: string;
  accountType: string;
  subType: string;
  code: string;
  isActive: boolean;
  fullyQualifiedName: string;
  currency: string;
  parentAccountId: string;
  bankAccount?: BankAccountVO;
  isSubAccount: boolean;
  openingBalance: number;
  currentBalance: number;
}

export interface AccountDocument
  extends Omit<AccountProps, "parentAccountId">,
    Document {
  parentAccountId: Schema.Types.ObjectId;
}

export class AccountEntity implements BaseEntity {
  id?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  name!: string;
  description?: string;
  accountClass!: string;
  accountType!: string;
  subType!: string;
  code!: string;
  isActive!: boolean;
  fullyQualifiedName!: string;
  currency!: string;
  parentAccountId!: string;
  bankAccount?: BankAccountVO;
  isSubAccount!: boolean;
  openingBalance!: number;
  currentBalance!: number;

  constructor(props: AccountProps) {
    this.validateClassification(
      props.accountClass,
      props.accountType,
      props.subType
    );
    Object.assign(this, props);
  }

  // Validación de la clasificación
  private validateClassification(
    accountClass: string,
    accountType: string,
    subType: string
  ) {
    const classData = AccountClassification[accountClass];
    if (!classData) {
      throw new Error(`Invalid class: ${accountClass}`);
    }

    const validTypes = Object.keys(classData.types);
    if (!validTypes.includes(accountType)) {
      throw new Error(
        `Invalid type: ${accountType} for class: ${accountClass}`
      );
    }

    const typeData = classData.types[accountType];

    if (!typeData || !typeData.subtypes) {
      throw new Error(
        `Invalid type: ${accountType} for class: ${accountClass}`
      );
    }

    const validSubtypes = Object.keys(typeData.subtypes);
    if (!validSubtypes.includes(subType)) {
      throw new Error(
        `Invalid subtype: ${subType} for type: ${accountType} in class: ${accountClass}`
      );
    }

    if (validSubtypes && !validSubtypes.includes(subType)) {
      throw new Error(`Invalid subtype: ${subType} for type: ${accountType}`);
    }
  }

  // Método de fábrica para crear instancias
  public static create(props: AccountProps): AccountEntity {
    return new AccountEntity(props);
  }

  // Método de actualización de balance
  public updateBalance(newBalance: number) {
    this.currentBalance = newBalance;
  }
  public static fromDocument(document: AccountDocument) {
    return new AccountEntity({
      id: document.id,
      createdAt: document.createdAt,
      createdBy: document.createdBy,
      updatedAt: document.updatedAt,
      updatedBy: document.updatedBy,
      name: document.name,
      description: document.description,
      accountClass: document.accountClass,
      accountType: document.accountType,
      subType: document.subType,
      code: document.code,
      isActive: document.isActive,
      fullyQualifiedName: document.fullyQualifiedName,
      currency: document.currency,
      parentAccountId: document.parentAccountId.toString(),
      bankAccount: document.bankAccount,
      isSubAccount: document.isSubAccount,
      openingBalance: document.openingBalance,
      currentBalance: document.currentBalance,
    });
  }
}
