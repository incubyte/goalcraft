import { Module } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { ObjectivesController } from './objectives.controller';
import { ObjectivesService } from './objectives.service';

@Module({
  controllers: [ObjectivesController],
  providers: [ObjectivesService, PrismaService],
})
export class ObjectivesModule {}
