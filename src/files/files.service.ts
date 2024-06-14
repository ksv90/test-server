import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { mkdir, writeFile } from 'fs/promises';
import * as path from 'path';
import { v4 } from 'uuid';

const STATIC_DIR = 'static';
const filePath = path.resolve(__dirname, '..', STATIC_DIR);

// не нашел тип в библиотеке
export type MulterFile = Parameters<NonNullable<MulterOptions['fileFilter']>>[1];

@Injectable()
export class FilesService {
  async createFile(file: MulterFile): Promise<string> {
    try {
      const ext = path.extname(file.originalname);
      const fileName = v4() + ext;
      await mkdir(filePath, { recursive: true });
      await writeFile(path.join(filePath, fileName), file.buffer);
      return fileName;
    } catch (error) {
      throw new HttpException('ошибка при записи файла', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
