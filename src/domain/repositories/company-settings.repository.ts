import { CompanySettingsEntity } from '../entities/company-settings.entity';

/**
 * ICompanySettingsRepository Interface
 *
 * LEARNING POINTS:
 *
 * 1. This is an INTERFACE (contract), not implementation:
 *    - Defines WHAT operations are available
 *    - Does NOT define HOW they're implemented
 *    - Implementation will be in Infrastructure layer
 *
 * 2. Lives in DOMAIN layer:
 *    - Domain defines what it needs
 *    - Infrastructure provides implementation
 *    - This is Dependency Inversion Principle (SOLID)
 *
 * 3. Speaks domain language:
 *    - Uses Entity (not database model)
 *    - Methods are business-focused
 *    - No mention of MongoDB, SQL, or any specific technology
 *
 * 4. Company Settings is a SINGLETON:
 *    - Only one instance exists in the system
 *    - get() instead of findById() - no ID parameter needed
 *    - No delete method - singleton can't be deleted
 *    - save() handles both create and update
 */

export interface ICompanySettingsRepository {
  /**
   * Get the company settings (singleton pattern)
   * Returns null if not initialized yet (first time use)
   *
   * @returns CompanySettingsEntity if exists, null otherwise
   */
  get(): Promise<CompanySettingsEntity | null>;

  /**
   * Save company settings (create or update)
   * This is the only persistence method needed for a singleton
   *
   * @param settings - The entity to save
   * @returns The saved entity (with updated timestamps if applicable)
   */
  save(settings: CompanySettingsEntity): Promise<CompanySettingsEntity>;

  /**
   * Check if company settings exist
   * Useful for initialization checks and conditional logic
   *
   * @returns true if settings exist, false otherwise
   */
  exists(): Promise<boolean>;
}
