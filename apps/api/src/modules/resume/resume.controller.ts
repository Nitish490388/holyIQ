import {
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { ResumeService } from './resume.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JwtPayload } from 'src/common/types/jwt-payload.type';

@Controller('resumes')
@UseGuards(JwtAuthGuard)
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadResume(
    @CurrentUser() user: JwtPayload,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 5 * 1024 * 1024, // 5 MB
          }),
          new FileTypeValidator({
            fileType: 'application/pdf',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.resumeService.uploadResume(user.sub, file);
  }

  @Get()
  getResume(@CurrentUser() user: JwtPayload) {
    return this.resumeService.findAllByUser(user.sub);
  }

  @Get(':id')
  getResumeById(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) resumeId: string,
  ) {
    return this.resumeService.findByUserIdAndResumeId(user.sub, resumeId);
  }

  @Delete(':id')
  deleteResumeById(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) resumeId: string,
  ) {
    return this.resumeService.delteResumeByresumeId(resumeId);
  }
}
