import {
  addKeyResultsToDB,
  addObjectiveToDB,
  updateOkrsToDB,
} from '../../../database/okr.store.ts';
import UseFormValidators from '../../../hooks/useFormValidators.tsx';
import {
  KeyResultToBeInsertedType,
  KeyResultType,
  ObjectiveToBeInsertedType,
  OkrType,
} from '../../../types/okr.types.ts';
import Toast from '../../ui/Toast.tsx';
import useOkrStateAction from '../hooks/useOkrStateAction.tsx';
import useStateAction from './form.state.tsx';

export default function useQuery() {
  const { failureToast, successToast } = Toast();
  const { isInputValidToBeProcess } = UseFormValidators();
  const {
    resetFormInputs,
    turnFormIntoDefaultMode,
    getObjectiveToBeAdded,
    getKeyResultsToBeAdded,
  } = useStateAction();
  const {
    startActionLoading,
    stopActionLoading,
    addOkrToState,
    updateOkrsToState,
    getOkrToBeUpdated,
  } = useOkrStateAction();

  const objectiveToBeAdded: ObjectiveToBeInsertedType = getObjectiveToBeAdded();
  const keyResultsToBeAdded: KeyResultToBeInsertedType[] = getKeyResultsToBeAdded();

  function handleAddOkr() {
    if (!isInputValidToBeProcess()) return;

    startActionLoading();

    addObjectiveToDB(objectiveToBeAdded)
      .then((insertedObjective: OkrType) => {
        addKeyResultsToDB(keyResultsToBeAdded, insertedObjective.id)
          .then((insertedKeyResult: KeyResultType[]) => {
            addOkrToState(insertedObjective, insertedKeyResult);
            successToast('Your goal has been added successfully.');
          })
          .catch((error: Error) => {
            failureToast(`Something went wrong! ${error.message}`);
          })
          .finally(() => {
            resetFormInputs();
          });
      })
      .catch((error: Error) => {
        failureToast(`Something went wrong! ${error.message}`);
      })
      .finally(() => {
        resetFormInputs();
        stopActionLoading();
      });
  }

  function handleUpdateOkr() {
    if (resetFormInputs == undefined || turnFormIntoDefaultMode == undefined) return;
    startActionLoading();

    const okrToBeUpdatedInDB: OkrType = getOkrToBeUpdated();

    updateOkrsToDB(okrToBeUpdatedInDB)
      .then((updatedOkr: OkrType) => {
        updateOkrsToState(updatedOkr, okrToBeUpdatedInDB);
        successToast('Your okr has been updated successfully.');
      })
      .catch((error: Error) => {
        failureToast(`Something went wrong ${error.message}`);
      })
      .finally(() => {
        resetFormInputs();
        stopActionLoading();
        turnFormIntoDefaultMode();
      });
  }

  return { handleAddOkr, handleUpdateOkr };
}
