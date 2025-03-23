import { useReducer } from 'react';

import { defaultOkrFormStateType, okrFormStateActionType } from '../context/okr-form/types.ts';
import { defaultOkrFormState } from '../default/data.ts';
import { KeyResultToBeInsertedType } from '../types/okr.types.ts';

export default function useFormReducer(defaultKeyResult: KeyResultToBeInsertedType) {
  function formReducer(state: defaultOkrFormStateType, action: okrFormStateActionType) {
    if (action.type === 'SET_OBJECTIVE') {
      return { ...state, objective: action.payload };
    } else if (action.type === 'SET_KEYRESULTS') {
      return { ...state, keyResults: action.payload };
    } else if (action.type === 'ADD_KEYRESULT') {
      return { ...state, keyResults: [...state.keyResults, defaultKeyResult] };
    } else if (action.type === 'UPDATE_KEYRESULT') {
      const keyResultToBeUpdated = { ...state.keyResults[action.payload.index] };
      state.keyResults[action.payload.index] = {
        ...keyResultToBeUpdated,
        [action.payload.key]: action.payload.value,
      };
      return { ...state, keyResults: [...state.keyResults] };
    } else if (action.type === 'DELETE_KEYRESULT') {
      const keyResultsGroupAfterDeletion: KeyResultToBeInsertedType[] = state.keyResults.filter(
        (_, index: number) => index !== action.payload
      );
      return { ...state, keyResults: keyResultsGroupAfterDeletion };
    } else if (action.type === 'TURN_INTO_EDITOR') {
      return {
        objective: action.payload.objective,
        keyResults: action.payload.keyResults,
        isFormForOkrToUpdate: true,
      };
    } else if (action.type === 'RESET_FORM') {
      return { ...defaultOkrFormState };
    } else {
      return { ...defaultOkrFormState };
    }
  }

  return useReducer(formReducer, defaultOkrFormState);
}
