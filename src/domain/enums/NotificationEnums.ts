export enum NotificationReferenceType {
  TASK = "TASK",
  BILL_CREATION_INFO = "BILL_CREATION_INFO",
  AUTH_ACTIVITY = "AUTH_ACTIVITY",
  TIME_OFF_REQUEST = "TIME_OFF_REQUEST",
  USER = "USER",
}

export enum NotificationActionType {
  ASSIGNED = "ASSIGNED",
  UNASSIGNED = "UNASSIGNED",
  STATUS_CHANGED = "STATUS_CHANGED",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
  AWAITING_APPROVAL = "AWAITING_APPROVAL",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  AWAITING_REVIEW = "AWAITING_REVIEW",
}
