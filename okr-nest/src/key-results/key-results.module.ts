import { Module } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { KeyResultsController } from './key-results.controller';
import { KeyResultsService } from './key-results.service';
import { keyResultCompletionService } from './key-results-completion.service';

@Module({
  controllers: [KeyResultsController],
  providers: [KeyResultsService, PrismaService, keyResultCompletionService],
})
export class KeyResultsModule {}
