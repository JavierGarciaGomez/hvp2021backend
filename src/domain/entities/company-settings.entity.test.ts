import { CompanySettingsEntity, CompanySettingsProps } from './company-settings.entity';
import { RFC } from '../value-objects/rfc.vo';
import { Address } from '../value-objects/address.vo';

const createValidAddress = () => new Address({
  street: 'Av. Tulum',
  exteriorNumber: '123',
  neighborhood: 'Centro',
  city: 'Cancún',
  state: 'QROO',
  postalCode: '77500',
  country: 'México'
});

const createValidRFC = () => new RFC('HVP850101AB1');

const validCreateParams = {
  rfc: createValidRFC(),
  businessName: 'Hospital Veterinario Peninsular',
  taxRegime: '601',
  address: createValidAddress(),
  email: 'admin@hvp.com',
  phone: '9981234567',
  facturamaUseSandbox: true
};

const userId = '507f1f77bcf86cd799439011';

describe('CompanySettingsEntity', () => {
  describe('create factory method', () => {
    it('should create a new entity with auto-generated fields', () => {
      const entity = CompanySettingsEntity.create(validCreateParams, userId);

      expect(entity.id).toBe('company-settings');
      expect(entity.getRFC().value).toBe('HVP850101AB1');
      expect(entity.getBusinessName()).toBe('Hospital Veterinario Peninsular');
      expect(entity.getTaxRegime()).toBe('601');
      expect(entity.getEmail()).toBe('admin@hvp.com');
      expect(entity.getPhone()).toBe('9981234567');
      expect(entity.getFacturamaUseSandbox()).toBe(true);
      expect(entity.createdAt).toBeInstanceOf(Date);
      expect(entity.createdBy).toBe(userId);
      expect(entity.getUpdatedAt()).toBeInstanceOf(Date);
      expect(entity.getUpdatedBy()).toBe(userId);
    });

    it('should set createdAt and updatedAt to same value on creation', () => {
      const entity = CompanySettingsEntity.create(validCreateParams, userId);

      expect(entity.createdAt.getTime()).toBe(entity.getUpdatedAt().getTime());
    });

    it('should set createdBy and updatedBy to same userId on creation', () => {
      const entity = CompanySettingsEntity.create(validCreateParams, userId);

      expect(entity.createdBy).toBe(userId);
      expect(entity.getUpdatedBy()).toBe(userId);
    });
  });

  describe('reconstitute factory method', () => {
    it('should reconstitute entity from existing data', () => {
      const createdAt = new Date('2025-01-01');
      const updatedAt = new Date('2025-06-15');
      const creatorId = '507f1f77bcf86cd799439011';
      const updaterId = '507f1f77bcf86cd799439022';

      const props: CompanySettingsProps = {
        id: 'company-settings',
        rfc: createValidRFC(),
        businessName: 'HVP',
        taxRegime: '601',
        address: createValidAddress(),
        email: 'test@hvp.com',
        facturamaUseSandbox: true,
        createdAt,
        createdBy: creatorId,
        updatedAt,
        updatedBy: updaterId
      };

      const entity = CompanySettingsEntity.reconstitute(props);

      expect(entity.id).toBe('company-settings');
      expect(entity.createdAt).toBe(createdAt);
      expect(entity.createdBy).toBe(creatorId);
      expect(entity.getUpdatedAt()).toBe(updatedAt);
      expect(entity.getUpdatedBy()).toBe(updaterId);
    });
  });

  describe('updateRFC', () => {
    it('should update RFC and touch audit fields', () => {
      const entity = CompanySettingsEntity.create(validCreateParams, userId);
      const originalUpdatedAt = entity.getUpdatedAt();
      const newUserId = '507f1f77bcf86cd799439022';

      // Small delay to ensure different timestamp
      const newRFC = new RFC('XAXX010101000');
      entity.updateRFC(newRFC, newUserId);

      expect(entity.getRFC().value).toBe('XAXX010101000');
      expect(entity.getUpdatedBy()).toBe(newUserId);
    });

    it('should throw error for null RFC', () => {
      const entity = CompanySettingsEntity.create(validCreateParams, userId);

      expect(() => entity.updateRFC(null as unknown as RFC, userId))
        .toThrow('RFC no puede estar vacío');
    });
  });

  describe('updateBusinessName', () => {
    it('should update business name', () => {
      const entity = CompanySettingsEntity.create(validCreateParams, userId);
      const newUserId = '507f1f77bcf86cd799439022';

      entity.updateBusinessName('HVP Cancún', newUserId);

      expect(entity.getBusinessName()).toBe('HVP Cancún');
      expect(entity.getUpdatedBy()).toBe(newUserId);
    });

    it('should trim whitespace', () => {
      const entity = CompanySettingsEntity.create(validCreateParams, userId);

      entity.updateBusinessName('  HVP Cancún  ', userId);

      expect(entity.getBusinessName()).toBe('HVP Cancún');
    });

    it('should throw error for empty name', () => {
      const entity = CompanySettingsEntity.create(validCreateParams, userId);

      expect(() => entity.updateBusinessName('', userId))
        .toThrow('Razón social no puede estar vacía');
    });

    it('should throw error for name less than 3 characters', () => {
      const entity = CompanySettingsEntity.create(validCreateParams, userId);

      expect(() => entity.updateBusinessName('AB', userId))
        .toThrow('Razón social debe tener al menos 3 caracteres');
    });
  });

  describe('updateEmail', () => {
    it('should update email and convert to lowercase', () => {
      const entity = CompanySettingsEntity.create(validCreateParams, userId);

      entity.updateEmail('NEW@HVP.COM', userId);

      expect(entity.getEmail()).toBe('new@hvp.com');
    });

    it('should throw error for empty email', () => {
      const entity = CompanySettingsEntity.create(validCreateParams, userId);

      expect(() => entity.updateEmail('', userId))
        .toThrow('Email no puede estar vacío');
    });

    it('should throw error for invalid email format', () => {
      const entity = CompanySettingsEntity.create(validCreateParams, userId);

      expect(() => entity.updateEmail('invalid-email', userId))
        .toThrow('Email inválido');
    });
  });

  describe('updatePhone', () => {
    it('should update phone', () => {
      const entity = CompanySettingsEntity.create(validCreateParams, userId);

      entity.updatePhone('9987654321', userId);

      expect(entity.getPhone()).toBe('9987654321');
    });

    it('should allow clearing phone with undefined', () => {
      const entity = CompanySettingsEntity.create(validCreateParams, userId);

      entity.updatePhone(undefined, userId);

      expect(entity.getPhone()).toBeUndefined();
    });

    it('should throw error for invalid phone (not 10 digits)', () => {
      const entity = CompanySettingsEntity.create(validCreateParams, userId);

      expect(() => entity.updatePhone('123', userId))
        .toThrow('Teléfono inválido');
    });
  });

  describe('configureFacturama', () => {
    it('should configure Facturama with key and secret', () => {
      const entity = CompanySettingsEntity.create(validCreateParams, userId);

      entity.configureFacturama({
        apiKey: 'my-api-key',
        apiSecret: 'my-api-secret',
        useSandbox: false
      }, userId);

      expect(entity.getFacturamaApiKey()).toBe('my-api-key');
      expect(entity.getFacturamaApiSecret()).toBe('my-api-secret');
      expect(entity.getFacturamaUseSandbox()).toBe(false);
    });

    it('should allow clearing credentials', () => {
      const entity = CompanySettingsEntity.create({
        ...validCreateParams,
        facturamaApiKey: 'old-key',
        facturamaApiSecret: 'old-secret'
      }, userId);

      entity.configureFacturama({
        apiKey: undefined,
        apiSecret: undefined,
        useSandbox: true
      }, userId);

      expect(entity.getFacturamaApiKey()).toBeUndefined();
      expect(entity.getFacturamaApiSecret()).toBeUndefined();
    });

    it('should throw error if only key provided without secret', () => {
      const entity = CompanySettingsEntity.create(validCreateParams, userId);

      expect(() => entity.configureFacturama({
        apiKey: 'my-key',
        apiSecret: undefined,
        useSandbox: true
      }, userId)).toThrow('Debe proporcionar API Key y API Secret juntos');
    });

    it('should throw error if only secret provided without key', () => {
      const entity = CompanySettingsEntity.create(validCreateParams, userId);

      expect(() => entity.configureFacturama({
        apiKey: undefined,
        apiSecret: 'my-secret',
        useSandbox: true
      }, userId)).toThrow('Debe proporcionar API Key y API Secret juntos');
    });
  });

  describe('hasFacturamaConfigured', () => {
    it('should return true when both key and secret are set', () => {
      const entity = CompanySettingsEntity.create({
        ...validCreateParams,
        facturamaApiKey: 'key',
        facturamaApiSecret: 'secret'
      }, userId);

      expect(entity.hasFacturamaConfigured()).toBe(true);
    });

    it('should return false when credentials not set', () => {
      const entity = CompanySettingsEntity.create(validCreateParams, userId);

      expect(entity.hasFacturamaConfigured()).toBe(false);
    });
  });

  describe('canIssueInvoices', () => {
    it('should return true when all requirements met', () => {
      const entity = CompanySettingsEntity.create({
        ...validCreateParams,
        facturamaApiKey: 'key',
        facturamaApiSecret: 'secret'
      }, userId);

      expect(entity.canIssueInvoices()).toBe(true);
    });

    it('should return false when Facturama not configured', () => {
      const entity = CompanySettingsEntity.create(validCreateParams, userId);

      expect(entity.canIssueInvoices()).toBe(false);
    });
  });

  describe('getInvoicingStatus', () => {
    it('should return ready when all configured', () => {
      const entity = CompanySettingsEntity.create({
        ...validCreateParams,
        facturamaApiKey: 'key',
        facturamaApiSecret: 'secret'
      }, userId);

      const status = entity.getInvoicingStatus();

      expect(status.ready).toBe(true);
      expect(status.message).toBe('Listo para facturar');
    });

    it('should return not ready when Facturama missing', () => {
      const entity = CompanySettingsEntity.create(validCreateParams, userId);

      const status = entity.getInvoicingStatus();

      expect(status.ready).toBe(false);
      expect(status.message).toBe('Facturama no configurado');
    });
  });

  describe('toString', () => {
    it('should return formatted string', () => {
      const entity = CompanySettingsEntity.create(validCreateParams, userId);

      expect(entity.toString()).toBe('CompanySettings(Hospital Veterinario Peninsular - HVP850101AB1)');
    });
  });

  describe('validation on construction', () => {
    it('should throw error for missing RFC', () => {
      expect(() => CompanySettingsEntity.create({
        ...validCreateParams,
        rfc: null as unknown as RFC
      }, userId)).toThrow('RFC es requerido');
    });

    it('should throw error for empty business name', () => {
      expect(() => CompanySettingsEntity.create({
        ...validCreateParams,
        businessName: ''
      }, userId)).toThrow('Razón social es requerida');
    });

    it('should throw error for empty tax regime', () => {
      expect(() => CompanySettingsEntity.create({
        ...validCreateParams,
        taxRegime: ''
      }, userId)).toThrow('Régimen fiscal es requerido');
    });

    it('should throw error for missing address', () => {
      expect(() => CompanySettingsEntity.create({
        ...validCreateParams,
        address: null as unknown as Address
      }, userId)).toThrow('Dirección es requerida');
    });

    it('should throw error for empty email', () => {
      expect(() => CompanySettingsEntity.create({
        ...validCreateParams,
        email: ''
      }, userId)).toThrow('Email es requerido');
    });
  });
});
