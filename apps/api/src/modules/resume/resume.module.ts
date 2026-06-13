import { Module } from '@nestjs/common';

import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [ResumeController],
  providers: [ResumeService],
})
export class ResumeModule {}
