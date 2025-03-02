import { Module } from '@nestjs/common';

import { FilesModule } from './files/files.module';
import { KeyResultsModule } from './key-results/key-results.module';
import { ObjectivesModule } from './objectives/objectives.module';
import { PrismaService } from './prisma/prisma.service';
import { RagModule } from './rag/rag.module';

@Module({
  imports: [ObjectivesModule, KeyResultsModule, RagModule, FilesModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
