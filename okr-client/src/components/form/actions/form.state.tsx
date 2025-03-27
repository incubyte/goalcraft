import { useContext } from 'react';

import { OkrContext } from '../../../context/okr-data/okr.provider.tsx';
import { formContext } from '../../../context/okr-form/form.provider.tsx';
import { defaultOKR } from '../../../default/data.ts';
import { KeyResultToBeInsertedType, ObjectiveToBeInsertedType } from '../../../types/okr.types.ts';

export default function useStateAction() {
  const { selectedOkrsToBeUpdated, setSelectedOkrsToBeUpdated } = useContext(OkrContext);

  const { okrForm, dispatch } = useContext(formContext);

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
