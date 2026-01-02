/**
 * Address Value Object
 *
 * Unified address representation supporting both international (line1/line2)
 * and Mexican detailed format (street, exteriorNumber, neighborhood, etc.)
 *
 * This is a Value Object - it's immutable and compared by value.
 *
 * Use cases:
 * - Company fiscal address (use Mexican format for CFDI)
 * - Collaborator home/fiscal address (use Mexican format for payroll receipts)
 * - Branch physical addresses
 * - Supplier/Customer addresses (either format)
 */

export interface AddressProps {
  // Common fields (always present)
  city: string;            // Localidad/Ciudad
  state: string;           // Estado
  country: string;         // País (default: México)
  zipCode: string;         // Código Postal (5 digits for Mexico)

  // International format (optional - legacy compatibility)
  line1?: string;          // Address line 1
  line2?: string;          // Address line 2

  // Mexican detailed format (optional - CFDI compliance)
  street?: string;         // Calle
  exteriorNumber?: string; // Número exterior
  interiorNumber?: string; // Número interior
  neighborhood?: string;   // Colonia
  municipality?: string;   // Municipio/Delegación
}

/**
 * Address Value Object
 *
 * Immutable representation of an address.
 * Supports both international and Mexican formats.
 */
export class Address {
  // Common fields
  readonly city: string;
  readonly state: string;
  readonly country: string;
  readonly zipCode: string;

  // International format
  readonly line1?: string;
  readonly line2?: string;

  // Mexican detailed format
  readonly street?: string;
  readonly exteriorNumber?: string;
  readonly interiorNumber?: string;
  readonly neighborhood?: string;
  readonly municipality?: string;

  constructor(props: AddressProps) {
    this.validate(props);

    // Common fields
    this.city = props.city.trim();
    this.state = props.state.trim();
    this.country = props.country.trim();
    this.zipCode = props.zipCode.trim();

    // International format
    this.line1 = props.line1?.trim();
    this.line2 = props.line2?.trim();

    // Mexican detailed format
    this.street = props.street?.trim();
    this.exteriorNumber = props.exteriorNumber?.trim();
    this.interiorNumber = props.interiorNumber?.trim();
    this.neighborhood = props.neighborhood?.trim();
    this.municipality = props.municipality?.trim();

    // Make immutable
    Object.freeze(this);
  }

  private validate(props: AddressProps): void {
    const errors: string[] = [];

    // Validate common fields (always required)
    if (!props.city || props.city.trim().length === 0) {
      errors.push("city is required");
    }

    if (!props.state || props.state.trim().length === 0) {
      errors.push("state is required");
    }

    if (!props.country || props.country.trim().length === 0) {
      errors.push("country is required");
    }

    if (!props.zipCode || props.zipCode.trim().length === 0) {
      errors.push("zipCode is required");
    }

    // Validate that at least one format is provided
    const hasInternationalFormat = props.line1;
    const hasMexicanFormat = props.street && props.exteriorNumber && props.neighborhood;

    if (!hasInternationalFormat && !hasMexicanFormat) {
      errors.push("Either international format (line1) or Mexican format (street, exteriorNumber, neighborhood) must be provided");
    }

    // Validate Mexican format if provided
    if (props.street || props.exteriorNumber || props.neighborhood) {
      if (!props.street || props.street.trim().length === 0) {
        errors.push("street is required when using Mexican format");
      }
      if (!props.exteriorNumber || props.exteriorNumber.trim().length === 0) {
        errors.push("exteriorNumber is required when using Mexican format");
      }
      if (!props.neighborhood || props.neighborhood.trim().length === 0) {
        errors.push("neighborhood is required when using Mexican format");
      }
    }

    if (errors.length > 0) {
      throw new Error(`Address validation failed: ${errors.join(", ")}`);
    }
  }

  /**
   * Check if this address uses Mexican detailed format
   */
  isMexicanFormat(): boolean {
    return !!(this.street && this.exteriorNumber && this.neighborhood);
  }

