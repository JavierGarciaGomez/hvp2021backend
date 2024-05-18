import mongoose from "mongoose";
import AttendanceRecordModel from "../data/models/AttendanceRecordModel";
import { Branch } from "../data/types/attendanceRecordType";
import CollaboratorModel from "../models/Collaborator";
require("dotenv").config();

const { dbConnection } = require("../database/config");

async function seedAttendanceRecords() {
  try {
    dbConnection();

    // Clear existing records
    await AttendanceRecordModel.deleteMany({});
    // throw new Error("Seed failed");
    const collaborators = await CollaboratorModel.find().select("_id").exec();
    const branches = Object.values(Branch);
    const attendanceRecords = new Set();

    // Create 10 records for today with at least 5 having no endTime
    let todayRecordsCount = 0;
    let noEndTimeCount = 0;

    while (todayRecordsCount < 10) {
      const collaborator =
        collaborators[Math.floor(Math.random() * collaborators.length)]._id;
      const shiftDate = new Date().toISOString().split("T")[0];
      const startTime = getRandomTimeToday();
      const endTime =
        noEndTimeCount < 5
          ? undefined
          : new Date(
              startTime.getTime() +
                Math.floor(Math.random() * 8 + 1) * 60 * 60 * 1000
            ); // Add 1 to 8 hours to startTime if endTime is not null
      const branch = branches[Math.floor(Math.random() * branches.length)];

      const uniqueKey = `${collaborator}_${shiftDate}`;
      if (attendanceRecords.has(uniqueKey)) continue;

      attendanceRecords.add(uniqueKey);

      const newRecord = new AttendanceRecordModel({
        shiftDate,
        startTime,
        endTime,
        branch,
        collaborator,
      });

      await newRecord.save();
      todayRecordsCount++;
      if (!endTime) noEndTimeCount++;
    }

    // Create additional 40 records with random dates
    for (let i = 0; i < 40; i++) {
      const collaborator =
        collaborators[Math.floor(Math.random() * collaborators.length)]._id;
      const shiftDate = getRandomDate().toISOString().split("T")[0];
      const startTime = getRandomDate();
      const endTime = new Date(
        startTime.getTime() + Math.floor(Math.random() * 8 + 1) * 60 * 60 * 1000
      ); // Add 1 to 8 hours to startTime
      const branch = branches[Math.floor(Math.random() * branches.length)];

      const uniqueKey = `${collaborator}_${shiftDate}`;
      if (attendanceRecords.has(uniqueKey)) continue;

      attendanceRecords.add(uniqueKey);

      const newRecord = new AttendanceRecordModel({
        shiftDate,
        startTime,
        endTime,
        branch,
        collaborator,
      });

      await newRecord.save();
    }

    console.log("Seed completed successfully");
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error seeding data:", error);
    await mongoose.disconnect();
  }
}

function getRandomDate() {
  const now = new Date();
  const pastMonth = new Date(now.setMonth(now.getMonth() - 1));
  return new Date(
    pastMonth.getTime() + Math.random() * (Date.now() - pastMonth.getTime())
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
