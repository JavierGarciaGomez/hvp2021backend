"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const billingHelpers_1 = require("./billingHelpers");
describe("isValidRFC", () => {
    it("should return true for valid RFCs", () => {
        // Valid RFCs
        expect((0, billingHelpers_1.isValidRFC)("ABCD123456E78")).toBe(true);
        expect((0, billingHelpers_1.isValidRFC)("XYZA890123DE1")).toBe(true);
        expect((0, billingHelpers_1.isValidRFC)("BCDE456789FG1")).toBe(true);
        expect((0, billingHelpers_1.isValidRFC)("GOLA791216TJ5")).toBe(true);
        expect((0, billingHelpers_1.isValidRFC)("HVE1612071L5")).toBe(true);
        // Add more valid RFCs for testing
    });
    it("should return false for invalid RFCs", () => {
        // Invalid RFCs
        expect((0, billingHelpers_1.isValidRFC)("ABCD12345E78")).toBe(false); // Missing one character
        expect((0, billingHelpers_1.isValidRFC)("XYZA8901234DE1")).toBe(false); // Too many characters
        expect((0, billingHelpers_1.isValidRFC)("BCDE456789FGH1")).toBe(false); // Invalid character
        expect((0, billingHelpers_1.isValidRFC)("GOLA791216TJ")).toBe(false);
        expect((0, billingHelpers_1.isValidRFC)("HVE1612071L51")).toBe(false);
        // Add more invalid RFCs for testing
    });
});
describe("RFC validation functions", () => {
    test("isRFCFromMoralPerson should return true for RFCs with length 12", () => {
        expect((0, billingHelpers_1.isRFCFromMoralPerson)("ABC123456789")).toBe(true);
        expect((0, billingHelpers_1.isRFCFromMoralPerson)("ABCDEFGHIJKL")).toBe(true);
        expect((0, billingHelpers_1.isRFCFromMoralPerson)("ABC123")).toBe(false);
        expect((0, billingHelpers_1.isRFCFromMoralPerson)("ABCDEFGHIJKLM")).toBe(false);
    });
    test("isRFCFromPhysicalPerson should return true for RFCs with length 13", () => {
        expect((0, billingHelpers_1.isRFCFromPhysicalPerson)("ABC1234567890")).toBe(true);
        expect((0, billingHelpers_1.isRFCFromPhysicalPerson)("ABCDEFGHIJKLM")).toBe(true);
        expect((0, billingHelpers_1.isRFCFromPhysicalPerson)("ABC123")).toBe(false);
        expect((0, billingHelpers_1.isRFCFromPhysicalPerson)("ABCDEFGHIJKLMN")).toBe(false);
    });
});
describe("Fiscal regime validation functions", () => {
    test("isFiscalRegimeValidForMoralPerson should return true for valid moral person regimes", () => {
        expect((0, billingHelpers_1.isFiscalRegimeValidForMoralPerson)("601")).toBe(true);
        expect((0, billingHelpers_1.isFiscalRegimeValidForMoralPerson)("603")).toBe(true);
        expect((0, billingHelpers_1.isFiscalRegimeValidForMoralPerson)("605")).toBe(false);
        expect((0, billingHelpers_1.isFiscalRegimeValidForMoralPerson)("999")).toBe(false);
    });
    test("isFiscalRegimeValidForPhysicalPerson should return true for valid physical person regimes", () => {
        expect((0, billingHelpers_1.isFiscalRegimeValidForPhysicalPerson)("605")).toBe(true);
        expect((0, billingHelpers_1.isFiscalRegimeValidForPhysicalPerson)("601")).toBe(false);
        expect((0, billingHelpers_1.isFiscalRegimeValidForPhysicalPerson)("999")).toBe(false);
    });
});
describe("Invoice usage validation functions", () => {
    test("isInvoiceUsageValidForMoralPerson should return true for valid invoice usage for moral persons", () => {
        expect((0, billingHelpers_1.isInvoiceUsageValidForMoralPerson)("G01")).toBe(true);
        expect((0, billingHelpers_1.isInvoiceUsageValidForMoralPerson)("CN01")).toBe(false);
    });
    test("isInvoiceUsageValidForPhysicalPerson should return true for valid invoice usage for physical persons", () => {
        expect((0, billingHelpers_1.isInvoiceUsageValidForPhysicalPerson)("G02")).toBe(true);
        expect((0, billingHelpers_1.isInvoiceUsageValidForPhysicalPerson)("G01")).toBe(true);
    });
});
