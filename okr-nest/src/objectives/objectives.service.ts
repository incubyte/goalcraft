import { Injectable } from '@nestjs/common';

import { KeyResultResDTO } from '../key-results/keyResult.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ObjectiveReqDTO, ObjectiveResDTO, OkrDTO } from './objectives.dto';

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

  async create(objective: ObjectiveReqDTO) {
    return await this.prismaService.objectives.create({
      data: objective,
    });
  }

  async delete(objective: Omit<ObjectiveResDTO, 'objective'>) {
    return await this.prismaService.objectives.delete({
      where: { id: objective.id },
    });
  }

  async patch(objective: ObjectiveResDTO) {
    return await this.prismaService.objectives.update({
      where: { id: objective.id },
      data: { objective: objective.objective },
    });
  }

  async put(objective: OkrDTO) {
    return await this.prismaService.objectives.update({
      where: { id: objective.id },
      data: {
        objective: objective.objective,
        keyResults: {
          updateMany: objective.keyResults.map((keyResult: KeyResultResDTO) => ({
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
