interface KeyResultType {
  id: string;
  objectiveId: string;
  title: string;
  initialValue: number;
  currentValue: number;
  targetValue: number;
  metric: string;
}

interface ObjectiveToBeInsertedType {
  objective: string;
}

type KeyResultToBeInsertedType = Omit<KeyResultType, 'id' | 'objectiveId'>;

interface OkrType {
  id: string;
  objective: string;
  keyResults: KeyResultType[];
}

type OkrToBeInsertedType = Omit<OkrType, 'id'>;

interface KeyResultModalType {
  isOpen: boolean;
  objectiveIndex: number;
}

export type {
  KeyResultModalType,
  KeyResultToBeInsertedType,
  KeyResultType,
  ObjectiveToBeInsertedType,
  OkrToBeInsertedType,
  OkrType,
};
