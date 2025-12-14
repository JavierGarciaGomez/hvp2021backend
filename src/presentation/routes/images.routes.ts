import { Router, Request, Response, NextFunction } from "express";
import { AuthMiddleware } from "../middlewares";
import { BaseController, ImagesController } from "../controllers";
import { BaseEntity } from "../../domain";
import { BaseDTO, CloudinaryService } from "../../application";
import multer from "multer";

// Use memory storage instead of file system storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

export class ImagesRoutes {
  protected router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.router.post(
      "/upload",
      AuthMiddleware.validateJWT,
      ImagesController.uploadImage
    );
    this.router.delete(
      "/delete/*",
      AuthMiddleware.validateJWT,
      ImagesController.deleteImage
    );
    this.router.post(
      "/upload-from-buffer",
      AuthMiddleware.validateJWT,
      upload.single("file"),
      ImagesController.uploadImageFromBuffer
    );
  }

  public getRoutes(): Router {
    return this.router;
  }
}
