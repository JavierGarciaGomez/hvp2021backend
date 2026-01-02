/**
 * Migration Script: Add CFDI fields to Collaborators and Employments
 *
 * This script adds default values for CFDI-required fields to existing records.
 *
 * Usage:
 *   npx ts-node src/scripts/migrate-cfdi-fields.ts
 *
 * What it does:
 *   1. Adds CFDI default values to Collaborators without these fields
 *   2. Adds CFDI default values to Employments without these fields
 *
 * Default values (based on HVP typical patterns):
 *   Collaborator:
 *     - contractType: "01" (Permanent)
 *     - regimeType: "02" (Salaries)
 *     - fiscalRegime: "605" (Salaries and Wages)
 *
 *   Employment:
 *     - journeyType: "03" (Mixed)
 *     - cfdiPaymentFrequency: "04" (Quincenal)
 */

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// SAT default values for HVP
const COLLABORATOR_CFDI_DEFAULTS = {
  contractType: "01", // Permanent
  regimeType: "02", // Salaries
  fiscalRegime: "605", // Sueldos y Salarios
};

const EMPLOYMENT_CFDI_DEFAULTS = {
  journeyType: "03", // Mixed
  cfdiPaymentFrequency: "04", // Quincenal
};

async function connectToDatabase() {
  const mongoUri = process.env.MONGO_URL || process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URL or MONGODB_URI environment variable not set");
  }

  console.log("🔌 Connecting to database...");
  await mongoose.connect(mongoUri);
  console.log("✅ Connected to database");
}

async function migrateCollaborators() {
  console.log("\n📋 Migrating Collaborators...");

  const CollaboratorModel = mongoose.connection.collection("collaborators");

  // Count records without CFDI fields
  const countWithoutCfdi = await CollaboratorModel.countDocuments({
    $or: [
      { contractType: { $exists: false } },
      { regimeType: { $exists: false } },
      { fiscalRegime: { $exists: false } },
    ],
  });

  console.log(`   Found ${countWithoutCfdi} collaborators without CFDI fields`);

  if (countWithoutCfdi === 0) {
    console.log("   ✅ All collaborators already have CFDI fields");
    return { updated: 0, total: await CollaboratorModel.countDocuments() };
  }

  // Update records that don't have contractType
  const resultContractType = await CollaboratorModel.updateMany(
    { contractType: { $exists: false } },
    { $set: { contractType: COLLABORATOR_CFDI_DEFAULTS.contractType } }
  );

  // Update records that don't have regimeType
  const resultRegimeType = await CollaboratorModel.updateMany(
    { regimeType: { $exists: false } },
    { $set: { regimeType: COLLABORATOR_CFDI_DEFAULTS.regimeType } }
  );

  // Update records that don't have fiscalRegime
  const resultFiscalRegime = await CollaboratorModel.updateMany(
    { fiscalRegime: { $exists: false } },
    { $set: { fiscalRegime: COLLABORATOR_CFDI_DEFAULTS.fiscalRegime } }
  );

  console.log(
    `   ✅ Updated contractType: ${resultContractType.modifiedCount} records`
  );
  console.log(
    `   ✅ Updated regimeType: ${resultRegimeType.modifiedCount} records`
  );
  console.log(
    `   ✅ Updated fiscalRegime: ${resultFiscalRegime.modifiedCount} records`
  );

  return {
    updated: Math.max(
      resultContractType.modifiedCount,
      resultRegimeType.modifiedCount,
      resultFiscalRegime.modifiedCount
    ),
    total: await CollaboratorModel.countDocuments(),
  };
}

async function migrateEmployments() {
  console.log("\n💼 Migrating Employments...");

  const EmploymentModel = mongoose.connection.collection("employments");

  // Count records without CFDI fields
  const countWithoutCfdi = await EmploymentModel.countDocuments({
    $or: [
      { journeyType: { $exists: false } },
      { cfdiPaymentFrequency: { $exists: false } },
    ],
  });

  console.log(`   Found ${countWithoutCfdi} employments without CFDI fields`);

  if (countWithoutCfdi === 0) {
    console.log("   ✅ All employments already have CFDI fields");
    return { updated: 0, total: await EmploymentModel.countDocuments() };
  }

  // Update records that don't have journeyType
  const resultJourneyType = await EmploymentModel.updateMany(
    { journeyType: { $exists: false } },
    { $set: { journeyType: EMPLOYMENT_CFDI_DEFAULTS.journeyType } }
  );

  // Update records that don't have cfdiPaymentFrequency
  const resultPaymentFrequency = await EmploymentModel.updateMany(
    { cfdiPaymentFrequency: { $exists: false } },
    { $set: { cfdiPaymentFrequency: EMPLOYMENT_CFDI_DEFAULTS.cfdiPaymentFrequency } }
  );

  console.log(
    `   ✅ Updated journeyType: ${resultJourneyType.modifiedCount} records`
  );
  console.log(
    `   ✅ Updated cfdiPaymentFrequency: ${resultPaymentFrequency.modifiedCount} records`
  );

  return {
    updated: Math.max(
      resultJourneyType.modifiedCount,
      resultPaymentFrequency.modifiedCount
    ),
    total: await EmploymentModel.countDocuments(),
  };
}

async function generateReport(
  collaboratorResult: { updated: number; total: number },
  employmentResult: { updated: number; total: number }
) {
  console.log("\n" + "=".repeat(50));
  console.log("📊 MIGRATION REPORT");
  console.log("=".repeat(50));
  console.log("\nCollaborators:");
  console.log(`   Total records: ${collaboratorResult.total}`);
  console.log(`   Records updated: ${collaboratorResult.updated}`);
  console.log("\nEmployments:");
  console.log(`   Total records: ${employmentResult.total}`);
  console.log(`   Records updated: ${employmentResult.updated}`);
  console.log("\nDefault values applied:");
  console.log("   Collaborator.contractType: 01 (Permanent)");
  console.log("   Collaborator.regimeType: 02 (Salaries)");
  console.log("   Collaborator.fiscalRegime: 605 (Sueldos y Salarios)");
  console.log("   Employment.journeyType: 03 (Mixed)");
  console.log("   Employment.cfdiPaymentFrequency: 04 (Quincenal)");
  console.log("\n" + "=".repeat(50));
}

async function main() {
  console.log("🚀 Starting CFDI Fields Migration");
  console.log("=".repeat(50));

  try {
    await connectToDatabase();

    const collaboratorResult = await migrateCollaborators();
    const employmentResult = await migrateEmployments();

    await generateReport(collaboratorResult, employmentResult);

    console.log("\n✅ Migration completed successfully!");
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from database");
  }
}

// Run if executed directly
main();
