export class TimeOffRequestEntity {
  constructor(
    public id: string,
    public collaboratorId: string,
    public startDate: Date,
    public endDate: Date,
    public status: "Pending" | "Approved" | "Rejected"
  ) {}
}
