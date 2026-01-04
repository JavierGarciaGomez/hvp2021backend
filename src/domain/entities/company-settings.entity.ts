import { RFC } from '../value-objects/rfc.vo';
import { Address } from '../value-objects/address.vo';

/**
 * CompanySettings Entity
 *
 * LEARNING POINTS:
 *
 * 1. This is an ENTITY because:
 *    - It has identity (ID)
 *    - It can change over time while remaining the same company
 *    - Two instances with same ID are the same company
 *
 * 2. It's RICH, not anemic:
 *    - Has business methods (updateRFC, updateAddress, etc.)
 *    - Validates business rules
 *    - Encapsulates behavior, not just data
 *
 * 3. Uses Value Objects:
 *    - RFC and Address are VOs
 *    - Entity delegates validation to VOs
 *
 * 4. Factory method pattern:
 *    - create() for new instances
 *    - reconstitute() for loading from DB
 */

export interface CompanySettingsProps {
  id: string;
  rfc: RFC;
  businessName: string;
  taxRegime: string;
  address: Address;
  email: string;
  phone?: string;
  facturamaApiKey?: string;
  facturamaApiSecret?: string;
  facturamaUseSandbox: boolean;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
}

export class CompanySettingsEntity {
  readonly id: string;
  private rfc: RFC;
  private businessName: string;
  private taxRegime: string;
  private address: Address;
  private email: string;
  private phone?: string;
  private facturamaApiKey?: string;
  private facturamaApiSecret?: string;
  private facturamaUseSandbox: boolean;
  readonly createdAt: Date;
  readonly createdBy: string;
  private updatedAt: Date;
  private updatedBy: string;

  private constructor(props: CompanySettingsProps) {
    this.id = props.id;
    this.rfc = props.rfc;
    this.businessName = props.businessName;
    this.taxRegime = props.taxRegime;
    this.address = props.address;
    this.email = props.email;
    this.phone = props.phone;
    this.facturamaApiKey = props.facturamaApiKey;
    this.facturamaApiSecret = props.facturamaApiSecret;
    this.facturamaUseSandbox = props.facturamaUseSandbox;
    this.createdAt = props.createdAt;
    this.createdBy = props.createdBy;
    this.updatedAt = props.updatedAt;
    this.updatedBy = props.updatedBy;
    this.validate();
  }

  // Getters
  getRFC(): RFC { return this.rfc; }
  getBusinessName(): string { return this.businessName; }
  getTaxRegime(): string { return this.taxRegime; }
  getAddress(): Address { return this.address; }
  getEmail(): string { return this.email; }
  getPhone(): string | undefined { return this.phone; }
  getFacturamaApiKey(): string | undefined { return this.facturamaApiKey; }
  getFacturamaApiSecret(): string | undefined { return this.facturamaApiSecret; }
  getFacturamaUseSandbox(): boolean { return this.facturamaUseSandbox; }
  getCreatedBy(): string { return this.createdBy; }
  getUpdatedAt(): Date { return this.updatedAt; }
  getUpdatedBy(): string { return this.updatedBy; }

  // Factory Methods
  static create(params: Omit<CompanySettingsProps, 'id' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>, userId: string): CompanySettingsEntity {
    const now = new Date();
    return new CompanySettingsEntity({
      ...params,
      id: 'company-settings',
      createdAt: now,
      createdBy: userId,
      updatedAt: now,
      updatedBy: userId
    });
  }

  static reconstitute(props: CompanySettingsProps): CompanySettingsEntity {
    return new CompanySettingsEntity(props);
  }

  // Business Methods
  updateRFC(newRFC: RFC, userId: string): void {
    if (!newRFC) throw new Error('RFC no puede estar vacío');
    this.rfc = newRFC;
    this.touch(userId);
  }

  updateBusinessName(newName: string, userId: string): void {
    const trimmed = newName.trim();
    if (!trimmed) throw new Error('Razón social no puede estar vacía');
    if (trimmed.length < 3) throw new Error('Razón social debe tener al menos 3 caracteres');
    this.businessName = trimmed;
    this.touch(userId);
  }

  updateTaxRegime(newRegime: string, userId: string): void {
    const trimmed = newRegime.trim();
    if (!trimmed) throw new Error('Régimen fiscal no puede estar vacío');
    this.taxRegime = trimmed;
    this.touch(userId);
  }

  updateAddress(newAddress: Address, userId: string): void {
    if (!newAddress) throw new Error('Dirección no puede estar vacía');
    if (!newAddress.isComplete()) throw new Error('Dirección incompleta para facturación');
    this.address = newAddress;
    this.touch(userId);
  }

  updateEmail(newEmail: string, userId: string): void {
    const trimmed = newEmail.trim().toLowerCase();
    if (!trimmed) throw new Error('Email no puede estar vacío');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) throw new Error(`Email inválido: ${trimmed}`);
    this.email = trimmed;
    this.touch(userId);
  }

  updatePhone(newPhone: string | undefined, userId: string): void {
    if (newPhone) {
      const trimmed = newPhone.trim();
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(trimmed)) throw new Error(`Teléfono inválido: ${trimmed}. Debe ser 10 dígitos`);
      this.phone = trimmed;
    } else {
      this.phone = undefined;
    }
    this.touch(userId);
  }

  configureFacturama(params: { apiKey?: string; apiSecret?: string; useSandbox: boolean }, userId: string): void {
    const hasKey = !!params.apiKey?.trim();
    const hasSecret = !!params.apiSecret?.trim();
    if (hasKey !== hasSecret) throw new Error('Debe proporcionar API Key y API Secret juntos, o ninguno');
    this.facturamaApiKey = hasKey ? params.apiKey!.trim() : undefined;
    this.facturamaApiSecret = hasSecret ? params.apiSecret!.trim() : undefined;
    this.facturamaUseSandbox = params.useSandbox;
    this.touch(userId);
  }

  hasFacturamaConfigured(): boolean {
    return !!(this.facturamaApiKey && this.facturamaApiSecret);
  }

  canIssueInvoices(): boolean {
    return this.rfc !== null && this.businessName.length > 0 && this.address.isComplete() && this.email.length > 0 && this.hasFacturamaConfigured();
  }

  getInvoicingStatus(): { ready: boolean; message: string } {
    if (!this.rfc) return { ready: false, message: 'RFC no configurado' };
    if (!this.businessName) return { ready: false, message: 'Razón social no configurada' };
    if (!this.address.isComplete()) return { ready: false, message: 'Dirección fiscal incompleta' };
    if (!this.email) return { ready: false, message: 'Email no configurado' };
    if (!this.hasFacturamaConfigured()) return { ready: false, message: 'Facturama no configurado' };
    return { ready: true, message: 'Listo para facturar' };
  }

  private touch(userId: string): void {
    this.updatedAt = new Date();
    this.updatedBy = userId;
  }

  private validate(): void {
    if (!this.id) throw new Error('ID es requerido');
    if (!this.rfc) throw new Error('RFC es requerido');
    if (!this.businessName || !this.businessName.trim()) throw new Error('Razón social es requerida');
    if (!this.taxRegime || !this.taxRegime.trim()) throw new Error('Régimen fiscal es requerido');
    if (!this.address) throw new Error('Dirección es requerida');
    if (!this.email || !this.email.trim()) throw new Error('Email es requerido');
  }

  toString(): string {
    return `CompanySettings(${this.businessName} - ${this.rfc.value})`;
  }
}
