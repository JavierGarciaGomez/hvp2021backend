import { ICompanySettingsRepository } from '../../domain/repositories/company-settings.repository';
import { CompanySettingsEntity } from '../../domain/entities/company-settings.entity';
import { CompanySettingsModel } from '../db/mongo/models/company-settings.model';
import { CompanySettingsMapper } from '../mappers/company-settings.mapper';

/**
 * MongoCompanySettingsRepository
 *
 * LEARNING POINTS:
 * 1. Implements interface from Domain layer
 * 2. Uses Mapper to convert Entity ↔ Model
 * 3. Domain layer doesn't know this implementation exists
 * 4. Can be swapped for another DB by creating new implementation
 */
export class MongoCompanySettingsRepository implements ICompanySettingsRepository {
  /**
   * Get company settings (singleton)
   * Returns null if not found (first time setup)
   */
  async get(): Promise<CompanySettingsEntity | null> {
    const doc = await CompanySettingsModel.findById('company-settings').exec();

    if (!doc) {
      return null;
    }

    return CompanySettingsMapper.toDomain(doc);
  }

  /**
   * Save company settings (create or update)
   * Uses upsert pattern - creates if doesn't exist, updates if exists
   */
  async save(entity: CompanySettingsEntity): Promise<CompanySettingsEntity> {
    const data = CompanySettingsMapper.toPersistence(entity);

    const doc = await CompanySettingsModel.findByIdAndUpdate(
      'company-settings',
      data,
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    ).exec();

    if (!doc) {
      throw new Error('Failed to save company settings');
    }

    return CompanySettingsMapper.toDomain(doc);
  }

  /**
   * Check if company settings exist
   */
  async exists(): Promise<boolean> {
    const count = await CompanySettingsModel.countDocuments({
      _id: 'company-settings'
    }).exec();

    return count > 0;
  }
}
