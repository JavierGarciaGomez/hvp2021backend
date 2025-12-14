// controllers/image.controller.ts
import { NextFunction, Request, Response } from "express";
import { CloudinaryService, ResponseFormatterService } from "../../application";
import { BaseError } from "../../shared";
import multer from "multer";

const cloudinaryService = new CloudinaryService();
export class UploadImageDto {
  filePath: string;
  publicId?: string;

  constructor({ filePath, publicId }: UploadImageDto) {
    this.filePath = filePath;
    this.publicId = publicId;
  }
}

export class ImagesController {
  static async uploadImageFromBuffer(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const file = req.file;
      const { publicId, folder } = req.body;

      if (!file) {
        return res.status(400).json({ message: "File is required" });
      }

      const buffer = file.buffer; // File buffer
      const result = await cloudinaryService.uploadImageFromBuffer(
        buffer,
        publicId,
        folder
      );

      const response = ResponseFormatterService.formatCreateResponse({
        data: result,
        resource: "images",
      });
      return res.status(response.status_code).json(response);
    } catch (error) {
      next(error);
    }
  }

  // Upload image controller method
  static async uploadImage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const { filePath, publicId } = req.body as UploadImageDto;

    try {
      const result = await cloudinaryService.uploadImage(filePath, publicId);
      const response = ResponseFormatterService.formatCreateResponse({
        data: result,
        resource: "image",
      });
      return res.status(response.status_code).json(response);
    } catch (error) {
      next(error);
    }
  }

  // Delete image controller method
  static async deleteImage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const publicId = req.params[0];

    try {
      const result = await cloudinaryService.deleteImage(publicId);
      const response = ResponseFormatterService.formatDeleteResponse({
        data: result,
        resource: "image",
      });
      return res.status(response.status_code).json(response);
    } catch (error) {
      next(error);
    }
  }
}
