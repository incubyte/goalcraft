import { useContext } from 'react';

import { OkrContext } from '../../../context/okr-data/okr.provider.tsx';
import { OkrType } from '../../../types/okr.types.ts';

export default function useStateAction() {
  const { okrs, setOkrs } = useContext(OkrContext);

  function deleteOkrsFromState(objectiveIndex: number) {
    const updatedObjectives: OkrType[] = okrs.filter((_, idx: number) => objectiveIndex !== idx);
    setOkrs(updatedObjectives);
  }
  function deleteKeyResultFromOkrState(objectiveIndex: number, okrWithDeletedKeyResult: OkrType) {
    const updatedObjectives: OkrType[] = okrs.map((okr: OkrType, index: number) => {
      return index === objectiveIndex ? okrWithDeletedKeyResult : okr;
    });

    setOkrs(updatedObjectives);
  }

  function deleteKeyResultFromCurrentOkr(keyResultIndex: number, okr: OkrType) {
    okr.keyResults = okr?.keyResults.filter((_, index: number) => index !== keyResultIndex);
  }

  function getCurrentOkr(objectiveIndex: number): OkrType | undefined {
    return okrs.find((_, idx: number) => idx === objectiveIndex);
  }

  return {
    deleteOkrsFromState,
    deleteKeyResultFromCurrentOkr,
    deleteKeyResultFromOkrState,
    getCurrentOkr,
  };
}
