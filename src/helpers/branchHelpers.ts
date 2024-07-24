import { Branch } from "../data/types";

export const isValidBranch = (branch: string): boolean => {
  return Object.values(Branch).includes(branch as Branch);
};
