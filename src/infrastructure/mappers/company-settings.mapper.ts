import { Types } from 'mongoose';
import { CompanySettingsEntity } from '../../domain/entities/company-settings.entity';
import { RFC } from '../../domain/value-objects/rfc.vo';
import { Address } from '../../domain/value-objects/address.vo';
import { ICompanySettingsDocument } from '../db/mongo/models/company-settings.model';
import { MexicanStateCode } from 'hvp2021-shared';

/**
 * CompanySettingsMapper
 *
 * Translates between Domain Entity and MongoDB Document.
 *
 * LEARNING POINTS:
 * 1. Mapper knows about BOTH layers (Domain and Infrastructure)
 * 2. Domain layer never imports from Infrastructure
 * 3. toDomain(): Reconstructs Value Objects from primitives
 * 4. toPersistence(): Extracts primitives from Value Objects
 */
export class CompanySettingsMapper {
  /**
   * Convert MongoDB Document → Domain Entity
   * Called when loading from database.
   */
  static toDomain(doc: ICompanySettingsDocument): CompanySettingsEntity {
    const rfc = new RFC(doc.rfc);

    const address = new Address({
      street: doc.address.street,
      exteriorNumber: doc.address.exteriorNumber,
      interiorNumber: doc.address.interiorNumber,
      neighborhood: doc.address.neighborhood,
      city: doc.address.city,
      state: doc.address.state as MexicanStateCode,
      postalCode: doc.address.postalCode,
      country: doc.address.country
    });

    return CompanySettingsEntity.reconstitute({
      id: doc._id,
      rfc,
      businessName: doc.businessName,
      taxRegime: doc.taxRegime,
      address,
      email: doc.email,
      phone: doc.phone,
      facturamaApiKey: doc.facturamaApiKey,
      facturamaApiSecret: doc.facturamaApiSecret,
      facturamaUseSandbox: doc.facturamaUseSandbox,
      createdAt: doc.createdAt,
      createdBy: doc.createdBy.toString(),
      updatedAt: doc.updatedAt,
      updatedBy: doc.updatedBy.toString()
    });
  }

  /**
   * Convert Domain Entity → MongoDB Document (for saving)
   * Called when saving to database.
   */
  static toPersistence(entity: CompanySettingsEntity): Partial<ICompanySettingsDocument> {
    const address = entity.getAddress();

    return {
      _id: entity.id,
      rfc: entity.getRFC().value,
      businessName: entity.getBusinessName(),
      taxRegime: entity.getTaxRegime(),
      address: {
        street: address.street,
        exteriorNumber: address.exteriorNumber,
        interiorNumber: address.interiorNumber,
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country
      },
      email: entity.getEmail(),
      phone: entity.getPhone(),
      facturamaApiKey: entity.getFacturamaApiKey(),
      facturamaApiSecret: entity.getFacturamaApiSecret(),
      facturamaUseSandbox: entity.getFacturamaUseSandbox(),
      createdAt: entity.createdAt,
      createdBy: new Types.ObjectId(entity.createdBy),
      updatedAt: entity.getUpdatedAt(),
      updatedBy: new Types.ObjectId(entity.getUpdatedBy())
    };
  }
}
