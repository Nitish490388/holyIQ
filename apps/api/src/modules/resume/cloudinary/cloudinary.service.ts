import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryUploadResult } from './types/cloudinary-upload-result.type';
import type { UploadedFile } from './types/uploaded-file';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.getOrThrow<string>(
        'CLOUDINARY_CLOUD_NAME',
      ),
      api_key: this.configService.getOrThrow<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.getOrThrow<string>(
        'CLOUDINARY_API_SECRET',
      ),
    });
  }

  async uploadFile(file: UploadedFile): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'interviewflow/resumes',
            resource_type: 'raw',
          },
          (error, result) => {
            if (error) {
              // Extract the message safely or fallback to a generic string, ensuring a proper Error instance
              const errorMessage =
                error && typeof error === 'object' && 'message' in error
                  ? String((error as { message: unknown }).message)
                  : 'Cloudinary upload failed';

              reject(new Error(errorMessage));
              return;
            }

            if (!result) {
              reject(new Error('Cloudinary upload failed'));
              return;
            }

            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          },
        )
        .end(file.buffer);
    });
  }
}
