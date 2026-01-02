import { CompanySettingsEntity } from "../../domain/entities";
import { CompanySettingsRepository } from "../../domain/repositories/company-settings.repository";

/**
 * CompanySettings Service
 * Singleton service with in-memory cache
 * Provides company fiscal data for CFDI generation
 */
export class CompanySettingsService {
  private cache: CompanySettingsEntity | null = null;
  private cacheInitialized: boolean = false;

  constructor(private readonly repository: CompanySettingsRepository) {}

  /**
   * Get company settings (cached)
   * @returns CompanySettingsEntity or null if not initialized
   */
  async get(): Promise<CompanySettingsEntity | null> {
    if (!this.cacheInitialized) {
      this.cache = await this.repository.get();
      this.cacheInitialized = true;
    }

    return this.cache;
  }

  /**
   * Get company settings (throws if not found)
   * @returns CompanySettingsEntity
   * @throws Error if company settings not initialized
   */
  async getOrFail(): Promise<CompanySettingsEntity> {
    const settings = await this.get();

    if (!settings) {
      throw new Error(
        "Company settings not initialized. Please run seed script or create settings."
      );
    }

    return settings;
  }

  /**
   * Create initial company settings
   * @param entity CompanySettingsEntity
   * @returns Created CompanySettingsEntity
   * @throws Error if company settings already exist
   */
  async create(entity: CompanySettingsEntity): Promise<CompanySettingsEntity> {
    const created = await this.repository.create(entity);

    // Update cache
    this.cache = created;
    this.cacheInitialized = true;

    return created;
  }

  /**
   * Update company settings
   * @param entity CompanySettingsEntity with updated values
   * @returns Updated CompanySettingsEntity
   * @throws Error if company settings don't exist
   */
  async update(entity: CompanySettingsEntity): Promise<CompanySettingsEntity> {
    const updated = await this.repository.update(entity);

    // Update cache
    this.cache = updated;

    return updated;
  }

  /**
   * Delete company settings and clear cache
   * Use with caution!
   */
  async delete(): Promise<void> {
    await this.repository.delete();

    // Clear cache
    this.cache = null;
    this.cacheInitialized = false;
  }

  /**
   * Clear cache (force reload from DB on next get())
   */
  clearCache(): void {
    this.cache = null;
    this.cacheInitialized = false;
  }

  /**
   * Check if company settings are initialized
   */
  async isInitialized(): Promise<boolean> {
    const settings = await this.get();
    return settings !== null;
  }
}
