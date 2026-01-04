import { MexicanStateCode, MEXICAN_STATES } from 'hvp2021-shared';

/**
 * Address Value Object
 *
 * LEARNING POINTS:
 *
 * 1. Composite Value Object:
 *    - Contains multiple primitive values (street, city, etc.)
 *    - But treated as single cohesive unit
 *    - All fields validated together
 *
 * 2. Self-validating:
 *    - Validates all required fields
 *    - Validates Mexican postal code format (5 digits)
 *    - Validates state code against official INEGI codes
 *    - No invalid address can exist in memory
 *
 * 3. Immutable:
 *    - readonly fields can't be changed
 *    - Object.freeze() prevents modification
 *    - Use copyWith() to create modified copy
 *
 * 4. Has domain behavior:
 *    - formatForInvoice() - business logic for CFDI
 *    - isComplete() - domain rule for invoicing
 *    - NOT just a data container
 *
 * 5. Uses shared types:
 *    - MexicanStateCode from hvp2021-shared
 *    - Ensures consistency with frontend
 *    - Single source of truth
 */

export interface AddressProps {
  street: string;
  exteriorNumber: string;
  interiorNumber?: string;
  neighborhood: string;
  city: string;
  state: MexicanStateCode;
  postalCode: string;
  country: string;
}

export class Address {
  readonly street: string;
  readonly exteriorNumber: string;
  readonly interiorNumber?: string;
  readonly neighborhood: string;
  readonly city: string;
  readonly state: MexicanStateCode;
  readonly postalCode: string;
  readonly country: string;

  constructor(props: AddressProps) {
    this.street = props.street.trim();
    this.exteriorNumber = props.exteriorNumber.trim();
    this.interiorNumber = props.interiorNumber?.trim();
    this.neighborhood = props.neighborhood.trim();
    this.city = props.city.trim();
    this.state = props.state;
    this.postalCode = props.postalCode.trim();
    this.country = props.country.trim();

    this.validate();
    Object.freeze(this);
  }

  /**
   * Validate all address fields
   * Called automatically in constructor
   */
  private validate(): void {
    // Required fields validation
    if (!this.street) {
      throw new Error('Calle es requerida');
    }

    if (!this.exteriorNumber) {
      throw new Error('Número exterior es requerido');
    }

    if (!this.neighborhood) {
      throw new Error('Colonia es requerida');
    }

    if (!this.city) {
      throw new Error('Ciudad es requerida');
    }

    if (!this.postalCode) {
      throw new Error('Código postal es requerido');
    }

    if (!this.country) {
      throw new Error('País es requerido');
    }

    // Mexican postal code validation (5 digits)
    const postalCodeRegex = /^\d{5}$/;
    if (!postalCodeRegex.test(this.postalCode)) {
      throw new Error(`Código postal inválido: ${this.postalCode}. Debe ser 5 dígitos`);
    }

    // Validate state code against official INEGI codes
    if (!(this.state in MEXICAN_STATES)) {
      throw new Error(`Código de estado inválido: ${this.state}`);
    }

    // For now, only support México as country
    // In future, this could be extended to support other countries
    const normalizedCountry = this.country.toLowerCase();
    if (normalizedCountry !== 'méxico' && normalizedCountry !== 'mexico') {
      throw new Error(`Solo se soporta México como país, recibido: ${this.country}`);
    }
  }

  /**
   * DOMAIN BEHAVIOR: Format address for CFDI invoice (Mexican tax receipt)
   *
   * This is business logic that belongs in the domain.
   * CFDI requires specific address format for tax compliance.
   *
   * Returns comma-separated address string suitable for CFDI XML
   */
  formatForInvoice(): string {
    const parts = [
      this.street,
      this.exteriorNumber,
      this.interiorNumber ? `Int. ${this.interiorNumber}` : null,
      this.neighborhood,
      this.city,
      MEXICAN_STATES[this.state], // Full state name, not just code
      `C.P. ${this.postalCode}`,
      this.country
    ].filter(Boolean); // Remove null/undefined parts

    return parts.join(', ');
  }

  /**
   * DOMAIN BEHAVIOR: Format address for display (multiple lines)
   *
   * Returns formatted address suitable for display on screen or documents
   */
  formatForDisplay(): string[] {
    return [
      `${this.street} ${this.exteriorNumber}${this.interiorNumber ? ` Int. ${this.interiorNumber}` : ''}`,
      this.neighborhood,
      `${this.city}, ${MEXICAN_STATES[this.state]}`,
      `C.P. ${this.postalCode}`,
      this.country
    ];
  }

  /**
   * DOMAIN BEHAVIOR: Check if address is complete enough for invoicing
   *
   * Business rule: Address must have all required fields to be used in CFDI
   * This is a domain invariant - incomplete addresses shouldn't be used for invoicing
   */
  isComplete(): boolean {
    return !!(
      this.street &&
      this.exteriorNumber &&
      this.neighborhood &&
      this.city &&
      this.state &&
      this.postalCode &&
      this.country
    );
  }

  /**
   * Value equality comparison
   * Two addresses are equal if all fields match
   */
  equals(other: Address): boolean {
    if (!other) return false;

    return (
      this.street === other.street &&
      this.exteriorNumber === other.exteriorNumber &&
      this.interiorNumber === other.interiorNumber &&
      this.neighborhood === other.neighborhood &&
      this.city === other.city &&
      this.state === other.state &&
      this.postalCode === other.postalCode &&
      this.country === other.country
    );
  }

  /**
   * Create a new Address with some fields changed
   *
   * Since Address is immutable, this is how you "modify" it:
   * Create a new instance with different values.
   *
   * Example:
   *   const newAddress = oldAddress.copyWith({ city: 'Cancún', state: 'QROO' });
   */
  copyWith(changes: Partial<AddressProps>): Address {
    return new Address({
      street: changes.street ?? this.street,
      exteriorNumber: changes.exteriorNumber ?? this.exteriorNumber,
      interiorNumber: changes.interiorNumber ?? this.interiorNumber,
      neighborhood: changes.neighborhood ?? this.neighborhood,
      city: changes.city ?? this.city,
      state: changes.state ?? this.state,
      postalCode: changes.postalCode ?? this.postalCode,
      country: changes.country ?? this.country
    });
  }

  /**
   * String representation for logging/debugging
   */
  toString(): string {
    return this.formatForInvoice();
  }
}
