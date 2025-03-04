import { createContext, ReactElement, useState } from 'react';
import {KeyResultToBeInsertedType, OkrType} from '../types/okr.types.ts';

const defaultOKR = {
  id: '',
  objective: '',
  keyResults: [
    {
      id: '',
      title: '',
      initialValue: 0,
      currentValue: 0,
      targetValue: 0,
      metric: '',
      objectiveId: '',
    },
  ],
};

const defaultKeyResult = {
  title: '',
  initialValue: 0,
  currentValue: 0,
  targetValue: 0,
  metric: '',
};

type OkrContextType = {
  objectives: OkrType[] | null;
  setObjectives: React.Dispatch<React.SetStateAction<OkrType[] | null>>;
  isWaitingForResponse: boolean;
  setIsWaitingForResponse: React.Dispatch<React.SetStateAction<boolean>>;
  objectiveForUpdate: OkrType;
  setObjectiveForUpdate: React.Dispatch<React.SetStateAction<OkrType>>;
  defaultKeyResult: KeyResultToBeInsertedType;
  defaultOKR: OkrType;
};

export const OkrContext = createContext<OkrContextType>({
  objectives: [],
  setObjectives: () => {},
  isWaitingForResponse: false,
  setIsWaitingForResponse: () => {},
  objectiveForUpdate: defaultOKR,
  setObjectiveForUpdate: () => {},
  defaultKeyResult: defaultKeyResult,
  defaultOKR: defaultOKR,
});

const OkrProvider = ({ children }: { children: ReactElement }) => {
  const [objectives, setObjectives] = useState<OkrType[] | null>([]);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState<boolean>(false);
  const [objectiveForUpdate, setObjectiveForUpdate] = useState<OkrType>(defaultOKR);

  return (
    <OkrContext.Provider
      value={{
        objectives,
        setObjectives,
        isWaitingForResponse,
        setIsWaitingForResponse,
        objectiveForUpdate,
        setObjectiveForUpdate,
        defaultKeyResult,
        defaultOKR,
      }}
    >
      {children}
    </OkrContext.Provider>
  );
};

export default OkrProvider;
