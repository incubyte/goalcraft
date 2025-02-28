import { Module } from '@nestjs/common';

import { KeyResultsModule } from './key-results/key-results.module';
import { ObjectivesModule } from './objectives/objectives.module';
import { PrismaService } from './prisma/prisma.service';
import { RagModule } from './rag/rag.module';

@Module({
  imports: [ObjectivesModule, KeyResultsModule, RagModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
