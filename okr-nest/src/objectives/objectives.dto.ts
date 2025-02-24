import { KeyResultResDTO } from '../key-results/keyResultDTO';

export class ObjectiveReqDTO {
  objective: string;
}

export class ObjectiveResDTO {
  id: string;
  objective: string;
}

export class OkrsDTO {
  id: string;
  objective: string;
  keyResults: KeyResultResDTO[];
}
