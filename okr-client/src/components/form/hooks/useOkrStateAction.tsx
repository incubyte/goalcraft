import { useContext } from 'react';

import { OkrContext } from '../../../context/okr-data/okr.provider.tsx';
import {
  KeyResultToBeInsertedType,
  KeyResultType,
  ObjectiveToBeInsertedType,
  OkrType,
} from '../../../types/okr.types.ts';

export default function useOkrStateAction() {
  const { okrs, setOkrs, setIsWaitingForResponse, selectedOkrsToBeUpdated } =
    useContext(OkrContext);

  const objectiveToBeUpdated: ObjectiveToBeInsertedType = { objective: okrForm.objective };
  const keyResultsToBeUpdated: KeyResultToBeInsertedType[] = okrForm.keyResults;

  function getCurrentOkr(objectiveIndex: number): OkrType | undefined {
    return okrs.find((_, idx: number) => idx === objectiveIndex);
  }

  function getOkrToBeUpdated(): OkrType {
    console.log(selectedOkrsToBeUpdated, keyResultsToBeUpdated);
    return {
      id: selectedOkrsToBeUpdated.id,
      objective: objectiveToBeUpdated.objective,
      keyResults: keyResultsToBeUpdated.map((keyResult: KeyResultToBeInsertedType) => {
        return {
          ...keyResult,
          id: selectedOkrsToBeUpdated.keyResults[0].id,
          objectiveId: selectedOkrsToBeUpdated.keyResults[0].objectiveId,
        };
      }),
    };
  }

  function addKeyResultsToOkrState(currentOkrIndex: number, insertedKeyResult: KeyResultType[]) {
    const currentOkr = getCurrentOkr(currentOkrIndex);
    if (currentOkr === undefined) return;

    currentOkr.keyResults.push({
      ...insertedKeyResult[0],
      id: insertedKeyResult[0].id,
      objectiveId: insertedKeyResult[0].objectiveId,
    });

    const okrsToBeUpdated: OkrType[] = okrs.map((objective: OkrType, idx: number) => {
      return idx === currentOkrIndex ? currentOkr : objective;
    });
    setOkrs(okrsToBeUpdated);
  }

  function addOkrToState(insertedObjective: OkrType, insertedKeyResult: KeyResultType[]) {
    const okrToBeAddedInState = {
      ...insertedObjective,
      keyResults: insertedKeyResult,
    };
    setOkrs([...okrs, okrToBeAddedInState]);
  }

  function updateOkrsToState(updatedOkr: OkrType, okrsToBeUpdatedInDB: OkrType) {
    const okrsToBeUpdatedInState: OkrType[] = okrs.map((okr: OkrType) => {
      return okr.id === updatedOkr.id ? okrsToBeUpdatedInDB : okr;
    });

    setOkrs([...okrsToBeUpdatedInState]);
  }

  function setAllOkrsToState(okrsFromDB: OkrType[]) {
    setOkrs(okrsFromDB);
  }

  function startActionLoading() {
    setIsWaitingForResponse(true);
  }

  function stopActionLoading() {
    setIsWaitingForResponse(false);
  }

  return {
    addOkrToState,
    addKeyResultsToOkrState,
    getCurrentOkr,
    startActionLoading,
    stopActionLoading,
    updateOkrsToState,
    getOkrToBeUpdated,
    setAllOkrsToState,
  };
}
