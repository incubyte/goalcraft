import { useContext } from 'react';

import Toast from '../components/ui/Toast.tsx';
import { OkrContext } from '../context/okr-data/okr.provider.tsx';
import { KeyResultToBeInsertedType } from '../types/okr.types.ts';

export default function UseFormValidators() {
  const { failureToast } = Toast();
  const { okrForm } = useContext(OkrContext);

  function isObjectiveEmpty(): boolean {
    return okrForm.objective.trim().length === 0;
  }

  function isKeyResultsTitleEmpty(): boolean {
    return okrForm.keyResults.some(
      (keyResultInputGroup: KeyResultToBeInsertedType) =>
        keyResultInputGroup.title.trim().length == 0
    );
  }

  function isKeyResultWithZeroInitAndTarget(): boolean {
    return okrForm.keyResults.some((keyResultInputGroup: KeyResultToBeInsertedType) => {
      return keyResultInputGroup.targetValue == 0 && keyResultInputGroup.initialValue == 0;
    });
  }

  function isInputValidToBeProcess(): boolean {
    if (isObjectiveEmpty()) {
      failureToast('Please specify an objective!');
      return false;
    }

    if (isKeyResultsTitleEmpty()) {
      failureToast('Please specify key result!');
      return false;
    }

    if (isKeyResultWithZeroInitAndTarget()) {
      failureToast("Initial and Target value can't be same as zero");
      return false;
    }

    return true;
  }

  return {
    isObjectiveEmpty,
    isKeyResultsTitleEmpty,
    isKeyResultWithZeroInitAndTarget,
    isInputValidToBeProcess,
  };
}
