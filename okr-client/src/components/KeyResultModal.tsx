import { CircleX, PackagePlus } from 'lucide-react';
import { ChangeEvent, useContext, useState } from 'react';

import { OkrContext } from '../context/okr.provider.tsx';
import { addKeyResultsToDB } from '../database/okr.store.ts';
import {
  KeyResultModalType,
  KeyResultToBeInsertedType,
  KeyResultType,
  OkrType,
} from '../types/okr.types.ts';
import Input from './Input';
import Toast from './Toast.tsx';

export default function KeyResultModal({
  closeModal,
  keyResultModal,
}: {
  closeModal: () => void;
  keyResultModal: KeyResultModalType;
}) {
  const { okrs, setOkrs, defaultKeyResult } = useContext(OkrContext);
  const { successToast, failureToast } = Toast();

  const [keyResult, setKeyResult] = useState<KeyResultToBeInsertedType>(defaultKeyResult);

  function isKeyResultEmpty(): boolean {
    return keyResult.title.trim().length === 0;
  }

  function getCurrentOkr(): OkrType | undefined {
    return okrs.find((_, idx: number) => idx === keyResultModal.objectiveIndex);
  }

  function addKeyResultsToOkrState(currentOkr: OkrType, insertedKeyResult: KeyResultType[]) {
    currentOkr.keyResults.push({
      ...keyResult,
      id: insertedKeyResult[0].id,
      objectiveId: insertedKeyResult[0].objectiveId,
    });

    const okrsToBeUpdated: OkrType[] = okrs.map((objective: OkrType, idx: number) => {
      return idx === keyResultModal.objectiveIndex ? currentOkr : objective;
    });
    setOkrs(okrsToBeUpdated);
  }

  function handleAddKeyResult() {
    if (isKeyResultEmpty()) {
      failureToast("Title can't be empty!");
      return;
    }

    const currentOkr: OkrType | undefined = getCurrentOkr();
    if (currentOkr === undefined) {
      failureToast('Something went wrong!');
      return;
    }

    addKeyResultsToDB([keyResult], currentOkr.id)
      .then((insertedKeyResult: KeyResultType[]) => {
        addKeyResultsToOkrState(currentOkr, insertedKeyResult);
        successToast('Key Result successfully added!');
      })
      .catch((error: Error) => {
        failureToast(`Something went wrong! ${error.message}`);
      });

    closeModal();
  }

  function handleInputOnChange(key: string, value: number | string) {
    const keyResultInputToBeChanged: KeyResultToBeInsertedType = { ...keyResult, [key]: value };
    setKeyResult(keyResultInputToBeChanged);
  }

  return (
    <div className="inset-0 fixed bg-gray-500 flex bg-opacity-50 justify-center items-center z-20">
      <div
        id="firstKeyResult"
        className="bg-white relative border-3 rounded-md p-10 w-1/2 flex flex-col space-y-2"
      >
        <div className="w-full flex justify-between mb-3">
          <h1 className="text-secondary font-medium mb-2">
            {okrs && okrs[keyResultModal.objectiveIndex].objective}
          </h1>
          <button onClick={closeModal} className="text-red-500">
            <CircleX className="w-5 h-5" />
          </button>
        </div>
        <Input
          label={'Title'}
          value={keyResult.title}
          className="flex-grow"
          type="text"
          placeholder="Increase brand awarness"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            handleInputOnChange('title', e.target.value);
          }}
        />
        <div id="firstKeyResultMetrics" className="flex justify-between flex-wrap gap-2">
          <Input
            label={'Initial Value'}
            value={keyResult.initialValue}
            type="number"
            placeholder="Initial Value"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              handleInputOnChange('initialValue', parseInt(e.target.value));
            }}
          />
          <Input
            label={'Current Value'}
            value={keyResult.currentValue}
            type="number"
            placeholder="Current Value"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              handleInputOnChange('currentValue', parseInt(e.target.value));
            }}
          />
          <Input
            label={'Target Value'}
            value={keyResult.targetValue}
            type="number"
            placeholder="Target Value"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              handleInputOnChange('targetValue', parseInt(e.target.value));
            }}
          />
          <Input
            label={'Metric'}
            value={keyResult.metric}
            type="text"
            placeholder="%"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              handleInputOnChange('metric', e.target.value);
            }}
          />
          <div className="flex h-full gap-x-5">
            <button
              onClick={() => handleAddKeyResult()}
              className="hover:bg-white h-full border hover:border-[#12a6a7] bg-primary text-white hover:text-[#12a6a7] p-3 px-4 rounded-md text-sm font-medium flex items-center justify-center gap-x-1.5 ease-in-out"
            >
              <PackagePlus className="w-4 h-4" />
              Add Key Result
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
