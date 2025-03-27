import { useContext } from 'react';

import { formContext } from '../../../context/okr-form/form.provider.tsx';
import { generateKeyResultFromLLM } from '../../../database/okr.store.ts';
import { KeyResultToBeInsertedType } from '../../../types/okr.types.ts';
import Toast from '../../ui/Toast.tsx';
import { useStateAction } from './prompt.state.tsx';

interface useQueryPropsType {
  handleSetKeyResults: (keyResults: KeyResultToBeInsertedType[]) => void;
}

export default function useQuery({ handleSetKeyResults }: useQueryPropsType) {
  const { successToast, failureToast } = Toast();
  const { okrForm } = useContext(formContext);
  const { numberOfKeyResults, startActionLoading, stopActionLoading, closePromptModal } =
    useStateAction();

  function handleGenerateKeyResultFromLLM() {
    if (numberOfKeyResults < 1) {
      failureToast('Hmm, seems like zero won’t work.');
    } else {
      startActionLoading();

      generateKeyResultFromLLM(okrForm.objective, numberOfKeyResults)
        .then((generatedKeyResults: KeyResultToBeInsertedType[]) => {
          handleSetKeyResults(generatedKeyResults);
          successToast('Key Result has been generated successfully!');
        })
        .catch((error: Error) => {
          failureToast(`Something went wrong! ${error.message}`);
        })
        .finally(() => {
          stopActionLoading();
          closePromptModal();
        });
    }
  }

  return { handleGenerateKeyResultFromLLM };
}
