interface KeyResultType {
  title: string;
  initialValue: number;
  currentValue: number;
  targetValue: number;
  metric: string;
}

type InsertKeyResultType = Omit<KeyResultType, 'id'>;

type KeyResultToBeRead = KeyResultType & { objectiveId: string; id: string };

interface ObjectiveType {
  id: string;
  objective: string;
  keyResults: KeyResultToBeRead[];
}

interface KeyResultModalType {
  isOpen: boolean;
  objectiveIndex: number;
}

type InsertObjectiveType = Omit<ObjectiveType, 'id'>;

export type {
  InsertKeyResultType,
  InsertObjectiveType,
  KeyResultModalType,
  KeyResultToBeRead,
  KeyResultType,
  ObjectiveType,
};
