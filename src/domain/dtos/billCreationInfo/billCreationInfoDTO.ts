import { BillCreationInfoStatus } from "../../../data/types";
import { isValidBranch, isValidPaymentMethod } from "../../../helpers";

interface Options {
  _id?: string;
  bill_date: string;
  customer_rfc: string;
  branch: string;
  document_number: string;
  status: BillCreationInfoStatus;
  total: number;
  is_documented: boolean;
  payment_method: string;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export class BillCreationInfoDTO {
  private constructor(public readonly data: Readonly<Options>) {}

  static create(data: Options): [string?, BillCreationInfoDTO?] {
    return this.createOrUpdate(data);
  }

  static update(data: Options): [string?, BillCreationInfoDTO?] {
    return this.createOrUpdate(data);
  }

  private static createOrUpdate(
    data: Options
  ): [string?, BillCreationInfoDTO?] {
    const validationError = this.validateOptions(data);

    const { status } = data;
    if (!status) {
      data.status = BillCreationInfoStatus.PENDING;
    }

    if (validationError) return [validationError];

    return [undefined, new BillCreationInfoDTO({ ...data })];
  }

  private static validateOptions(data: Options): string | undefined {
    const {
      customer_rfc,
      branch,
      document_number: docNumber,
      payment_method,
      bill_date,
    } = data;

    if (!bill_date || isNaN(new Date(bill_date).getTime())) {
      return "Bill date is required and must be a valid date";
    }

    if (!customer_rfc) {
      return "Customer RFC is required";
    }
    if (!branch || !isValidBranch(branch)) {
      return "Branch is required and must be valid";
    }
    if (!docNumber) {
      return "Document number is required";
    }
    if (!payment_method || !isValidPaymentMethod(payment_method)) {
      return "Payment method is required";
    }

    if (data) return undefined;
  }
}
