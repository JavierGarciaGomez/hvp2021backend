import { BaseDTO } from "./base.dto";
import { BankAccountVO } from "../../domain/value-objects/bank-account.vo";
import { AccountProps } from "../../domain/entities/account.entity";

export class AccountDTO implements BaseDTO {
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
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;

  constructor({
    name,
    description,
    accountClass,
    accountType,
    subType,
    code,
    isActive,
    fullyQualifiedName,
    currency,
    parentAccountId,
    bankAccount,
    isSubAccount,
    openingBalance,
    currentBalance,
  }: AccountProps) {
    this.name = name;
    this.description = description;
    this.accountClass = accountClass;
    this.accountType = accountType;
    this.subType = subType;
    this.code = code;
    this.isActive = isActive;
    this.fullyQualifiedName = fullyQualifiedName;
    this.currency = currency;
    this.parentAccountId = parentAccountId;
    this.bankAccount = bankAccount;
    this.isSubAccount = isSubAccount;
    this.openingBalance = openingBalance;
    this.currentBalance = currentBalance;
  }

  static create(data: AccountProps): AccountDTO {
    const errors = [];
    const {
      name,
      description,
      accountClass,
      accountType,
      subType,
      code,
      isActive,
      fullyQualifiedName,
      currency,
      parentAccountId,
      bankAccount,
      isSubAccount,
      openingBalance,
      currentBalance,
    } = data;

    if (!name) {
      errors.push("Name is required");
    }

    if (!accountClass) {
      errors.push("Account class is required");
    }

    if (!accountType) {
      errors.push("Account type is required");
    }

    if (errors.length) {
      throw new Error(errors.join(", "));
    }

    return new AccountDTO({ ...data });
  }

  static update(data: AccountProps): AccountDTO {
    return this.validate(data);
  }

  private static validate(data: AccountProps): AccountDTO {
    return new AccountDTO({ ...data });
  }
}
