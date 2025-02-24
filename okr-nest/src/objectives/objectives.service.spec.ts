import { Test, TestingModule } from '@nestjs/testing';
import { ObjectivesService } from './objectives.service';
import { PrismaService } from '../prisma/prisma.service';
import { mockDeep } from 'jest-mock-extended';

describe('ObjectivesService', () => {
  let service: ObjectivesService;
  let mockPrismaService = mockDeep<PrismaService>();
  let objectiveResponse = {
    objective: 'Objective 1',
    keyResults: [
      {
        id: 'e957fb53-e7fe-4885-acb9-cee42fe9ef3a',
        objectiveId: '95dd1b84-c92d-41a0-ae67-3930dab3344a',
        title: 'Key Result 1',
        initialValue: 0,
        currentValue: 0,
        targetValue: 0,
        metric: '%',
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ObjectivesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
      /** Here we need to pass PrismaService Dependency even though here we mocking PrismaService.
       * */
    }).compile();

    service = module.get<ObjectivesService>(ObjectivesService);
  });

  describe('Initial', () => {
    it('Should be defined', () => {
      expect(service).toBeDefined();
      expect(mockPrismaService).toBeDefined();
    });
  });

  describe('fetchAll()', () => {
    it('Should be called findMany() of PrismaService by ObjectiveService', async () => {
      await service.fetchAll();

      expect(mockPrismaService.objectives.findMany).toHaveBeenCalled();
    });

    it('Should return all objectives', async () => {
      let mockResponse = { id: '1000', ...objectiveResponse };

      mockPrismaService.objectives.findMany.mockResolvedValue([mockResponse]);

      const response = await service.fetchAll();

      expect(response).toBeDefined();
      expect(response).toEqual([mockResponse]);
    });
  });

  describe('create()', () => {
    let objectiveToBeCreated = { objective: 'Objective 1' };

    it('Should be called create() of PrismaService by ObjectiveService', async () => {
      await service.create(objectiveToBeCreated);

      expect(mockPrismaService.objectives.create).toHaveBeenCalled();
    });

    it('Should create objective', async () => {
      let mockResponse = { id: '1001', ...objectiveToBeCreated };

      mockPrismaService.objectives.create.mockResolvedValue(mockResponse);

      const response = await service.create(objectiveToBeCreated);

      expect(response).toBeDefined();
      expect(response).toEqual(mockResponse);
    });
  });

  describe('delete()', () => {
    let objectiveId: string = '1001';
    it('Should be called delete() of PrismaService by ObjectiveService', async () => {
      await service.delete(objectiveId);

      expect(mockPrismaService.objectives.delete).toHaveBeenCalled();
    });

    it('Should delete objective and return deleted objective', async () => {
      let mockResponse = { id: objectiveId, ...objectiveResponse };

      mockPrismaService.objectives.delete.mockResolvedValue(mockResponse);

      const response = await service.delete(objectiveId);

      expect(response).toBeDefined();
      expect(response).toEqual(mockResponse);
    });
  });

  describe('patch()', () => {
    it('Should be called patch() of PrismaService by ObjectiveService', async () => {
      await service.patch({ id: '1001', objective: 'objective 1' });

      expect(mockPrismaService.objectives.update).toHaveBeenCalled();
    });

    it('Should update objective', async () => {
      const oldObjective = { id: '1001', objective: 'title 0' };
      const newObjective = { id: '1001', objective: 'title 1' };

      mockPrismaService.objectives.update.mockResolvedValue(newObjective);

      const response = await service.patch(oldObjective);

      expect(response).toEqual(newObjective);
    });
  });
});
