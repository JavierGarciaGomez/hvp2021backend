import { CompanySettingsEntity } from "../entities";

/**
 * CompanySettings Repository Interface
 * Singleton repository - only one company settings document exists
 */
export abstract class CompanySettingsRepository {
  /**
   * Get singleton company settings
   * @returns CompanySettingsEntity or null if not initialized
   */
  abstract get(): Promise<CompanySettingsEntity | null>;

  /**
   * Create initial company settings (for seed)
   * @param entity CompanySettingsEntity
   * @returns Created CompanySettingsEntity
   * @throws Error if company settings already exist
   */
  abstract create(entity: CompanySettingsEntity): Promise<CompanySettingsEntity>;

  /**
   * Update company settings
   * @param entity CompanySettingsEntity with updated values
   * @returns Updated CompanySettingsEntity
   */
  abstract update(entity: CompanySettingsEntity): Promise<CompanySettingsEntity>;

  /**
   * Delete company settings (use with caution!)
   * @returns void
   */
  abstract delete(): Promise<void>;
}