  /**
   * Check if this address uses international format
   */
  isInternationalFormat(): boolean {
    return !!this.line1;
  }

  /**
   * Get formatted full address
   */
  getFullAddress(): string {
    if (this.isMexicanFormat()) {
      // Mexican format: "Calle #Ext [Int. #], Colonia, Ciudad, Estado CP, País"
      const interior = this.interiorNumber ? ` Int. ${this.interiorNumber}` : "";
      const municipality = this.municipality ? `, ${this.municipality}` : "";
      return `${this.street} ${this.exteriorNumber}${interior}, ${this.neighborhood}, ${this.city}${municipality}, ${this.state} ${this.zipCode}, ${this.country}`;
    } else {
      // International format: "Line1, [Line2, ]City, State ZipCode, Country"
      const line2Part = this.line2 ? `${this.line2}, ` : "";
      return `${this.line1}, ${line2Part}${this.city}, ${this.state} ${this.zipCode}, ${this.country}`;
    }
  }

  /**
   * Get address formatted for CFDI XML
   * Only works if Mexican format is available
   */
  getForCFDI(): {
    Calle: string;
    NumeroExterior: string;
    NumeroInterior?: string;
    Colonia: string;
    Localidad: string;
    Municipio?: string;
    Estado: string;
    Pais: string;
    CodigoPostal: string;
  } {
    if (!this.isMexicanFormat()) {
      throw new Error("Cannot generate CFDI format: Mexican address details not available");
    }

    return {
      Calle: this.street!,
      NumeroExterior: this.exteriorNumber!,
      ...(this.interiorNumber && { NumeroInterior: this.interiorNumber }),
      Colonia: this.neighborhood!,
      Localidad: this.city,
      ...(this.municipality && { Municipio: this.municipality }),
      Estado: this.state,
      Pais: this.country,
      CodigoPostal: this.zipCode,
    };
  }

  /**
   * Compare two addresses for equality (by value)
   */
  equals(other: Address): boolean {
    if (!other) return false;

    return (
      this.city === other.city &&
      this.state === other.state &&
      this.country === other.country &&
      this.zipCode === other.zipCode &&
      this.line1 === other.line1 &&
      this.line2 === other.line2 &&
      this.street === other.street &&
      this.exteriorNumber === other.exteriorNumber &&
      this.interiorNumber === other.interiorNumber &&
      this.neighborhood === other.neighborhood &&
      this.municipality === other.municipality
    );
  }

  /**
   * Convert to plain object (for serialization)
   */
  toObject(): AddressProps {
    return {
      city: this.city,
      state: this.state,
      country: this.country,
      zipCode: this.zipCode,
      ...(this.line1 && { line1: this.line1 }),
      ...(this.line2 && { line2: this.line2 }),
      ...(this.street && { street: this.street }),
      ...(this.exteriorNumber && { exteriorNumber: this.exteriorNumber }),
      ...(this.interiorNumber && { interiorNumber: this.interiorNumber }),
      ...(this.neighborhood && { neighborhood: this.neighborhood }),
      ...(this.municipality && { municipality: this.municipality }),
    };
  }

  /**
   * Create from plain object
   */
  static fromObject(obj: AddressProps): Address {
    return new Address(obj);
  }
}

/**
 * Mongoose Schema for Address
 * Use this in your MongoDB models
 */
export const AddressSchema = {
  // Common fields
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true, default: "México" },
  zipCode: { type: String, required: true },

  // International format (optional)
  line1: { type: String, required: false },
  line2: { type: String, required: false },

  // Mexican detailed format (optional)
  street: { type: String, required: false },
  exteriorNumber: { type: String, required: false },
  interiorNumber: { type: String, required: false },
  neighborhood: { type: String, required: false },
  municipality: { type: String, required: false },
};

/**
 * @deprecated Use Address class and AddressProps instead
 * Kept for backward compatibility
 */
export interface AddressVO extends AddressProps {}
