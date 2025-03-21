import { useContext } from 'react';

import { OkrContext } from '../../../context/okr.provider.tsx';
import { KeyResultToBeInsertedType, ObjectiveToBeInsertedType } from '../../../types/okr.types.ts';

export default function useStateAction() {
  const { selectedOkrsToBeUpdated, setSelectedOkrsToBeUpdated, defaultOKR } =
    useContext(OkrContext);

  const { okrForm, dispatch } = useContext(OkrContext);

  function handleObjectiveInputOnChange(objective: string) {
    dispatch({ type: 'SET_OBJECTIVE', payload: objective });
  }

  function handleKeyResultInputOnChange(key: string, value: string | number, index: number) {
    dispatch({ type: 'UPDATE_KEYRESULT', payload: { key, value, index } });
  }

  function handleAddKeyResultInputsGroup() {
    dispatch({ type: 'ADD_KEYRESULT' });
  }

  function handleDeleteKeyResultInputsGroup(inputsGroupId: number) {
    dispatch({ type: 'DELETE_KEYRESULT', payload: inputsGroupId });
  }

  function handleSetKeyResults(keyResults: KeyResultToBeInsertedType[]) {
    dispatch({ type: 'SET_KEYRESULTS', payload: keyResults });
  }

  function resetFormInputs() {
    dispatch({ type: 'RESET_FORM' });
  }

  function turnFormIntoUpdateMode() {
    dispatch({
      type: 'TURN_INTO_EDITOR',
      payload: {
        objective: selectedOkrsToBeUpdated.objective,
        keyResults: [...selectedOkrsToBeUpdated.keyResults],
      },
    });
  }

  function turnFormIntoDefaultMode() {
    setSelectedOkrsToBeUpdated(defaultOKR);
    resetFormInputs();
  }

  function handleAbortOkrToBeUpdate() {
    resetFormInputs();
    turnFormIntoDefaultMode();
  }

  function getObjectiveToBeAdded(): ObjectiveToBeInsertedType {
    return { objective: okrForm.objective };
  }

  function getKeyResultsToBeAdded(): KeyResultToBeInsertedType[] {
    return okrForm.keyResults;
  }

  return {
    getObjectiveToBeAdded,
    getKeyResultsToBeAdded,
    handleObjectiveInputOnChange,
    handleKeyResultInputOnChange,
    handleAddKeyResultInputsGroup,
    handleDeleteKeyResultInputsGroup,
    handleSetKeyResults,
    handleAbortOkrToBeUpdate,
    resetFormInputs,
    turnFormIntoDefaultMode,
    turnFormIntoUpdateMode,
  };
}
