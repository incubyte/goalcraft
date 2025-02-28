import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type KeyResult = {
  id: string;
  title: string;
  initialValue: number;
  targetValue: number;
  currentValue: number;
  metric: string;
  objectiveId: string;
};

type OKRsType = {
  objective: string;
  id: string;
  keyResults: KeyResult[];
};

@Injectable()
export class ObjectivesService {
  constructor(private readonly prismaService: PrismaService) {}

  async fetchAll() {
    return await this.prismaService.objectives.findMany({
      include: {
        keyResults: true,
      },
    });
  }

  async create(okrs: { objective: string }) {
    return await this.prismaService.objectives.create({
      data: okrs,
    });
  }

  async delete(objectiveId: string) {
    return await this.prismaService.objectives.delete({
      where: { id: objectiveId },
    });
  }

  async patch(okrs: { objective: string; id: string }) {
    return await this.prismaService.objectives.update({
      where: { id: okrs.id },
      data: { objective: okrs.objective },
    });
  }

  async put(okrs: OKRsType) {
    return await this.prismaService.objectives.update({
      where: { id: okrs.id },
      data: {
        objective: okrs.objective,
        keyResults: {
          updateMany: okrs.keyResults.map(keyResult => ({
            where: { id: keyResult.id },
            data: {
              title: keyResult.title,
              initialValue: keyResult.initialValue,
              currentValue: keyResult.currentValue,
              targetValue: keyResult.targetValue,
              metric: keyResult.metric,
            },
          })),
        },
      },
    });
  }
}
