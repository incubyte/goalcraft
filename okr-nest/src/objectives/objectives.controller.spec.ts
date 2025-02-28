import { Test, TestingModule } from '@nestjs/testing';
import { ObjectivesController } from './objectives.controller';
import { ObjectivesService } from './objectives.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { KeyResult, Objective, Okrs } from '../../test/test-types';

describe('Objectives Controller', () => {
  let controller: ObjectivesController;
  let service: DeepMockProxy<ObjectivesService>;
  let objective: Omit<Objective, 'id'>;

  beforeAll(async () => {
    service = mockDeep<ObjectivesService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ObjectivesController],
      providers: [
        {
          provide: ObjectivesService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<ObjectivesController>(ObjectivesController);

    objective = { objective: 'NEW OBJECTIVE' };
  });

  describe('fetchAll()', () => {
    it('should be called fetchAll() of service by controller', async () => {
      await controller.fetchAll();

      expect(service.fetchAll).toHaveBeenCalled();
    });

    it('should return all objectives', async () => {
      let okrs: Okrs[] = [
        {
          id: 'FAKE_OKR_ID',
          objective: 'FAKE_OBJECTIVE',
          keyResults: [],
        },
      ];
      service.fetchAll.mockResolvedValue(okrs);

      const response: Okrs[] = await controller.fetchAll();

      expect(response).toEqual(okrs);
    });
  });

  describe('create()', () => {
    it('should be called create() of service by controller', async () => {
      await controller.create(objective);

      expect(service.create).toHaveBeenCalled();
    });

    it('should create objective', async () => {
      const insertedObjective = {
        ...objective,
        id: 'FAKE_OBJECTIVE_ID',
      };
      service.create.mockResolvedValue(insertedObjective);

      const response: Objective = await controller.create(objective);

      expect(response).toEqual(insertedObjective);
    });
  });

  describe('delete()', () => {
    const objectiveId: string = 'FAKE_OBJECTIVE_ID';

    it('should be called delete() of service by controller', async () => {
      await controller.delete(objectiveId);

      expect(service.delete).toHaveBeenCalled();
    });

    it('should delete objective', async () => {
      const deletedObjective = {
        ...objective,
        id: objectiveId,
      };
      service.delete.mockResolvedValue(deletedObjective);

      const response: Objective = await controller.delete(objectiveId);

      expect(response).toEqual(deletedObjective);
    });
  });

  describe('patch()', () => {
    const updatedObjective = {
      objective: 'UPDATED OBJECTIVE',
      id: 'FAKE_OBJECTIVE_ID',
    };

    it('should be called patch() of service by controller', async () => {
      await controller.patch(updatedObjective);

      expect(service.patch).toHaveBeenCalled();
    });

    it('should update objective', async () => {
      service.patch.mockResolvedValue(updatedObjective);

      const response: Objective = await controller.patch(updatedObjective);

      expect(response).toEqual(updatedObjective);
    });
  });
});
