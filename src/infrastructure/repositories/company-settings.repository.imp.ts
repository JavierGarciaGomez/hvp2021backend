import { CompanySettingsDatasource } from "../../domain/datasources/company-settings.datasource";
import { CompanySettingsEntity } from "../../domain/entities";
import { CompanySettingsRepository } from "../../domain/repositories/company-settings.repository";

/**
 * Repository implementation for CompanySettings
 * Singleton repository - delegates to datasource
 */
export class CompanySettingsRepositoryImpl implements CompanySettingsRepository {
  constructor(private readonly datasource: CompanySettingsDatasource) {}

  async get(): Promise<CompanySettingsEntity | null> {
    return await this.datasource.get();
  }

  async create(entity: CompanySettingsEntity): Promise<CompanySettingsEntity> {
    return await this.datasource.create(entity);
  }

  async update(entity: CompanySettingsEntity): Promise<CompanySettingsEntity> {
    return await this.datasource.update(entity);
  }

  async delete(): Promise<void> {
    return await this.datasource.delete();
  }
}
