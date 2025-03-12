import { Context, createContext, Dispatch, ReactElement, SetStateAction, useState } from 'react';

import useFormState from '../hooks/useFormState.ts';
import { KeyResultToBeInsertedType, OkrType } from '../types/okr.types.ts';

interface defaultOkrFormStateType {
  objective: string;
  keyResults: KeyResultToBeInsertedType[];
  isFormForOkrToUpdate: boolean;
}

type okrFormStateActionType =
  | { type: 'SET_OBJECTIVE'; payload: string }
  | { type: 'SET_KEYRESULTS'; payload: KeyResultToBeInsertedType[] }
  | { type: 'ADD_KEYRESULT' }
  | { type: 'UPDATE_KEYRESULT'; payload: { key: string; value: string | number; index: number } }
  | { type: 'DELETE_KEYRESULT'; payload: number }
  | { type: 'RESET_FORM' }
  | {
      type: 'TURN_INTO_EDITOR';
      payload: { objective: string; keyResults: KeyResultToBeInsertedType[] };
    };

interface OkrContextType {
  okrs: OkrType[];
  setOkrs: Dispatch<SetStateAction<OkrType[]>>;
  isWaitingForResponse: boolean;
  setIsWaitingForResponse: Dispatch<SetStateAction<boolean>>;
  selectedOkrsToBeUpdated: OkrType;
  setSelectedOkrsToBeUpdated: Dispatch<SetStateAction<OkrType>>;
  defaultKeyResult: KeyResultToBeInsertedType;
  defaultOKR: OkrType;
  okrForm: defaultOkrFormStateType;
  dispatch: Dispatch<okrFormStateActionType>;
}

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

const defaultOkrFormState: defaultOkrFormStateType = {
  objective: '',
  keyResults: [defaultKeyResult],
  isFormForOkrToUpdate: false,
};

export const OkrContext: Context<OkrContextType> = createContext<OkrContextType>({
  okrs: [],
  setOkrs: () => {},
  isWaitingForResponse: false,
  setIsWaitingForResponse: () => {},
  selectedOkrsToBeUpdated: defaultOKR,
  setSelectedOkrsToBeUpdated: () => {},
  defaultKeyResult: defaultKeyResult,
  defaultOKR: defaultOKR,
  okrForm: defaultOkrFormState,
  dispatch: () => {},
});

const OkrProvider = ({ children }: { children: ReactElement }) => {
  const [okrs, setOkrs] = useState<OkrType[]>([]);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState<boolean>(false);
  const [selectedOkrsToBeUpdated, setSelectedOkrsToBeUpdated] = useState<OkrType>(defaultOKR);
  const [okrForm, dispatch] = useFormState(defaultKeyResult);

  return (
    <OkrContext.Provider
      value={{
        okrs,
        setOkrs,
        isWaitingForResponse,
        setIsWaitingForResponse,
        selectedOkrsToBeUpdated,
        setSelectedOkrsToBeUpdated,
        defaultKeyResult,
        defaultOKR,
        okrForm,
        dispatch,
      }}
    >
      {children}
    </OkrContext.Provider>
  );
};

export default OkrProvider;
