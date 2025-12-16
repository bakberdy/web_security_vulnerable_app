import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../shared/database/database.service';
import { FileEntity } from './models/file.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FilesService {
  private readonly uploadDir = './public/uploads';

  constructor(private readonly db: DatabaseService) {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async saveFileRecord(
    uploaderId: number,
    file: Express.Multer.File,
    entityType: FileEntity['entity_type'],
    entityId: number,
  ): Promise<FileEntity> {
    const result = this.db.execute(
      `INSERT INTO files (uploader_id, filename, original_name, file_path, file_size, mime_type, entity_type, entity_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uploaderId,
        file.filename,
        file.originalname,
        file.path,
        file.size,
        file.mimetype,
        entityType,
        entityId,
      ],
    );

    const fileRecord = this.db.queryOne<FileEntity>(
      'SELECT * FROM files WHERE id = ?',
      [result.lastInsertRowid],
    );

    if (!fileRecord) {
      throw new Error('Failed to save file record');
    }

    return fileRecord;
  }

  async getFileById(id: number): Promise<FileEntity> {
    const file = this.db.queryOne<FileEntity>(
      'SELECT * FROM files WHERE id = ?',
      [id],
    );

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return file;
  }

  async getFilesByEntity(entityType: string, entityId: number): Promise<FileEntity[]> {
    return this.db.query<FileEntity>(
      'SELECT * FROM files WHERE entity_type = ? AND entity_id = ?',
      [entityType, entityId],
    );
  }

  async deleteFile(id: number): Promise<void> {
    const file = await this.getFileById(id);

    if (fs.existsSync(file.file_path)) {
      fs.unlinkSync(file.file_path);
    }

    this.db.execute('DELETE FROM files WHERE id = ?', [id]);
  }
}
