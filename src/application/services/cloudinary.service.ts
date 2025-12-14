// services/cloudinary.service.ts
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
console.log("here");
import { BaseError } from "../../shared";
import { getEnvsByEnvironment } from "../../shared/helpers/envHelpers";
import { envsPlugin } from "../../infrastructure/adapters";
import { ImageUrl } from "../../domain";

const envs = getEnvsByEnvironment();

cloudinary.config({
  cloud_name: getEnvsByEnvironment().CLOUDINARY_CLOUD_NAME,
  api_key: getEnvsByEnvironment().CLOUDINARY_API_KEY,
  api_secret: getEnvsByEnvironment().CLOUDINARY_API_SECRET,
});

export class CloudinaryService {
  async uploadImageFromBuffer(
    buffer: Buffer,
    publicId: string,
    folder: string
  ): Promise<ImageUrl> {
    try {
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "image",
              folder: folder,
              public_id: publicId,
              overwrite: true,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result as UploadApiResponse);
            }
          )
          .end(buffer);
      });

      if (!result) {
        throw new Error("Failed to upload image to Cloudinary");
      }

      const url = result.secure_url;
      const thumbnailUrl = url.replace(
        "/upload/",
        "/upload/c_thumb,g_face,h_100,w_100/"
      );

      const imageUrl: ImageUrl = {
        publicId: result.public_id,
        url,
        thumbnailUrl,
        isMain: false,
      };

      return imageUrl;
    } catch (error) {
      throw BaseError.internalServer(
        "Error uploading to Cloudinary: " + (error as Error).message
      );
    }
  }
  // Upload image to Cloudinary
  async uploadImage(
    filePath: string,
    publicId?: string
  ): Promise<UploadApiResponse> {
    try {
      return await cloudinary.uploader.upload(filePath, {
        public_id: publicId, // Optional: use for updating or providing a custom public ID
        overwrite: !!publicId, // Overwrite if public ID is provided
      });
    } catch (error) {
      throw BaseError.internalServer(
        "Error uploading to Cloudinary: " + (error as Error).message
      );
    }
  }

  async deleteImage(publicId: string): Promise<UploadApiResponse> {
    try {
      return await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw BaseError.internalServer(
        "Error deleting from Cloudinary: " + (error as Error).message
      );
    }
  }

  // Additional methods for image updates or transformations can be added here
}
