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

type Okr = Objective & { keyResults: KeyResult[] };
type ParsedOkrs = { parsedFile: string; parsedContent: Okr[] };

export type { KeyResult, Objective, Okr, ParsedOkrs };
