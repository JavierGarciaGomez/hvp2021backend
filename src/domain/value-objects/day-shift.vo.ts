export interface CollaboratorDayShift {
  id?: string;
  startingTime?: string;
  endingTime?: string;
  collaboratorId: string;
  shiftDate: string;
  branchId?: string;
  isRemote?: boolean;
}
