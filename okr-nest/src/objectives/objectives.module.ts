import { Module } from '@nestjs/common';
import { ObjectivesController } from './objectives.controller';
import { ObjectivesService } from './objectives.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ObjectivesController],
  providers: [ObjectivesService, PrismaService],
})
export class ObjectivesModule {}
