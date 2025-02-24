import { KeyResultResDTO } from '../key-results/keyResultDTO';

export class ObjectiveReqDTO {
  objective: string;
}

export class ObjectiveResDTO {
  objective: string;
  id: string;
}

export class OkrsDTO {
  objective: string;
  id: string;
  keyResults: KeyResultResDTO[];
}
