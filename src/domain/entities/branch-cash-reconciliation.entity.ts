import { BaseEntity, BaseEntityProps } from "./base.entity";
import { TransactionType } from "../enums";
import { Schema } from "mongoose";
import { LinkedTransactionVO } from "../value-objects/linkedTransaction.vo";
import { MoneyInDrawerVO } from "../value-objects/money-in-drawer.vo";
import { ReconciliationExpenseVO } from "../value-objects";

export interface BranchCashReconciliationProps extends BaseEntityProps {
  // general
  branchId: string;
  cashierId: string;
  // dates
  transactionDate: Date; // date as YYYY-MM-DD
  transactionDatetime: Date; // date as YYYY-MM-DD HH:MM:SS

  cashInDrawerStart: number;
  // cashInDrawerEnd: number;
  cashInDrawerEnd: number;

  // QVET SECTIONS//
  // Money / dinero en caja

  /*
    cash: cash
    creditCard: accountsReceivableBanks
    debitCard: accountsReceivableBanks
    bankTransfer: bank
  */
  moneyInDrawerEnd: MoneyInDrawerVO[];
  // payments by type / cobros por tipo de pago
  // acc: accountsReceivableCustomers
  creditSalesPayment: number; // cambios en crédito de cortes anteriores
  // acc: income
  salesPayment: number;
  // acc: customerAdvances
  accountPayment: number; // cobro uso  a cuenta
  // tODO I need an array for this too. Think about it. Maybe just transfers?
  cashInFlow: number;
  // todo validate it matches the reconciliationExpenses
  cashOutFlow: number;

  // Sales activity // actividad comercial
  // acc: income ?  validate it matches salesPayment and creditSalesPayment
  totalSales: number;

  // credit sales // total deuda generada en este corte
  // acc: accountsReceivableCustomers
  creditSales: number;

  reconciliationExpenses: ReconciliationExpenseVO[];
  // txn
  transactionIds: LinkedTransactionVO[]; // ids of all the transactions in the reconciliation
  // totals

  // todo: maybe it should be an expense?
  cashDifference: number; // difference between expected cash and cash in hand
  // expectedCash: number; // expected cash in the branch
  // totalCashSales: number;
  // totalReceivablePayments: number;
  // totalExpenses: number;
  // cashInHand: number; // cash in hand in the branch
  // accounts where the cash is and where it goes
  originAccountId: string;
  destinationAccountId: string;
  // notes
  notes?: string;
  // status
  status: "pending" | "completed" | "cancelled";
}

export interface BranchCashReconciliationDocument
  extends Omit<
      BranchCashReconciliationProps,
      | "id"
      | "branchId"
      | "cashierId"
      | "transactionIds"
      | "originAccountId"
      | "destinationAccountId"
      | "createdBy"
      | "updatedBy"
    >,
    Document {
  id: Schema.Types.ObjectId;
  branchId: Schema.Types.ObjectId;
  cashierId: Schema.Types.ObjectId;
  transactionIds: {
    transactionId: Schema.Types.ObjectId;
    transactionType: TransactionType;
  }[];
  originAccountId: Schema.Types.ObjectId;
  destinationAccountId: Schema.Types.ObjectId;
  createdBy: Schema.Types.ObjectId;
  updatedBy: Schema.Types.ObjectId;
}

export class BranchCashReconciliationEntity implements BaseEntity {
  id?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  branchId!: string;
  cashierId!: string;
  transactionDate!: Date;
  transactionDatetime!: Date;
  cashierInDrawerStart!: number;
  cashierInDrawerEnd!: number;
  moneyInDrawerEnd!: MoneyInDrawerVO[];
  creditSalesPayment!: number;
  salesPayment!: number;
  accountPayment!: number;
  cashInFlow!: number;
  cashOutFlow!: number;
  totalSales!: number;
  creditSales!: number;
  reconciliationExpenses!: ReconciliationExpenseVO[];
  transactionIds!: LinkedTransactionVO[];
  cashDifference!: number;
  originAccountId!: string;
  destinationAccountId!: string;
  notes?: string;
  status!: "pending" | "completed" | "cancelled";

  constructor(props: BranchCashReconciliationProps) {
    Object.assign(this, props);
  }

  public static create(
    props: BranchCashReconciliationProps
  ): BranchCashReconciliationEntity {
    return new BranchCashReconciliationEntity(props);
  }

  public static fromDocument(document: BranchCashReconciliationDocument) {
    return new BranchCashReconciliationEntity({
      id: document.id.toString(),
      branchId: document.branchId.toString(),
      cashierId: document.cashierId.toString(),
      transactionDate: document.transactionDate,
      transactionDatetime: document.transactionDatetime,
      cashInDrawerStart: document.cashInDrawerStart,
      cashInDrawerEnd: document.cashInDrawerEnd,
      moneyInDrawerEnd: document.moneyInDrawerEnd,
      creditSalesPayment: document.creditSalesPayment,
      salesPayment: document.salesPayment,
      accountPayment: document.accountPayment,
      cashInFlow: document.cashInFlow,
      cashOutFlow: document.cashOutFlow,
      totalSales: document.totalSales,
      creditSales: document.creditSales,
      reconciliationExpenses: document.reconciliationExpenses,
      transactionIds: document.transactionIds.map((txn) => ({
        transactionId: txn.transactionId.toString(),
        transactionType: txn.transactionType,
      })),
      cashDifference: document.cashDifference,
      originAccountId: document.originAccountId.toString(),
      destinationAccountId: document.destinationAccountId.toString(),
      notes: document.notes,
      status: document.status,
    });
  }
}
