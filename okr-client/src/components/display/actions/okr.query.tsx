import { deleteKeyResultFromDB, deleteOkrsFromDB } from '../../../database/okr.store.ts';
import { OkrType } from '../../../types/okr.types.ts';
import Toast from '../../ui/Toast.tsx';
import useStateAction from './okr.state.tsx';

export default function useQuery() {
  const { successToast, failureToast } = Toast();
  const {
    deleteOkrsFromState,
    deleteKeyResultFromOkrState,
    deleteKeyResultFromCurrentOkr,
    getCurrentOkr,
  } = useStateAction();

  function handleDeleteOkrs(objectiveId: string, objectiveIndex: number) {
    deleteOkrsFromDB(objectiveId)
      .then(() => {
        deleteOkrsFromState(objectiveIndex);
        successToast(`Your goal has been deleted!`);
      })
      .catch((error: Error) => {
        failureToast(`Something went wrong! ${error.message}`);
      });
  }

  function handleDeleteKeyResult(
    objectiveIndex: number,
    keyResultIndex: number,
    KeyResultID: string
  ) {
    deleteKeyResultFromDB(KeyResultID)
      .then(() => {
        const currentOkr: OkrType | undefined = getCurrentOkr(objectiveIndex);
        if (currentOkr === undefined) {
          failureToast('Something went wrong!');
          return;
        }

        deleteKeyResultFromCurrentOkr(keyResultIndex, currentOkr);
        deleteKeyResultFromOkrState(objectiveIndex, currentOkr);
        successToast('Key result has been deleted!');
      })
      .catch((error: Error) => {
        failureToast(`Something went wrong! ${error.message}`);
      });
  }

  return { handleDeleteOkrs, handleDeleteKeyResult };
}
