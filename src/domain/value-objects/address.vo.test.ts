import { Address, AddressProps } from './address.vo';

const validAddressProps: AddressProps = {
  street: 'Av. Tulum',
  exteriorNumber: '123',
  interiorNumber: 'A',
  neighborhood: 'Centro',
  city: 'Cancún',
  state: 'QROO',
  postalCode: '77500',
  country: 'México'
};

describe('Address Value Object', () => {
  describe('construction', () => {
    it('should create a valid address with all fields', () => {
      const address = new Address(validAddressProps);

      expect(address.street).toBe('Av. Tulum');
      expect(address.exteriorNumber).toBe('123');
      expect(address.interiorNumber).toBe('A');
      expect(address.neighborhood).toBe('Centro');
      expect(address.city).toBe('Cancún');
      expect(address.state).toBe('QROO');
      expect(address.postalCode).toBe('77500');
      expect(address.country).toBe('México');
    });

    it('should create a valid address without interior number', () => {
      const props = { ...validAddressProps, interiorNumber: undefined };
      const address = new Address(props);

      expect(address.interiorNumber).toBeUndefined();
    });

    it('should trim whitespace from all fields', () => {
      const props: AddressProps = {
        street: '  Av. Tulum  ',
        exteriorNumber: ' 123 ',
        interiorNumber: ' A ',
        neighborhood: ' Centro ',
        city: ' Cancún ',
        state: 'QROO',
        postalCode: ' 77500 ',
        country: ' México '
      };
      const address = new Address(props);

      expect(address.street).toBe('Av. Tulum');
      expect(address.exteriorNumber).toBe('123');
      expect(address.interiorNumber).toBe('A');
      expect(address.neighborhood).toBe('Centro');
      expect(address.city).toBe('Cancún');
      expect(address.postalCode).toBe('77500');
      expect(address.country).toBe('México');
    });
  });

  describe('validation errors', () => {
    it('should throw error for empty street', () => {
      const props = { ...validAddressProps, street: '' };
      expect(() => new Address(props)).toThrow('Calle es requerida');
    });

    it('should throw error for empty exterior number', () => {
      const props = { ...validAddressProps, exteriorNumber: '' };
      expect(() => new Address(props)).toThrow('Número exterior es requerido');
    });

    it('should throw error for empty neighborhood', () => {
      const props = { ...validAddressProps, neighborhood: '' };
      expect(() => new Address(props)).toThrow('Colonia es requerida');
    });

    it('should throw error for empty city', () => {
      const props = { ...validAddressProps, city: '' };
      expect(() => new Address(props)).toThrow('Ciudad es requerida');
    });

    it('should throw error for empty postal code', () => {
      const props = { ...validAddressProps, postalCode: '' };
      expect(() => new Address(props)).toThrow('Código postal es requerido');
    });

    it('should throw error for empty country', () => {
      const props = { ...validAddressProps, country: '' };
      expect(() => new Address(props)).toThrow('País es requerido');
    });

    it('should throw error for invalid postal code (not 5 digits)', () => {
      const props = { ...validAddressProps, postalCode: '1234' };
      expect(() => new Address(props)).toThrow('Código postal inválido');
    });

    it('should throw error for invalid postal code (letters)', () => {
      const props = { ...validAddressProps, postalCode: 'ABCDE' };
      expect(() => new Address(props)).toThrow('Código postal inválido');
    });

    it('should throw error for invalid state code', () => {
      const props = { ...validAddressProps, state: 'INVALID' as any };
      expect(() => new Address(props)).toThrow('Código de estado inválido');
    });

    it('should throw error for non-Mexico country', () => {
      const props = { ...validAddressProps, country: 'USA' };
      expect(() => new Address(props)).toThrow('Solo se soporta México como país');
    });

    it('should accept "mexico" without accent', () => {
      const props = { ...validAddressProps, country: 'Mexico' };
      const address = new Address(props);
      expect(address.country).toBe('Mexico');
    });
  });

  describe('isComplete', () => {
    it('should return true for complete address', () => {
      const address = new Address(validAddressProps);
      expect(address.isComplete()).toBe(true);
    });
  });

  describe('formatForInvoice', () => {
    it('should format address for CFDI invoice', () => {
      const address = new Address(validAddressProps);
      const formatted = address.formatForInvoice();

      expect(formatted).toContain('Av. Tulum');
      expect(formatted).toContain('123');
      expect(formatted).toContain('Int. A');
      expect(formatted).toContain('Centro');
      expect(formatted).toContain('Cancún');
      expect(formatted).toContain('Quintana Roo'); // Full state name
      expect(formatted).toContain('C.P. 77500');
      expect(formatted).toContain('México');
    });

    it('should format without interior number when not provided', () => {
      const props = { ...validAddressProps, interiorNumber: undefined };
      const address = new Address(props);
      const formatted = address.formatForInvoice();

      expect(formatted).not.toContain('Int.');
    });
  });

  describe('formatForDisplay', () => {
    it('should return array of formatted lines', () => {
      const address = new Address(validAddressProps);
      const lines = address.formatForDisplay();

      expect(lines).toHaveLength(5);
      expect(lines[0]).toContain('Av. Tulum');
      expect(lines[0]).toContain('123');
      expect(lines[0]).toContain('Int. A');
    });
  });

  describe('equals', () => {
    it('should return true for addresses with same values', () => {
      const address1 = new Address(validAddressProps);
      const address2 = new Address(validAddressProps);

      expect(address1.equals(address2)).toBe(true);
    });

    it('should return false for addresses with different values', () => {
      const address1 = new Address(validAddressProps);
      const address2 = new Address({ ...validAddressProps, city: 'Playa del Carmen' });

      expect(address1.equals(address2)).toBe(false);
    });

    it('should return false when comparing with null/undefined', () => {
      const address = new Address(validAddressProps);

      expect(address.equals(null as unknown as Address)).toBe(false);
      expect(address.equals(undefined as unknown as Address)).toBe(false);
    });
  });

  describe('copyWith', () => {
    it('should create new address with updated field', () => {
      const address = new Address(validAddressProps);
      const newAddress = address.copyWith({ city: 'Playa del Carmen' });

      expect(newAddress.city).toBe('Playa del Carmen');
      expect(newAddress.street).toBe(address.street); // Unchanged
      expect(address.city).toBe('Cancún'); // Original unchanged
    });

    it('should create new address with multiple updated fields', () => {
      const address = new Address(validAddressProps);
      const newAddress = address.copyWith({
        city: 'Mérida',
        state: 'YUC',
        postalCode: '97000'
      });

      expect(newAddress.city).toBe('Mérida');
      expect(newAddress.state).toBe('YUC');
      expect(newAddress.postalCode).toBe('97000');
    });
  });

  describe('toString', () => {
    it('should return formatted address string', () => {
      const address = new Address(validAddressProps);
      const str = address.toString();

      expect(str).toBe(address.formatForInvoice());
    });
  });

  describe('immutability', () => {
    it('should be frozen', () => {
      const address = new Address(validAddressProps);
      expect(Object.isFrozen(address)).toBe(true);
    });
  });
});
