/**
 * RFC (Registro Federal de Contribuyentes) Value Object
 *
 * LEARNING POINTS:
 *
 * 1. This is a Value Object because:
 *    - It has no identity (no ID)
 *    - It's defined by its value
 *    - Two RFCs with same value are identical
 *
 * 2. It's self-validating:
 *    - Invalid RFC throws error immediately
 *    - No invalid RFC can exist in memory
 *    - Validation happens in constructor
 *
 * 3. It's immutable:
 *    - Object.freeze() prevents modification
 *    - readonly fields can't be changed
 *    - To "change" RFC, create new instance
 *
 * 4. It has behavior (not just data):
 *    - validate() encapsulates RFC validation logic
 *    - isIndividual() / isCorporate() provide business logic
 *    - This is DOMAIN LOGIC, not infrastructure
 *
 * 5. Why not just use a string?
 *    - String allows invalid RFCs to exist
 *    - No type safety (any string could be passed)
 *    - No encapsulation of validation rules
 *    - No domain behavior
 */

export class RFC {
  readonly value: string;

  constructor(value: string) {
    this.value = value.toUpperCase().trim();
    this.validate();
    Object.freeze(this); // Make immutable - prevents any modification
  }

  /**
   * RFC Validation Rules (Mexican tax ID):
   * - Individual (Persona Física): 13 characters (AAAA######XXX)
   * - Corporate (Persona Moral): 12 characters (AAA######XXX)
   * - Format: Letters + numbers + homoclave (verification code)
   *
   * Pattern breakdown:
   * - [A-ZÑ&]{3,4} → 3-4 letters (name/company initials, Ñ and & allowed)
   * - \d{6} → 6 digits (birth date YYMMDD or incorporation date)
   * - [A-Z0-9]{3} → 3 alphanumeric (homoclave - verification code)
   */
  private validate(): void {
    const rfcRegex = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;

    if (!this.value) {
      throw new Error('RFC no puede estar vacío');
    }

    if (!rfcRegex.test(this.value)) {
      throw new Error(
        `RFC inválido: ${this.value}. Formato esperado: XXX######XXX (12 caracteres) o XXXX######XXX (13 caracteres)`
      );
    }

    const length = this.value.length;
    if (length !== 12 && length !== 13) {
      throw new Error(`RFC debe tener 12 o 13 caracteres, tiene ${length}`);
    }
  }

  /**
   * Value Objects should be comparable by value (not reference)
   * Two RFCs with same value are considered equal
   */
  equals(other: RFC): boolean {
    if (!other) return false;
    return this.value === other.value;
  }

  /**
   * Useful for logging/debugging
   * Returns the raw RFC string
   */
  toString(): string {
    return this.value;
  }

  /**
   * Check if RFC belongs to an individual taxpayer (Persona Física)
   * Individual RFCs have 13 characters (4-letter name + date + homoclave)
   *
   * Example: GACJ850101AB1
   * - GACJ = García Gómez Javier
   * - 850101 = January 1, 1985
   * - AB1 = homoclave
   */
  isIndividual(): boolean {
    return this.value.length === 13;
  }

  /**
   * Check if RFC belongs to a corporate entity (Persona Moral)
   * Corporate RFCs have 12 characters (3-letter company + date + homoclave)
   *
   * Example: GAC850101AB1
   * - GAC = Company initials
   * - 850101 = Incorporation date
   * - AB1 = homoclave
   */
  isCorporate(): boolean {
    return this.value.length === 12;
  }

  /**
   * Extract the date portion from RFC
   * Returns YYMMDD string (6 digits)
   *
   * Note: This is the date encoded in the RFC, which represents:
   * - For individuals: birth date
   * - For corporations: incorporation date
   */
  getDatePortion(): string {
    // RFC format: XXX(X)YYMMDDXXX
    // Date is always at positions -9 to -4 (6 digits before last 3)
    return this.value.substring(this.value.length - 9, this.value.length - 3);
  }

  /**
   * Extract the verification code (homoclave)
   * Returns last 3 characters
   *
   * The homoclave is a 3-character verification code used by Mexican tax authorities
   */
  getVerificationCode(): string {
    return this.value.substring(this.value.length - 3);
  }
}