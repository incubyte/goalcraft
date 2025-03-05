import { KeyResultResDTO } from '../key-results/keyResult.dto';

export class ObjectiveReqDTO {
  objective: string;
}

export class ObjectiveResDTO {
  id: string;
  objective: string;
}

export class OkrDTO {
  id: string;
  objective: string;
  keyResults: KeyResultResDTO[];
}
