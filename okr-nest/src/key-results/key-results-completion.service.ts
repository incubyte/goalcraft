import { KeyResultReqDTO } from './keyResultDTO';

export class keyResultCompletionService {
  isCompleted(keyResultDTO: KeyResultReqDTO) {
    return keyResultDTO.currentValue >= keyResultDTO.targetValue;
  }
}
