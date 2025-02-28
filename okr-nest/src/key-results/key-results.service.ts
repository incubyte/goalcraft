import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { KeyResultReqDTO, KeyResultResDTO } from './keyResultDTO';

@Injectable()
export class KeyResultsService {
  constructor(private readonly prismaService: PrismaService) {}

  async fetchUnique(keyResultId: string) {
    const response = await this.prismaService.keyResults.findUnique({
      where: { id: keyResultId },
    }); // return the specific keyResult
    return response;
  }

  create(keyResults: KeyResultReqDTO[]) {
    return this.prismaService.keyResults.createManyAndReturn({
      data: keyResults,
    });
  }

  delete(keyResultId: string) {
    return this.prismaService.keyResults.delete({
      where: {
        id: keyResultId,
      },
    }); // return the deleted keyResult
  }

  patch(keyResults: KeyResultResDTO) {
    return this.prismaService.keyResults.update({
      where: {
        id: keyResults.id,
      },
      data: {
        title: keyResults.title,
        initialValue: keyResults.initialValue,
        targetValue: keyResults.targetValue,
        currentValue: keyResults.currentValue,
        metric: keyResults.metric,
      },
    });
  }

  async progress(krId: string): Promise<{ percentage: number }> {
    const keyResult = await this.fetchUnique(krId);
    const percentage = (keyResult!.currentValue / keyResult!.targetValue) * 100;
    return { percentage };
  }
}
