type Objective = {
  id: string;
  objective: string;
};

type KeyResult = {
  id: string;
  title: string;
  initialValue: number;
  currentValue: number;
  targetValue: number;
  metric: string;
  objectiveId: string;
}

export type { Objective, KeyResult };
