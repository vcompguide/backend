import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadApiErrorResponse, UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
    constructor(private readonly configService: ConfigService) {
        cloudinary.config({
            cloud_name: this.configService.get('CLOUDINARY_NAME'),
            api_key: this.configService.get('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
        });
    }

    async uploadImage(file: Express.Multer.File, folder?: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: folder || 'smart-tourism',
                    resource_type: 'image',
                    transformation: [
                        { width: 1920, height: 1080, crop: 'limit' }, // Max size
                        { quality: 'auto:good' }, // Auto quality
                        { fetch_format: 'auto' }, // Auto format (WebP when supported)
                    ],
                },
                (error, result) => {
                    if (error) return reject(error);
                    if (result) resolve(result);
                },
            );

            // Convert buffer to streamb and pipe into Cloudinary
            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }

    async deleteImage(publicId: string): Promise<any> {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    }

    async deleteImages(publicIds: string[]): Promise<any> {
        const result = await cloudinary.api.delete_resources(publicIds);
        return result;
    }

    async getImageDetails(publicId: string): Promise<any> {
        const result = await cloudinary.api.resource(publicId);
        return result;
    }
}
