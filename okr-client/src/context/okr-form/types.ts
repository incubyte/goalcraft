import { Dispatch } from 'react';

import { KeyResultToBeInsertedType } from '../../types/okr.types.ts';

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

interface formContextType {
  okrForm: defaultOkrFormStateType;
  dispatch: Dispatch<okrFormStateActionType>;
}

export type { defaultOkrFormStateType, formContextType, okrFormStateActionType };
