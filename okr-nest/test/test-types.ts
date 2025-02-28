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
};

type Okrs = Objective & { keyResults: KeyResult[] };

export type { KeyResult, Objective, Okrs };
