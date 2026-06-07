import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: string) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        role: true,
        provider: true,
        createdAt: true,

        profile: {
          select: {
            fullName: true,
            bio: true,
            targetRole: true,
          },
        },
      },
    });
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.profile.upsert({
      where: {
        userId,
      },

      create: {
        userId,
        ...dto,
      },

      update: {
        ...dto,
      },
    });
  }
}
