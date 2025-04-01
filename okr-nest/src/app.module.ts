import { Module } from '@nestjs/common';

import { CsvHandlerModule } from './files/csv-handler/csv-handler.module';
import { FilesModule } from './files/files.module';
import { KeyResultsModule } from './key-results/key-results.module';
import { ObjectivesModule } from './objectives/objectives.module';
import { PrismaService } from './prisma/prisma.service';
import { RagModule } from './rag/rag.module';

@Module({
  imports: [ObjectivesModule, KeyResultsModule, RagModule, FilesModule, CsvHandlerModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
