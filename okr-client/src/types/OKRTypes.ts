type KeyResultType = {
  title: string;
  initialValue: number;
  currentValue: number;
  targetValue: number;
  metric: string;
};

type InsertKeyResultType = Omit<KeyResultType, 'id'>;

type KeyResultToBeRead = KeyResultType & { objectiveId: string; id: string };

type ObjectiveType = {
  id: string;
  objective: string;
  keyResults: KeyResultToBeRead[];
};

type KeyResultModalType = {
  isOpen: boolean;
  objectiveIndex: number;
};

type InsertObjectiveType = Omit<ObjectiveType, 'id'>;

export type {
  KeyResultType,
  ObjectiveType,
  KeyResultModalType,
  InsertObjectiveType,
  InsertKeyResultType,
  KeyResultToBeRead,
};
