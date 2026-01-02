import { Request, Response } from "express";
import { CompanySettingsService } from "../../application/services/company-settings.service";
import { CompanySettingsDTO } from "../../application/dtos/company-settings.dto";
import { CompanySettingsEntity } from "../../domain/entities";

/**
 * CompanySettings Controller
 * Singleton resource - GET (read), PUT (update), POST (create seed)
 */
export class CompanySettingsController {
  constructor(private readonly service: CompanySettingsService) {}

  /**
   * GET /api/company-settings
   * Get company settings
   */
  get = async (req: Request, res: Response) => {
    try {
      const settings = await this.service.get();

      if (!settings) {
        return res.status(404).json({
          ok: false,
          message: "Company settings not initialized",
        });
      }

      const dto = new CompanySettingsDTO(settings);

      return res.json({
        ok: true,
        data: dto,
      });
    } catch (error: any) {
      return res.status(500).json({
        ok: false,
        message: error.message || "Error getting company settings",
      });
    }
  };

  /**
   * POST /api/company-settings
   * Create initial company settings (seed)
   * Requires admin role
   */
  create = async (req: Request, res: Response) => {
    try {
      const dto = CompanySettingsDTO.create(req.body);
      const entity = new CompanySettingsEntity(dto);

      const created = await this.service.create(entity);
      const responseDto = new CompanySettingsDTO(created);

      return res.status(201).json({
        ok: true,
        message: "Company settings created successfully",
        data: responseDto,
      });
    } catch (error: any) {
      return res.status(400).json({
        ok: false,
        message: error.message || "Error creating company settings",
      });
    }
  };

  /**
   * PUT /api/company-settings
   * Update company settings
   * Requires admin role
   */
  update = async (req: Request, res: Response) => {
    try {
      // Get current settings
      const current = await this.service.getOrFail();

      // Merge with update data
      const updateData = CompanySettingsDTO.createForUpdate(req.body);
      const merged = { ...current, ...updateData };

      const entity = new CompanySettingsEntity(merged);
      const updated = await this.service.update(entity);
      const dto = new CompanySettingsDTO(updated);

      return res.json({
        ok: true,
        message: "Company settings updated successfully",
        data: dto,
      });
    } catch (error: any) {
      return res.status(400).json({
        ok: false,
        message: error.message || "Error updating company settings",
      });
    }
  };

  /**
   * DELETE /api/company-settings
   * Delete company settings (use with caution!)
   * Requires admin role
   */
  delete = async (req: Request, res: Response) => {
    try {
      await this.service.delete();

      return res.json({
        ok: true,
        message: "Company settings deleted successfully",
      });
    } catch (error: any) {
      return res.status(500).json({
        ok: false,
        message: error.message || "Error deleting company settings",
      });
    }
  };
}
