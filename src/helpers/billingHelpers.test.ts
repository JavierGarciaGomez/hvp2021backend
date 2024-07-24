import {
  isFiscalRegimeValidForMoralPerson,
  isFiscalRegimeValidForPhysicalPerson,
  isInvoiceUsageValidForMoralPerson,
  isInvoiceUsageValidForPhysicalPerson,
  isRFCFromMoralPerson,
  isRFCFromPhysicalPerson,
  isValidRFC,
} from "./billingHelpers";

describe("isValidRFC", () => {
  it("should return true for valid RFCs", () => {
    // Valid RFCs
    expect(isValidRFC("ABCD123456E78")).toBe(true);
    expect(isValidRFC("XYZA890123DE1")).toBe(true);
    expect(isValidRFC("BCDE456789FG1")).toBe(true);
    expect(isValidRFC("GOLA791216TJ5")).toBe(true);
    expect(isValidRFC("HVE1612071L5")).toBe(true);
    // Add more valid RFCs for testing
  });

  it("should return false for invalid RFCs", () => {
    // Invalid RFCs
    expect(isValidRFC("ABCD12345E78")).toBe(false); // Missing one character
    expect(isValidRFC("XYZA8901234DE1")).toBe(false); // Too many characters
    expect(isValidRFC("BCDE456789FGH1")).toBe(false); // Invalid character
    expect(isValidRFC("GOLA791216TJ")).toBe(false);
    expect(isValidRFC("HVE1612071L51")).toBe(false);
    // Add more invalid RFCs for testing
  });
});

describe("RFC validation functions", () => {
  test("isRFCFromMoralPerson should return true for RFCs with length 12", () => {
    expect(isRFCFromMoralPerson("ABC123456789")).toBe(true);
    expect(isRFCFromMoralPerson("ABCDEFGHIJKL")).toBe(true);
    expect(isRFCFromMoralPerson("ABC123")).toBe(false);
    expect(isRFCFromMoralPerson("ABCDEFGHIJKLM")).toBe(false);
  });

  test("isRFCFromPhysicalPerson should return true for RFCs with length 13", () => {
    expect(isRFCFromPhysicalPerson("ABC1234567890")).toBe(true);
    expect(isRFCFromPhysicalPerson("ABCDEFGHIJKLM")).toBe(true);
    expect(isRFCFromPhysicalPerson("ABC123")).toBe(false);
    expect(isRFCFromPhysicalPerson("ABCDEFGHIJKLMN")).toBe(false);
  });
});

describe("Fiscal regime validation functions", () => {
  test("isFiscalRegimeValidForMoralPerson should return true for valid moral person regimes", () => {
    expect(isFiscalRegimeValidForMoralPerson("601")).toBe(true);
    expect(isFiscalRegimeValidForMoralPerson("603")).toBe(true);
    expect(isFiscalRegimeValidForMoralPerson("605")).toBe(false);
    expect(isFiscalRegimeValidForMoralPerson("999")).toBe(false);
  });

  test("isFiscalRegimeValidForPhysicalPerson should return true for valid physical person regimes", () => {
    expect(isFiscalRegimeValidForPhysicalPerson("605")).toBe(true);
    expect(isFiscalRegimeValidForPhysicalPerson("601")).toBe(false);
    expect(isFiscalRegimeValidForPhysicalPerson("999")).toBe(false);
  });
});

describe("Invoice usage validation functions", () => {
  test("isInvoiceUsageValidForMoralPerson should return true for valid invoice usage for moral persons", () => {
    expect(isInvoiceUsageValidForMoralPerson("G01")).toBe(true);
    expect(isInvoiceUsageValidForMoralPerson("CN01")).toBe(false);
  });

  test("isInvoiceUsageValidForPhysicalPerson should return true for valid invoice usage for physical persons", () => {
    expect(isInvoiceUsageValidForPhysicalPerson("G02")).toBe(true);
    expect(isInvoiceUsageValidForPhysicalPerson("G01")).toBe(true);
  });
});
