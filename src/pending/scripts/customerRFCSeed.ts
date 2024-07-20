import mongoose from "mongoose";
import CollaboratorModel from "../infrastructure/db/mongo/models/CollaboratorModel";
import CustomerRFCModel from "../infrastructure/db/mongo/models/CustomerRFCModel";
require("dotenv").config();

const { dbConnection } = require("../database/config");

async function seedCustomerRFC() {
  try {
    dbConnection();

    // Clear existing records
    await CustomerRFCModel.deleteMany({});
    const collaborators = await CollaboratorModel.find().select("_id").exec();

    const customerRFCs = [];

    // Create 100 customer RFC records
    for (let i = 0; i < 100; i++) {
      const collaborator =
        collaborators[Math.floor(Math.random() * collaborators.length)]._id;
      const name = `Customer ${i + 1}`;
      const rfc = `RFC${String(i + 1).padStart(10, "0")}`;
      const invoiceUsage = ["G01", "G02", "G03", "P01"][i % 4];
      const fiscalRegime = [
        "601",
        "603",
        "605",
        "606",
        "607",
        "608",
        "610",
        "611",
        "612",
        "614",
        "615",
        "616",
        "620",
        "621",
        "622",
        "623",
        "624",
        "625",
        "626",
      ][i % 19];
      const postalCode = String(97000 + (i % 100)).padStart(5, "0");
      const isValidated = i % 2 === 0;
      const createdAt = new Date(
        Date.now() - Math.floor(Math.random() * 1000000000)
      );
      const updatedAt = new Date();

      customerRFCs.push({
        name,
        rfc,
        invoice_usage: invoiceUsage,
        fiscal_regime: fiscalRegime,
        postal_code: postalCode,
        isValidated,
        createdBy: collaborator,
        updatedBy: collaborator,
        createdAt,
        updatedAt,
      });
    }

    // Save all records
    await CustomerRFCModel.insertMany(customerRFCs);

    console.log("CustomerRFC collection has been seeded with 100 elements.");
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error seeding data:", error);
    await mongoose.disconnect();
  }
}

seedCustomerRFC();
