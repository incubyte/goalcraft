export class KeyResultReqDTO {
  title: string;
  initialValue: number;
  currentValue: number;
  targetValue: number;
  metric: string;
  objectiveId: string;
}

export class KeyResultResDTO {
  id: string;
  title: string;
  initialValue: number;
  currentValue: number;
  targetValue: number;
  metric: string;
  objectiveId: string;
}
