import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

import { KeyResultsController } from './key-results.controller';
import { KeyResultsService } from './key-results.service';
import { KeyResultReqDTO, KeyResultResDTO } from './keyResult.dto';

describe('KeyResultsController', () => {
  let controller: KeyResultsController;
  const mockKeyResultsService: DeepMockProxy<KeyResultsService> = mockDeep<KeyResultsService>();

  const keyResult: KeyResultReqDTO = {
    title: 'Hire frontend developer',
    initialValue: 0,
    currentValue: 0,
    targetValue: 0,
    metric: '%',
    objectiveId: '1',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KeyResultsController],
      providers: [
        {
          provide: KeyResultsService,
          useValue: mockKeyResultsService,
        },
      ],
    }).compile();

    controller = module.get<KeyResultsController>(KeyResultsController);
  });

  describe('Initial', () => {
    it('should be defined controller', () => {
      expect(controller).toBeDefined();
    });

    it('should be defined mockKeyResultsService', () => {
      expect(mockKeyResultsService).toBeDefined();
    });
  });

  describe('fetchUnique()', () => {
    const keyResultId: string = '1001';

    it('Should be called findUnique() of Controller', async () => {
      await controller.fetchUnique(keyResultId);

      expect(mockKeyResultsService.fetchUnique).toHaveBeenCalled();
    });

    it('Should return of unique key results of given id', async () => {
      // arrange
      const mockedResponse: KeyResultResDTO = {
        id: keyResultId,
        ...keyResult,
      };
      mockKeyResultsService.fetchUnique.mockReturnValue(mockedResponse as any);

      // act
      const response = await controller.fetchUnique(keyResultId);

      // assert
      expect(response).toBeDefined();
      expect(response).toEqual(mockedResponse);
    });
  });

  describe('create()', () => {
    const keyResults: KeyResultReqDTO[] = [keyResult];

    it('Should be called create() of Controller', async () => {
      await controller.create(keyResults);

      expect(mockKeyResultsService.create).toHaveBeenCalled();
    });

    it('Should create key results', async () => {
      mockKeyResultsService.create.mockResolvedValue([{ ...keyResult, id: 'FAKE_KEYRESULT_ID' }]);

      const response = await controller.create(keyResults);

      expect(response).toBeDefined();
      expect(response.length).toBe(keyResults.length);
    });
  });

  describe('delete()', () => {
    const keyResultId: string = '1002';

    it('Should be called delete() of Controller', async () => {
      await controller.delete(keyResultId);

      expect(mockKeyResultsService.delete).toHaveBeenCalled();
    });

    it('Should delete key results', async () => {
      const mockedResponse = { id: keyResultId, ...keyResult };
      mockKeyResultsService.delete.mockResolvedValue(mockedResponse);

      const response = await controller.delete(keyResultId);

      expect(response).toBeDefined();
      expect(response).toEqual(mockedResponse);
    });
  });

  describe('patch()', () => {
    const oldKeyResult: KeyResultResDTO = {
      ...keyResult,
      id: '1001',
    };

    const newKeyResult: KeyResultResDTO = {
      id: '1001',
      title: 'Hire frontend developer',
      initialValue: 0,
      currentValue: 0,
      targetValue: 0,
      metric: '%',
      objectiveId: '1',
    };

    it('Should be called patch() of Controller', async () => {
      await controller.patch(oldKeyResult);

      expect(mockKeyResultsService.patch).toHaveBeenCalled();
    });

    it('Should update key result', async () => {
      mockKeyResultsService.patch.mockResolvedValue(newKeyResult);

      const response = await controller.patch(oldKeyResult);

      expect(response).toBeDefined();
      expect(response).toEqual(newKeyResult);
    });
  });

  describe('progress()', () => {
    it('Should be return 50% progress', async () => {
      // arrange
      const keyResult = {
        id: 'FACK_KEY_RESULT_ID',
        title: 'Hire frontend developer',
        initialValue: 0,
        currentValue: 5,
        targetValue: 10,
        metric: '%',
        objectiveId: '1',
      };

      mockKeyResultsService.progress.mockResolvedValue({
        percentage: 50,
      });

      // act
      const response = await controller.progress(keyResult.id);

      // assert
      expect(response.percentage).toBeDefined();
      expect(response.percentage).toBe(50);
    });

    it('Should be return 20% progress', async () => {
      // arrange
      const keyResult = {
        id: 'FACK_KEY_RESULT_ID',
        title: 'Hire frontend developer',
        initialValue: 0,
        currentValue: 2,
        targetValue: 10,
        metric: '%',
        objectiveId: '1',
      };

      mockKeyResultsService.progress.mockResolvedValue({
        percentage: 20,
      });

      // act
      const response = await controller.progress(keyResult.id);

      // assert
      expect(response.percentage).toBeDefined();
      expect(response.percentage).toBe(20);
    });
  });
});
