import dayjs from "dayjs";

export interface CollaboratorDayShift {
  id?: string;
  startingTime?: string;
  endingTime?: string;
  collaboratorId: string;
  shiftDate: string;
  branchId?: string;
  isRemote?: boolean;
}

export interface CollaboratorShiftDayJs
  extends Omit<
    CollaboratorDayShift,
    "shiftDate" | "startingTime" | "endingTime"
  > {
  shiftDate: dayjs.Dayjs;
  startingTime?: dayjs.Dayjs;
  endingTime?: dayjs.Dayjs;
}
