import { Test, TestingModule } from '@nestjs/testing';
import { ObjectivesController } from './objectives.controller';
import { ObjectivesService } from './objectives.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

describe('ObjectivesController', () => {
  let controller: ObjectivesController;
  let mockedService: DeepMockProxy<ObjectivesService> =
    mockDeep<ObjectivesService>();
  let objective = {
    objective: 'Objective 1',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ObjectivesController],
      providers: [
        {
          provide: ObjectivesService,
          useValue: mockedService,
        },
      ],
    }).compile();

    controller = module.get<ObjectivesController>(ObjectivesController);
  });

  describe('Initial', () => {
    it('Should be defined', () => {
      expect(controller).toBeDefined();
      expect(mockedService).toBeDefined();
    });
  });

  describe('fetchAll()', () => {
    let objective = {
      id: '1001',
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

    it('Should be called fetchAll() of service by controller', async () => {
      await controller.fetchAll();

      expect(mockedService.fetchAll).toHaveBeenCalled();
    });

    it('Should return all objectives', async () => {
      mockedService.fetchAll.mockResolvedValue([objective]);

      const response = await controller.fetchAll();

      expect(response).toEqual([objective]);
    });
  });

  describe('create()', () => {
    it('Should be called create() of service by controller', async () => {
      await controller.create(objective);

      expect(mockedService.create).toHaveBeenCalled();
    });

    it('Should create objective', async () => {
      mockedService.create.mockResolvedValue({
        ...objective,
        id: '1001',
      });

      const response = await controller.create(objective);

      expect(response).toEqual({ ...objective, id: '1001' });
    });
  });

  describe('delete()', () => {
    it('Should be called delete() of service by controller', async () => {
      await controller.delete('1001');

      expect(mockedService.create).toHaveBeenCalled();
    });

    it('Should delete objective', async () => {
      mockedService.delete.mockResolvedValue({
        ...objective,
        id: '1001',
      });

      const response = await controller.delete('1001');

      expect(response).toEqual({ ...objective, id: '1001' });
    });
  });

  describe('patch()', () => {
    it('Should be called patch() of service by controller', async () => {
      await controller.patch({ id: '1001', objective: 'objective 1' });

      expect(mockedService.patch).toHaveBeenCalled();
    });

    it('Should update objective', async () => {
      const oldObjective = { id: '1001', objective: 'title 0' };
      const newObjective = { id: '1001', objective: 'title 1' };

      mockedService.patch.mockResolvedValue(newObjective);

      const response = await controller.patch(oldObjective);

      expect(response).toEqual(newObjective);
    });
  });
});
