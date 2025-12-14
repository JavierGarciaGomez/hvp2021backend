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
  oldAge: {
    retirement: ImssRate;
    oldAge: OldAgeRetirementRate[];
  };
  infonavit: {
    infonavit: ImssRate;
  };
}

interface ImssRate {
  name?: string;
  description?: string;
  rate: number;
}

interface OldAgeRetirementRate {
  umaLimit: number;
  rate: number;
}
