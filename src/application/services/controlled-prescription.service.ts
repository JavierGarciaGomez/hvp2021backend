import { ControlledPrescriptionEntity } from "../../domain/entities";
import { BaseService } from "./base.service";
import {
  ControlledPrescriptionRepository,
  ControlledPrescriptionStatus,
} from "../../domain";
import { ControlledPrescriptionDTO } from "../dtos";
import {
  createProductRepository,
  createSupplierRepository,
} from "../factories";
import { BaseError, getOptionFromEnum } from "../../shared";

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
    const supplier = await this.getSupplierById(dto.supplier.id);

    const products = await this.getProductsFromDTO(dto.products);

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

  public update = async (
    id: string,
    dto: ControlledPrescriptionDTO
  ): Promise<ControlledPrescriptionEntity> => {
    const supplier = await this.getSupplierById(dto.supplier.id);

    const products = await this.getProductsFromDTO(dto.products);

    const newPrescription = new ControlledPrescriptionEntity({
      ...dto,
      supplier: {
        id: supplier.id!,
        legalName: supplier.legalName,
      },
      products,
    });

    return await this.repository.update(id, newPrescription);
  };

  public getStatusOptions = () => {
    return getOptionFromEnum(ControlledPrescriptionStatus);
  };

  private getSupplierById = async (supplierId: string) => {
    const supplierRepo = createSupplierRepository();
    const supplier = await supplierRepo.getById(supplierId);
    if (!supplier) {
      throw BaseError.badRequest("Supplier not found");
    }
    return supplier;
  };

  private getProductsFromDTO = async (productsDTO: any[]) => {
    return Promise.all(
      productsDTO.map(async (product) => {
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
  };
}
