import { createContext, ReactElement, useState } from 'react';
import { ObjectiveType } from '../types/OKRTypes';

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

type OkrContextType = {
  objectives: ObjectiveType[] | null;
  setObjectives: React.Dispatch<React.SetStateAction<ObjectiveType[] | null>>;
  isWaitingForResponse: boolean;
  setIsWaitingForResponse: React.Dispatch<React.SetStateAction<boolean>>;
  objectiveForUpdate: ObjectiveType;
  setObjectiveForUpdate: React.Dispatch<React.SetStateAction<ObjectiveType>>;
};

export const OkrContext = createContext<OkrContextType>({
  objectives: [],
  setObjectives: () => {},
  isWaitingForResponse: false,
  setIsWaitingForResponse: () => {},
  objectiveForUpdate: defaultOKR,
  setObjectiveForUpdate: () => {},
});

const OkrProvider = ({ children }: { children: ReactElement }) => {
  const [objectives, setObjectives] = useState<ObjectiveType[] | null>([]);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState<boolean>(false);
  const [objectiveForUpdate, setObjectiveForUpdate] = useState<ObjectiveType>(defaultOKR);

  return (
    <OkrContext.Provider
      value={{
        objectives,
        setObjectives,
        isWaitingForResponse,
        setIsWaitingForResponse,
        objectiveForUpdate,
        setObjectiveForUpdate,
      }}
    >
      {children}
    </OkrContext.Provider>
  );
};

export default OkrProvider;
