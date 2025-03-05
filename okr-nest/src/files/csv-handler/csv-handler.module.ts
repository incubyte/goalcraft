import { Module } from '@nestjs/common';

import { CsvHandlerService } from './csv-handler.service';

@Module({
  providers: [CsvHandlerService],
  exports: [CsvHandlerService],
})
export class CsvHandlerModule {}
