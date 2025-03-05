import { Module } from '@nestjs/common';

import { CsvHandlerModule } from './csv-handler/csv-handler.module';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [CsvHandlerModule],
})
export class FilesModule {}
