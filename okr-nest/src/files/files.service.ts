import { Injectable, StreamableFile } from '@nestjs/common';
import { OkrDTO } from 'src/objectives/objectives.dto';
import { Readable } from 'stream';
import { ParsedOkrs } from 'test/test-types';

import { ObjectivesService } from '../objectives/objectives.service';
import { CsvHandlerService } from './csv-handler/csv-handler.service';

@Injectable()
export class FilesService {
  constructor(
    private readonly csvHandlerService: CsvHandlerService,
    private readonly objectiveService: ObjectivesService
  ) {}

  uploadFile(uploadFile: Express.Multer.File[]): ParsedOkrs[] {
    return this.csvHandlerService.parseCsvToOkr(uploadFile);
  }

  async downloadAllOkrs(): Promise<StreamableFile> {
    const okrs: OkrDTO[] = await this.objectiveService.fetchAll();
    const csv: string = this.csvHandlerService.parseOkrsToCsv(okrs);
    return new StreamableFile(Readable.from(csv));
  }
}
