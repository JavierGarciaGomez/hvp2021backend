import { Schema } from "mongoose";
import { TimeOffStatus, TimeOffType } from "../../../shared";

interface TimeOffRequestFixture {
  _id?: Schema.Types.ObjectId;
  approvalDate?: Date;
  collaborator: Schema.Types.ObjectId;
  createdAt: Date;
  createdBy: Schema.Types.ObjectId;
  reason?: string;
  requestedAt: Date;
  requestedDays: Date[];
  status: TimeOffStatus;
  timeOffType: TimeOffType;
  updatedAt: Date;
  updatedBy: Schema.Types.ObjectId;
}

const timeOffRequestsFixture: TimeOffRequestFixture[] = [
  {
    collaborator: new Schema.Types.ObjectId("60a7c9c6e3e7a1f3a4b3e3e9"),
    createdAt: new Date(),
    createdBy: new Schema.Types.ObjectId("60a7c9c6e3e7a1f3a4b3e3e9"),
    requestedAt: new Date(),
    requestedDays: [
      new Date("2022-01-30"),
      new Date("2022-01-31"),
      new Date("2022-02-01"),
      new Date("2022-02-02"),
      new Date("2022-02-03"),
      new Date("2022-02-04"),
      new Date("2022-02-06"),
      new Date("2022-02-07"),
      new Date("2022-02-08"),
      new Date("2022-02-09"),
      new Date("2022-02-10"),
      new Date("2022-02-11"),
    ],
    status: TimeOffStatus.Approved,
    timeOffType: TimeOffType.Vacation,
    updatedAt: new Date(),
    updatedBy: new Schema.Types.ObjectId("60a7c9c6e3e7a1f3a4b3e3e9"),
  },
  {
    collaborator: new Schema.Types.ObjectId("60a7c9c6e3e7a1f3a4b3e3e9"),
    createdAt: new Date(),
    createdBy: new Schema.Types.ObjectId("60a7c9c6e3e7a1f3a4b3e3e9"),
    requestedAt: new Date(),
    requestedDays: [
      new Date("2023-01-30"),
      new Date("2023-01-31"),
      new Date("2023-02-01"),
      new Date("2023-02-02"),
      new Date("2023-02-03"),
      new Date("2023-02-04"),
      new Date("2023-02-06"),
      new Date("2023-02-07"),
      new Date("2023-02-08"),
      new Date("2023-02-09"),
      new Date("2023-02-10"),
      new Date("2023-02-11"),
    ],
    status: TimeOffStatus.Approved,
    timeOffType: TimeOffType.Vacation,
    updatedAt: new Date(),
    updatedBy: new Schema.Types.ObjectId("60a7c9c6e3e7a1f3a4b3e3e9"),
  },
  {
    collaborator: new Schema.Types.ObjectId("60a7c9c6e3e7a1f3a4b3e3e9"),
    createdAt: new Date(),
    createdBy: new Schema.Types.ObjectId("60a7c9c6e3e7a1f3a4b3e3e9"),
    requestedAt: new Date(),
    requestedDays: [new Date("2023-10-01"), new Date("2023-10-02")],
    status: TimeOffStatus.Pending,
    timeOffType: TimeOffType.Vacation,
    updatedAt: new Date(),
    updatedBy: new Schema.Types.ObjectId("60a7c9c6e3e7a1f3a4b3e3e9"),
  },
  {
    collaborator: new Schema.Types.ObjectId("60a7c9c6e3e7a1f3a4b3e3e9"),
    createdAt: new Date(),
    createdBy: new Schema.Types.ObjectId("60a7c9c6e3e7a1f3a4b3e3e9"),
    requestedAt: new Date(),
    requestedDays: [new Date("2023-04-01"), new Date("2023-04-02")],
    status: TimeOffStatus.Pending,
    timeOffType: TimeOffType.dayLeave,
    updatedAt: new Date(),
    updatedBy: new Schema.Types.ObjectId("60a7c9c6e3e7a1f3a4b3e3e9"),
  },
  {
    collaborator: new Schema.Types.ObjectId("60a7c9c6e3e7a1f3a4b3e3e9"),
    createdAt: new Date(),
    createdBy: new Schema.Types.ObjectId("60a7c9c6e3e7a1f3a4b3e3e9"),
    requestedAt: new Date(),
    requestedDays: [new Date("2023-05-01"), new Date("2023-05-02")],
    status: TimeOffStatus.Pending,
    timeOffType: TimeOffType.partialPermission,
    updatedAt: new Date(),
    updatedBy: new Schema.Types.ObjectId("60a7c9c6e3e7a1f3a4b3e3e9"),
  },
];

export default timeOffRequestsFixture;
