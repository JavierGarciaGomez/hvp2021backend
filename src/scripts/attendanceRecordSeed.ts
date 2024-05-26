import mongoose from "mongoose";
import AttendanceRecordModel from "../data/models/AttendanceRecordModel";

import CollaboratorModel from "../models/Collaborator";
import { Branch } from "../data/types";

require("dotenv").config();

const { dbConnection } = require("../database/config");

async function seedAttendanceRecords() {
  try {
    dbConnection();

    // Clear existing records
    await AttendanceRecordModel.deleteMany({});
    // throw new Error("Shoeed failed");
    const collaborators = await CollaboratorModel.find().select("_id").exec();
    const branches = Object.values(Branch);
    const attendanceRecords = new Set();

    // Create 10 records for today with at least 5 having no endTime
    const todayDate = new Date().toISOString().split("T")[0];
    const todayRecords = [];

    while (todayRecords.length < 10) {
      const collaborator =
        collaborators[Math.floor(Math.random() * collaborators.length)]._id;
      const startTime = getRandomTimeToday();
      const noEndTime: boolean = todayRecords.length < 5 && Math.random() < 0.5; // Randomly determine if there should be no endTime
      const endTime: Date | undefined = noEndTime
        ? undefined
        : new Date(
            startTime.getTime() +
              Math.floor(Math.random() * 8 + 1) * 60 * 60 * 1000
          ); // Add 1 to 8 hours to startTime if endTime is not null
      const clockInBranch =
        branches[Math.floor(Math.random() * branches.length)];
      const clockOutBranch: Branch | undefined = endTime
        ? branches[Math.floor(Math.random() * branches.length)]
        : undefined;

      const uniqueKey = `${collaborator}_${todayDate}`;
      if (!attendanceRecords.has(uniqueKey)) {
        attendanceRecords.add(uniqueKey);
        todayRecords.push({
          collaborator,
          startTime,
          endTime,
          clockInBranch,
          clockOutBranch,
          shiftDate: todayDate,
        });
      }
    }

    // Create additional 40 records with random dates
    const pastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // One month ago
    for (let i = 0; i < 40; i++) {
      const collaborator =
        collaborators[Math.floor(Math.random() * collaborators.length)]._id;
      const shiftDate = getRandomDate(pastMonth).toISOString().split("T")[0];
      const startTime = getRandomDate(pastMonth);
      const endTime = new Date(
        startTime.getTime() + Math.floor(Math.random() * 8 + 1) * 60 * 60 * 1000
      ); // Add 1 to 8 hours to startTime
      const branch = branches[Math.floor(Math.random() * branches.length)];

      const uniqueKey = `${collaborator}_${shiftDate}`;
      if (!attendanceRecords.has(uniqueKey)) {
        attendanceRecords.add(uniqueKey);
        todayRecords.push({
          collaborator,
          startTime,
          endTime,
          clockInBranch: branch,
          clockOutBranch: branch,
          shiftDate,
        });
      }
    }

    // Save all records
    await AttendanceRecordModel.insertMany(todayRecords);

    console.log("Seed completed successfully");
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error seeding data:", error);
    await mongoose.disconnect();
  }
}

function getRandomDate(startDate: Date) {
  return new Date(
    startDate.getTime() + Math.random() * (Date.now() - startDate.getTime())
  );
}

// Generate random date within today
function getRandomTimeToday() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  return new Date(
    startOfDay.getTime() +
      Math.random() * (endOfDay.getTime() - startOfDay.getTime())
  );
}

seedAttendanceRecords();
