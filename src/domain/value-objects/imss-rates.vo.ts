export interface ImssRates {
  sicknessAndMaternity: {
    fixedFee: ImssRate;
    surplus: ImssRate;
    cashBenefits: ImssRate;
    pensionersAndBeneficiaries: ImssRate;
  };
  disabilityAndLife: {
    disabilityAndLife: ImssRate;
  };
  workRisk: {
    workRisk: ImssRate;
  };
  daycareAndSocialBenefits: {
    daycareAndSocialBenefits: ImssRate;
  };
  afore: {
    retirementInsurance: RetiramentInsuranceTable;
    unemploymentAndOldAge: ImssRate;
  };
  infonavit: {
    infonavit: ImssRate;
  };
}

interface ImssRate {
  name: string;
  description: string;
  rate: number;
}

interface RetiramentInsuranceTable {
  year: RetirementInsuranceEntry[];
}

interface RetirementInsuranceEntry {
  umassAmount: number;
  rate: number;
}
