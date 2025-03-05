import { KeyResultReqDTO } from './keyResult.dto';

export class keyResultCompletionService {
  isCompleted(keyResultDTO: KeyResultReqDTO) {
    return keyResultDTO.currentValue >= keyResultDTO.targetValue;
  }
}
