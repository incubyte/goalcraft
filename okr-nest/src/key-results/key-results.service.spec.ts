import { KeyResultsService } from './key-results.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { mockDeep } from 'jest-mock-extended';
import { KeyResultReqDTO, KeyResultResDTO } from './keyResultDTO';

describe('KeyResultService', () => {
  let keyResultsService: KeyResultsService;
  let mockPrismaService = mockDeep<PrismaService>();
  let keyResult: KeyResultReqDTO = {
    title: 'Hire frontend developer',
    initialValue: 0,
    currentValue: 0,
    targetValue: 0,
    metric: '%',
    objectiveId: '1',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KeyResultsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    keyResultsService = module.get<KeyResultsService>(KeyResultsService);
  });

  describe('Initial', () => {
    it('Should be defined', () => {
      expect(keyResultsService).toBeDefined();
    });
  });

  describe('fetchUnique()', () => {
    let keyResultId: string = '1001';

    it('Should be called findUnique() of PrismaService', async () => {
      await keyResultsService.fetchUnique(keyResultId);

      expect(mockPrismaService.keyResults.findUnique).toHaveBeenCalled();
    });

    it('Should return of unique key results of given id', async () => {
      // arrange
      const mockedResponse = { id: keyResultId, ...keyResult };
      mockPrismaService.keyResults.findUnique.mockResolvedValue(mockedResponse);

      // act
      const response = await keyResultsService.fetchUnique(keyResultId);

      // assert
      expect(response).toBeDefined();
      expect(response).toEqual(mockedResponse);
    });
  });

  describe('create()', () => {
    let keyResults: KeyResultReqDTO[] = [keyResult];

    it('Should be called create() of PrismaService', async () => {
      await keyResultsService.create(keyResults);

      expect(
        mockPrismaService.keyResults.createManyAndReturn
      ).toHaveBeenCalled();
    });

    it('Should create key results', async () => {
      mockPrismaService.keyResults.createManyAndReturn.mockResolvedValue([
        { id: '23', ...keyResult },
      ]);

      const response = await keyResultsService.create(keyResults);

      expect(response).toBeDefined();

      expect(response.length).toBe(keyResults.length);
    });
  });

  describe('delete()', () => {
    let keyResultId: string = '1002';

    it('Should be called delete() of PrismaService', async () => {
      await keyResultsService.delete(keyResultId);

      expect(mockPrismaService.keyResults.delete).toHaveBeenCalled();
    });

    it('Should delete key results', async () => {
      const mockedResponse = { id: keyResultId, ...keyResult };
      mockPrismaService.keyResults.delete.mockResolvedValue(mockedResponse);

      const response = await keyResultsService.delete(keyResultId);

      expect(response).toBeDefined();
      expect(response).toEqual(mockedResponse);
    });
  });

  describe('patch()', () => {
    let oldKeyResult: KeyResultResDTO = {
      ...keyResult,
      id: '1001',
    };

    let newKeyResult: KeyResultResDTO = {
      id: '1001',
      title: 'Hire frontend developer',
      initialValue: 0,
      currentValue: 0,
      targetValue: 0,
      metric: '%',
      objectiveId: '1',
    };

    it('Should be called patch() of PrismaService', async () => {
      await keyResultsService.patch({ ...keyResult, id: '1001' });

      expect(mockPrismaService.keyResults.update).toHaveBeenCalled();
    });

    it('Should update key result', async () => {
      mockPrismaService.keyResults.update.mockResolvedValue(newKeyResult);

      const response = await keyResultsService.patch(oldKeyResult);

      expect(response).toBeDefined();
      expect(response).toEqual(newKeyResult);
    });
  });

  describe('progress()', () => {
    it('should return progress of the given keyresult with an Id', async () => {
      // arrange

      let krId = 'FAKE_KEYRESULT_ID';
      mockPrismaService.keyResults.findUnique.mockResolvedValue({
        ...keyResult,
        initialValue: 0,
        currentValue: 7,
        targetValue: 10,
        id: krId,
      });

      // act
      const progressResponse = await keyResultsService.progress(krId);

      // assert
      expect(progressResponse).toBeDefined();
      expect(progressResponse.percentage).toBe(70);
    });
  });
});
