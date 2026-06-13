import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { UploadedFile } from './cloudinary/types/uploaded-file';

@Injectable()
export class ResumeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async delteResumeByresumeId(resumeId: string) {
    return await this.prisma.resume.delete({
      where: {
        id: resumeId,
      },
    });
  }

  async findByUserIdAndResumeId(userId: string, resumeId: string) {
    return await this.prisma.resume.findFirst({
      where: {
        userId,
        id: resumeId,
      },
    });
  }

  async findAllByUser(userId: string) {
    return await this.prisma.resume.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async uploadResume(userId: string, file: UploadedFile) {
    const uploaded = await this.cloudinaryService.uploadFile(file);

    return this.prisma.resume.create({
      data: {
        userId,

        fileName: file.originalname,

        fileUrl: uploaded.secure_url,

        publicId: uploaded.public_id,
      },
    });
  }
}
