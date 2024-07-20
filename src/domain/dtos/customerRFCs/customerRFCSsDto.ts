import { ObjectId } from "mongodb";
import {
  isValidDate,
  isValidDateString,
} from "../../../shared/helpers/dateHelpers";
import {
  isFiscalRegimeValidForMoralPerson,
  isFiscalRegimeValidForPhysicalPerson,
  isInvoiceUsageValidForMoralPerson,
  isInvoiceUsageValidForPhysicalPerson,
  isRFCFromMoralPerson,
  isRFCFromPhysicalPerson,
  isValidRFC,
} from "../../../shared/helpers/billingHelpers";
import { isValidPostalCode } from "../../../shared/helpers/addressesHelpers";

interface Options {
  _id?: string;
  name: string;
  rfc: string;
  invoice_usage: string;
  fiscal_regime: string;
  postal_code: string;
  email: string;
  phone_number: string;
  isValidated: boolean;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export class CustomerRFCDTO {
  private constructor(public readonly data: Readonly<Options>) {}

  static create(data: Options): [string?, CustomerRFCDTO?] {
    return this.createOrUpdate(data);
  }

  static update(data: Options): [string?, CustomerRFCDTO?] {
    return this.createOrUpdate(data);
  }

  private static createOrUpdate(data: Options): [string?, CustomerRFCDTO?] {
    const validationError = this.validateOptions(data);
    if (validationError) return [validationError];

    return [undefined, new CustomerRFCDTO({ ...data })];
  }

  private static validateOptions(data: Options): string | undefined {
    const { rfc, invoice_usage, fiscal_regime, postal_code, name } = data;

    if (!isValidRFC(rfc)) {
      return "RFC is not valid";
    }
    if (isRFCFromMoralPerson(rfc)) {
      if (!isInvoiceUsageValidForMoralPerson(invoice_usage)) {
        return "Invoice usage is not valid for moral person";
      }
      if (!isFiscalRegimeValidForMoralPerson(fiscal_regime)) {
        return "Fiscal regime is not valid for moral person";
      }
    }
    if (isRFCFromPhysicalPerson(rfc)) {
      if (!isInvoiceUsageValidForPhysicalPerson(invoice_usage)) {
        return "Invoice usage is not valid for physical person";
      }
      if (!isFiscalRegimeValidForPhysicalPerson(fiscal_regime)) {
        return "Fiscal regime is not valid for physical person";
      }
    }

    if (!isValidPostalCode(postal_code)) {
      return "Postal code is not valid";
    }

    if (!name) {
      return "Name is required";
    }

    if (!data.email) {
      return "Email is required";
    }

    if (!data.phone_number) {
      return "Phone number is required";
    }

    if (data) return undefined;
  }
}
