import { Test, TestingModule } from '@nestjs/testing';

import { keyResultCompletionService } from './key-results-completion.service';

describe('KeyResultCompletionService', () => {
  let service: keyResultCompletionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [keyResultCompletionService],
    }).compile();
    service = module.get<keyResultCompletionService>(keyResultCompletionService);
  });

  describe('isComplete()', () => {
    const keyResult = {
      objectiveId: '1',
      title: 'keyResult 1',
      initialValue: 1,
      metric: '%',
    };

    it('should return true if current value is equals to target value', () => {
      const response = service.isCompleted({
        ...keyResult,
        currentValue: 1,
        targetValue: 1,
      });
      expect(response).toBeTruthy();
    });

    it('should return false if current value is not equals to target value', () => {
      const response = service.isCompleted({
        ...keyResult,
        currentValue: 1,
        targetValue: 2,
      });
      expect(response).not.toBeTruthy();
    });

    it('should return true if current value is equals or greater than target value', () => {
      const response = service.isCompleted({
        ...keyResult,
        currentValue: 5,
        targetValue: 2,
      });
      expect(response).toBeTruthy();
    });
  });
});
