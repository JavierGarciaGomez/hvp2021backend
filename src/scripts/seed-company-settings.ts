/**
 * Seed Script: Company Settings
 * Creates initial company settings for Hospital Veterinario Peninsular (HVP)
 *
 * Usage: npx ts-node src/scripts/seed-company-settings.ts
 */

import mongoose from "mongoose";
import { config } from "dotenv";
import { CompanySettingsEntity } from "../domain/entities";
import { Address } from "../domain/value-objects";
import { CompanySettingsDatasourceMongoImp } from "../infrastructure/datasources/company-settings.datasource.mongo-imp";
import { CompanySettingsRepositoryImpl } from "../infrastructure/repositories/company-settings.repository.imp";
import { CompanySettingsService } from "../application/services/company-settings.service";

// Load environment variables
config();

const MONGO_URL = process.env.NODE_ENV === "production"
  ? process.env.PROD_MONGO_URL || ""
  : process.env.DEV_MONGO_URL || "";

const MONGO_DB_NAME = process.env.NODE_ENV === "production"
  ? process.env.PROD_MONGO_DB_NAME || ""
  : process.env.DEV_MONGO_DB_NAME || "";

async function seedCompanySettings() {
  try {
    console.log("🌱 Starting CompanySettings seed...");
    console.log(`📦 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`📊 Database: ${MONGO_DB_NAME}`);

    // Connect to MongoDB
    await mongoose.connect(MONGO_URL, {
      dbName: MONGO_DB_NAME,
    });
    console.log("✅ Connected to MongoDB");

    // Initialize service
    const datasource = new CompanySettingsDatasourceMongoImp();
    const repository = new CompanySettingsRepositoryImpl(datasource);
    const service = new CompanySettingsService(repository);

    // Check if already exists
    const existing = await service.get();
    if (existing) {
      console.log("⚠️  CompanySettings already exist:");
      console.log(`   Name: ${existing.name}`);
      console.log(`   RFC: ${existing.rfc}`);
      console.log("\n❓ Do you want to delete and recreate? (Ctrl+C to cancel)");

      // Wait 3 seconds for user to cancel
      await new Promise(resolve => setTimeout(resolve, 3000));

      await service.delete();
      console.log("🗑️  Deleted existing CompanySettings");
    }

    // Create new CompanySettings for HVP
    const fiscalAddress = new Address({
      street: "Calle 60",
      exteriorNumber: "491",
      interiorNumber: "",
      neighborhood: "Centro",
      city: "Mérida",
      municipality: "Mérida",
      state: "Yucatán",
      zipCode: "97000",
      country: "México",
    });

    const hvpSettings = new CompanySettingsEntity({
      name: "Hospital Veterinario Peninsular",
      rfc: "HVP970101XXX", // TODO: Replace with actual RFC
      employerRegistration: "B5510768108", // TODO: Replace with actual IMSS registration
      expeditionZipCode: "97203", // Mérida, Yucatán
      federalEntityKey: "YUC",
      fiscalAddress,
    });

    const created = await service.create(hvpSettings);

    console.log("\n✅ CompanySettings created successfully!");
    console.log("📋 Details:");
    console.log(`   ID: ${created.id}`);
    console.log(`   Name: ${created.name}`);
    console.log(`   RFC: ${created.rfc}`);
    console.log(`   Employer Registration: ${created.employerRegistration}`);
    console.log(`   Expedition Zip Code: ${created.expeditionZipCode}`);
    console.log(`   Federal Entity: ${created.federalEntityKey}`);
    console.log(`   Created At: ${created.createdAt}`);

    console.log("\n🎉 Seed completed successfully!");
  } catch (error: any) {
    console.error("\n❌ Error seeding CompanySettings:");
    console.error(error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("👋 Disconnected from MongoDB");
    process.exit(0);
  }
}

// Run seed
seedCompanySettings();
