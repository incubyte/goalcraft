import { Injectable } from '@nestjs/common';
import { parsedOkrs } from 'test/test-types';

import { CsvHandlerService } from './csv-handler/csv-handler.service';

@Injectable()
export class FilesService {
  constructor(private readonly csvHandlerService: CsvHandlerService) {}

  uploadFile(uploadFile: Express.Multer.File[]): parsedOkrs[] {
    return this.csvHandlerService.parseCsvToOkr(uploadFile);
  }
}
