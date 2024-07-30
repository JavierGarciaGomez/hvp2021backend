import { ControlledPrescriptionEntity } from "../../domain/entities";
import { BaseService } from "./base.service";
import { ControlledPrescriptionRepository } from "../../domain";
import { ControlledPrescriptionDTO } from "../dtos";
import {
  createProductRepository,
  createSupplierRepository,
} from "../factories";
import { BaseError } from "../../shared";

export class ControlledPrescriptionService extends BaseService<
  ControlledPrescriptionEntity,
  ControlledPrescriptionDTO
> {
  public getResourceName(): string {
    return "ControlledPrescription";
  }
  constructor(protected readonly repository: ControlledPrescriptionRepository) {
    super(repository, ControlledPrescriptionEntity);
  }

  public create = async (
    dto: ControlledPrescriptionDTO
  ): Promise<ControlledPrescriptionEntity> => {
    const supplierRepo = createSupplierRepository();
    const supplier = await supplierRepo.getById(dto.supplier.id);

    if (!supplier) {
      throw BaseError.badRequest("Supplier not found");
    }

    const products = await Promise.all(
      dto.products.map(async (product) => {
        const productRepo = createProductRepository();
        const newProduct = await productRepo.getById(product.id);
        if (!newProduct) {
          throw BaseError.badRequest("Product not found");
        }

        return {
          id: newProduct.id!,
          name: newProduct.name,
          quantity: product.quantity,
          batchCode: product.batchCode,
          expirationDate: product.expirationDate,
        };
      })
    );

    const newPrescription = new ControlledPrescriptionEntity({
      ...dto,
      supplier: {
        id: supplier.id!,
        legalName: supplier.legalName,
      },
      products,
    });

    return await this.repository.create(newPrescription);
  };
}
