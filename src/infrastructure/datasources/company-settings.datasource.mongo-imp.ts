import { CompanySettingsDatasource } from "../../domain/datasources/company-settings.datasource";
import { CompanySettingsEntity } from "../../domain/entities";
import { CompanySettingsModel } from "../db/mongo/models/company-settings.model";

/**
 * MongoDB implementation of CompanySettingsDatasource
 * Singleton datasource - only one document exists in collection
 */
export class CompanySettingsDatasourceMongoImp implements CompanySettingsDatasource {
  /**
   * Get singleton company settings
   */
  async get(): Promise<CompanySettingsEntity | null> {
    const document = await CompanySettingsModel.findOne();

    if (!document) {
      return null;
    }

    return CompanySettingsEntity.fromDocument(document);
  }

  /**
   * Create initial company settings
   * @throws Error if company settings already exist
   */
  async create(entity: CompanySettingsEntity): Promise<CompanySettingsEntity> {
    // Check if already exists
    const existing = await CompanySettingsModel.findOne();
    if (existing) {
      throw new Error("CompanySettings already exist. Use update() instead.");
    }

    const document = new CompanySettingsModel({
      name: entity.name,
      rfc: entity.rfc,
      employerRegistration: entity.employerRegistration,
      expeditionZipCode: entity.expeditionZipCode,
      federalEntityKey: entity.federalEntityKey,
      fiscalAddress: entity.fiscalAddress,
      createdBy: entity.createdBy,
    });

    const saved = await document.save();
    return CompanySettingsEntity.fromDocument(saved);
  }

  /**
   * Update company settings
   */
  async update(entity: CompanySettingsEntity): Promise<CompanySettingsEntity> {
    const updated = await CompanySettingsModel.findOneAndUpdate(
      {}, // Find the singleton document
      {
        name: entity.name,
        rfc: entity.rfc,
        employerRegistration: entity.employerRegistration,
        expeditionZipCode: entity.expeditionZipCode,
        federalEntityKey: entity.federalEntityKey,
        fiscalAddress: entity.fiscalAddress,
        updatedBy: entity.updatedBy,
      },
      {
        new: true, // Return updated document
        upsert: false, // Don't create if doesn't exist
      }
    );

    if (!updated) {
      throw new Error("CompanySettings not found. Use create() first.");
    }

    return CompanySettingsEntity.fromDocument(updated);
  }

  /**
   * Delete company settings
   * Use with caution!
   */
  async delete(): Promise<void> {
    await CompanySettingsModel.deleteMany({});
  }
}
