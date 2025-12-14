export enum CommissionCalculationType {
  PROPORTIONAL = "PROPORTIONAL",
  FIXED = "FIXED",
}

export enum CommissionType {
  SIMPLE = "SIMPLE", // full commission
  MENTOREE = "MENTOREE", // 50% highest commission
  MENTOR = "MENTOR", // 50% highest commission
  ASSISTED = "ASSISTED", // 10% extra commission
  NEW_CLIENT = "NEW_CLIENT", // 50% extra commission
  VET_REQUESTED = "VET_REQUESTED", // 25% extra commission
  SALES = "SALES", // sales commisssion
}

export enum CommissionModality {
  SIMPLE = "SIMPLE",
  MENTORING = "MENTORING",
  ASSISTED = "ASSISTED",
}

export enum CommissionBonusType {
  SALES = "SALES",
  NEW_CLIENT = "NEW_CLIENT",
  VET_REQUESTED = "VET_REQUESTED",
}
