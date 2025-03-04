type KeyResultType = {
  id: string;
  objectiveId: string;
  title: string;
  initialValue: number;
  currentValue: number;
  targetValue: number;
  metric: string;
};

type KeyResultToBeInsertedType = Omit<KeyResultType, 'id' | 'objectiveId'>;

type OkrType = {
  id: string;
  objective: string;
  keyResults: KeyResultType[];
};

type OkrToBeInsertedType = Omit<OkrType, 'id'>;

type KeyResultModalType = {
  isOpen: boolean;
  objectiveIndex: number;
};

export type {
  KeyResultToBeInsertedType,
  OkrToBeInsertedType,
  KeyResultModalType,
  KeyResultType,
  OkrType,
};
