import { Test, TestingModule } from '@nestjs/testing';
import { ObjectivesController } from './objectives.controller';
import { ObjectivesService } from './objectives.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { KeyResult, Objective, Okrs } from '../../test/test-types';

describe('Objectives Controller', () => {
  let controller: ObjectivesController;
  let service: DeepMockProxy<ObjectivesService>;
  let objectiveToInsert: Omit<Objective, 'id'>;

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

    objectiveToInsert = { objective: 'NEW OBJECTIVE' };
  });

  describe('fetchAll()', () => {
    it('should be called fetchAll() of service by controller', async () => {
      await controller.fetchAll();

      expect(service.fetchAll).toHaveBeenCalled();
    });

    it('should return all objectives', async () => {
      let okrsToInsert: Okrs = {
        id: 'FAKE_OKR_ID',
        objective: 'FAKE_OBJECTIVE',
        keyResults: [],
      };
      service.fetchAll.mockResolvedValue([okrsToInsert]);

      const response: Okrs[] = await controller.fetchAll();

      expect(response).toEqual([okrsToInsert]);
    });
  });

  describe('create()', () => {
    it('should be called create() of service by controller', async () => {
      await controller.create(objectiveToInsert);

      expect(service.create).toHaveBeenCalled();
    });

    it('should create objective', async () => {
      service.create.mockResolvedValue({
        ...objectiveToInsert,
        id: 'FAKE_OBJECTIVE_ID',
      });

      const response: Objective = await controller.create(objectiveToInsert);

      expect(response).toEqual({
        ...objectiveToInsert,
        id: 'FAKE_OBJECTIVE_ID',
      });
    });
  });

  describe('delete()', () => {
    it('should be called delete() of service by controller', async () => {
      await controller.delete('FAKE_OBJECTIVE_ID');

      expect(service.create).toHaveBeenCalled();
    });

    it('should delete objective', async () => {
      service.delete.mockResolvedValue({
        ...objectiveToInsert,
        id: 'FAKE_OBJECTIVE_ID',
      });

      const response: Objective = await controller.delete('FAKE_OBJECTIVE_ID');

      expect(response).toEqual({
        ...objectiveToInsert,
        id: 'FAKE_OBJECTIVE_ID',
      });
    });
  });

  describe('patch()', () => {
    it('should be called patch() of service by controller', async () => {
      await controller.patch({
        id: 'FAKE_OBJECTIVE_ID',
        objective: 'objective 1',
      });

      expect(service.patch).toHaveBeenCalled();
    });

    it('should update objective', async () => {
      const objectiveToUpdate = {
        id: 'FAKE_OBJECTIVE_ID',
        objective: 'FAKE OBJECTIVE',
      };
      const updatedObjective = {
        id: 'FAKE_OBJECTIVE_ID',
        objective: 'UPDATED OBJECTIVE',
      };

      service.patch.mockResolvedValue(updatedObjective);

      const response: Objective = await controller.patch({
        ...objectiveToUpdate,
        objective: 'UPDATED OBJECTIVE',
      });

      expect(response).toEqual(updatedObjective);
    });
  });
});
