import { RFC } from './rfc.vo';

describe('RFC Value Object', () => {
  describe('construction', () => {
    it('should create a valid individual RFC (13 characters)', () => {
      const rfc = new RFC('GACJ850101AB1');
      expect(rfc.value).toBe('GACJ850101AB1');
    });

    it('should create a valid corporate RFC (12 characters)', () => {
      const rfc = new RFC('GAC850101AB1');
      expect(rfc.value).toBe('GAC850101AB1');
    });

    it('should convert lowercase to uppercase', () => {
      const rfc = new RFC('gacj850101ab1');
      expect(rfc.value).toBe('GACJ850101AB1');
    });

    it('should trim whitespace', () => {
      const rfc = new RFC('  GACJ850101AB1  ');
      expect(rfc.value).toBe('GACJ850101AB1');
    });

    it('should accept RFC with Ñ character', () => {
      const rfc = new RFC('ÑUÑO850101AB1');
      expect(rfc.value).toBe('ÑUÑO850101AB1');
    });

    it('should accept RFC with & character', () => {
      const rfc = new RFC('A&B850101AB1');
      expect(rfc.value).toBe('A&B850101AB1');
    });
  });

  describe('validation errors', () => {
    it('should throw error for empty RFC', () => {
      expect(() => new RFC('')).toThrow('RFC no puede estar vacío');
    });

    it('should throw error for whitespace-only RFC', () => {
      expect(() => new RFC('   ')).toThrow('RFC no puede estar vacío');
    });

    it('should throw error for RFC too short', () => {
      expect(() => new RFC('GACJ85010')).toThrow('RFC inválido');
    });

    it('should throw error for RFC too long', () => {
      expect(() => new RFC('GACJ850101AB12')).toThrow('RFC inválido');
    });

    it('should throw error for invalid format (letters where digits expected)', () => {
      expect(() => new RFC('GACJABCDEFAB1')).toThrow('RFC inválido');
    });

    it('should throw error for invalid format (digits where letters expected)', () => {
      expect(() => new RFC('1234850101AB1')).toThrow('RFC inválido');
    });
  });

  describe('isIndividual', () => {
    it('should return true for 13-character RFC', () => {
      const rfc = new RFC('GACJ850101AB1');
      expect(rfc.isIndividual()).toBe(true);
    });

    it('should return false for 12-character RFC', () => {
      const rfc = new RFC('GAC850101AB1');
      expect(rfc.isIndividual()).toBe(false);
    });
  });

  describe('isCorporate', () => {
    it('should return true for 12-character RFC', () => {
      const rfc = new RFC('GAC850101AB1');
      expect(rfc.isCorporate()).toBe(true);
    });

    it('should return false for 13-character RFC', () => {
      const rfc = new RFC('GACJ850101AB1');
      expect(rfc.isCorporate()).toBe(false);
    });
  });

  describe('getDatePortion', () => {
    it('should extract date from individual RFC', () => {
      const rfc = new RFC('GACJ850101AB1');
      expect(rfc.getDatePortion()).toBe('850101');
    });

    it('should extract date from corporate RFC', () => {
      const rfc = new RFC('GAC201231AB1');
      expect(rfc.getDatePortion()).toBe('201231');
    });
  });

  describe('getVerificationCode', () => {
    it('should extract homoclave from RFC', () => {
      const rfc = new RFC('GACJ850101XY9');
      expect(rfc.getVerificationCode()).toBe('XY9');
    });
  });

  describe('equals', () => {
    it('should return true for RFCs with same value', () => {
      const rfc1 = new RFC('GACJ850101AB1');
      const rfc2 = new RFC('GACJ850101AB1');
      expect(rfc1.equals(rfc2)).toBe(true);
    });

    it('should return true regardless of case', () => {
      const rfc1 = new RFC('gacj850101ab1');
      const rfc2 = new RFC('GACJ850101AB1');
      expect(rfc1.equals(rfc2)).toBe(true);
    });

    it('should return false for different RFCs', () => {
      const rfc1 = new RFC('GACJ850101AB1');
      const rfc2 = new RFC('GAC850101AB1');
      expect(rfc1.equals(rfc2)).toBe(false);
    });

    it('should return false when comparing with null/undefined', () => {
      const rfc = new RFC('GACJ850101AB1');
      expect(rfc.equals(null as unknown as RFC)).toBe(false);
      expect(rfc.equals(undefined as unknown as RFC)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the RFC value', () => {
      const rfc = new RFC('GACJ850101AB1');
      expect(rfc.toString()).toBe('GACJ850101AB1');
    });
  });

  describe('immutability', () => {
    it('should be frozen', () => {
      const rfc = new RFC('GACJ850101AB1');
      expect(Object.isFrozen(rfc)).toBe(true);
    });

    it('should not allow modification of value property', () => {
      const rfc = new RFC('GACJ850101AB1');
      expect(() => {
        (rfc as { value: string }).value = 'GAC850101AB1';
      }).toThrow();
    });
  });
});
