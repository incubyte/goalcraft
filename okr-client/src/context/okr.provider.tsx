import { Context, createContext, Dispatch, ReactElement, SetStateAction, useState } from 'react';

import { KeyResultToBeInsertedType, OkrType } from '../types/okr.types.ts';

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

interface OkrContextType {
  okrs: OkrType[] | null;
  setOkrs: Dispatch<SetStateAction<OkrType[] | null>>;
  isWaitingForResponse: boolean;
  setIsWaitingForResponse: Dispatch<SetStateAction<boolean>>;
  objectiveForUpdate: OkrType;
  setObjectiveForUpdate: Dispatch<SetStateAction<OkrType>>;
  defaultKeyResult: KeyResultToBeInsertedType;
  defaultOKR: OkrType;
}

export const OkrContext: Context<OkrContextType> = createContext<OkrContextType>({
  okrs: [],
  setOkrs: () => {},
  isWaitingForResponse: false,
  setIsWaitingForResponse: () => {},
  objectiveForUpdate: defaultOKR,
  setObjectiveForUpdate: () => {},
  defaultKeyResult: defaultKeyResult,
  defaultOKR: defaultOKR,
});

const OkrProvider = ({ children }: { children: ReactElement }) => {
  const [okrs, setOkrs] = useState<OkrType[] | null>([]);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState<boolean>(false);
  const [objectiveForUpdate, setObjectiveForUpdate] = useState<OkrType>(defaultOKR);

  return (
    <OkrContext.Provider
      value={{
        okrs,
        setOkrs,
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
