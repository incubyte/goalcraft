import { Test, TestingModule } from '@nestjs/testing';
import { ObjectivesService } from './objectives.service';
import { PrismaService } from '../prisma/prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { Objective, Okrs } from '../../test/test-types';

describe('Objectives Service', () => {
  let service: ObjectivesService;
  let prismaMock: DeepMockProxy<PrismaService>;
  let objective: Omit<Objective, 'id'>;

  beforeAll(async () => {
    prismaMock = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ObjectivesService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ObjectivesService>(ObjectivesService);

    objective = { objective: 'NEW OBJECTIVE' };
  });

  describe('fetchAll()', () => {
    it('should be called findMany() of PrismaService by ObjectiveService', async () => {
      await service.fetchAll();

      expect(prismaMock.objectives.findMany).toHaveBeenCalled();
    });

    it('should return all objectives', async () => {
      let okrs: Okrs[] = [
        {
          id: 'FAKE_OBJECTIVE_ID',
          objective: 'FAKE OBJECTIVE',
          keyResults: [],
        },
      ];
      prismaMock.objectives.findMany.mockResolvedValue(okrs);

      const response: Okrs[] = await service.fetchAll();

      expect(response).toBeDefined();
      expect(response).toEqual(okrs);
    });
  });

  describe('create()', () => {
    it('should be called create() of PrismaService by ObjectiveService', async () => {
      await service.create(objective);

      expect(prismaMock.objectives.create).toHaveBeenCalled();
    });

    it('should create objective', async () => {
      const insertedObjective = {
        ...objective,
        id: 'FAKE_OBJECTIVE_ID',
      };
      prismaMock.objectives.create.mockResolvedValue(insertedObjective);

      const response: Objective = await service.create(objective);

      expect(response).toBeDefined();
      expect(response).toEqual(insertedObjective);
    });
  });

  describe('delete()', () => {
    let objectiveToDelete: Objective = {
      ...objective,
      id: 'FAKE_OBJECTIVE_ID',
    };

    it('should be called delete() of PrismaService by ObjectiveService', async () => {
      await service.delete({ id: objectiveToDelete.id });

      expect(prismaMock.objectives.delete).toHaveBeenCalled();
    });

    it('should delete objective', async () => {
      prismaMock.objectives.delete.mockResolvedValue(objectiveToDelete);

      const response: Objective = await service.delete({
        id: objectiveToDelete.id,
      });

      expect(response).toBeDefined();
      expect(response).toEqual(objectiveToDelete);
    });
  });

  describe('patch()', () => {
    const updatedObjective = {
      id: 'FAKE_OBJECTIVE_ID',
      objective: 'UPDATED OBJECTIVE',
    };

    it('should be called patch() of PrismaService by ObjectiveService', async () => {
      await service.patch(updatedObjective);

      expect(prismaMock.objectives.update).toHaveBeenCalled();
    });

    it('should update objective', async () => {
      prismaMock.objectives.update.mockResolvedValue(updatedObjective);

      const response: Objective = await service.patch(updatedObjective);

      expect(response).toEqual(updatedObjective);
    });
  });
});
