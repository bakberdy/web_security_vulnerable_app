import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { FileEntity } from './models/file.entity';
import { AuthGuard } from '../core/guards/auth.guard';
import { CurrentUser } from '../core/decorators/current-user.decorator';

interface CurrentUserData {
  id: number;
  email: string;
  role: string;
}

@Controller('files')
@UseGuards(AuthGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      // TODO: VULNERABILITY Unsafe file upload - no MIME validation or filename sanitization
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, callback) => {
          callback(null, file.originalname);
        },
      }),
    }),
  )
  async uploadFile(
    @CurrentUser() user: CurrentUserData,
    @UploadedFile() file: Express.Multer.File,
    @Body('entity_type') entityType: FileEntity['entity_type'],
    @Body('entity_id') entityId: string,
  ): Promise<FileEntity> {
    return this.filesService.saveFileRecord(
      user.id,
      file,
      entityType,
      parseInt(entityId, 10),
    );
  }

  @Get(':id')
  async getFile(@Param('id', ParseIntPipe) id: number): Promise<FileEntity> {
    return this.filesService.getFileById(id);
  }

  @Get('entity/:type/:id')
  async getFilesByEntity(
    @Param('type') type: string,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FileEntity[]> {
    return this.filesService.getFilesByEntity(type, id);
  }

  @Delete(':id')
  async deleteFile(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.filesService.deleteFile(id);
  }
}
