import { addKeyResultsToDB } from '../../../database/okr.store.ts';
import { KeyResultType, OkrType } from '../../../types/okr.types.ts';
import useOkrStateAction from '../../form/hooks/useOkrStateAction.tsx';
import Toast from '../../ui/Toast.tsx';
import { useStateAction } from './keyresult.state.tsx';

export default function useQuery() {
  const { successToast, failureToast } = Toast();
  const { keyResult, isKeyResultEmpty, closeKeyResultModal, isKeyResultModalOpen } =
    useStateAction();
  const { getCurrentOkr, addKeyResultsToOkrState } = useOkrStateAction();

  function handleAddKeyResult() {
    if (isKeyResultEmpty()) {
      failureToast("Title can't be empty!");
      return;
    }

    const currentOkr: OkrType | undefined = getCurrentOkr(isKeyResultModalOpen.objectiveIndex);
    if (currentOkr === undefined) {
      failureToast('Something went wrong!');
      return;
    }

    addKeyResultsToDB([keyResult], currentOkr.id)
      .then((insertedKeyResult: KeyResultType[]) => {
        addKeyResultsToOkrState(isKeyResultModalOpen.objectiveIndex, insertedKeyResult);
        successToast('Key Result successfully added!');
      })
      .catch((error: Error) => {
        failureToast(`Something went wrong! ${error.message}`);
      });

    closeKeyResultModal();
  }

  return { handleAddKeyResult };
}
