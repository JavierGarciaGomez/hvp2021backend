import mongoose from "mongoose";
import { CustomerRFCModel } from "../../infrastructure";
import billCreationInfoModel from "../../infrastructure/db/mongo/models/BillCreationInfoModel";

require("dotenv").config();

const { dbConnection } = require("../database/config");

async function customSeed() {
  try {
    dbConnection();

    // Clear existing records
    await CustomerRFCModel.deleteMany({});
    await billCreationInfoModel.deleteMany({});

    console.log("CustomerRFC collection has been seeded with 100 elements.");
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error seeding data:", error);
    await mongoose.disconnect();
  }
}

customSeed();
