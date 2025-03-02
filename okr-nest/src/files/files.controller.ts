import { Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FilesController {
  @Post('/')
  @UseInterceptors(FilesInterceptor('files'))
  saveFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    const fileNames = files.map(file => file.originalname);
    return { message: 'File saved successfully', filesSaved: fileNames };
  }
}
