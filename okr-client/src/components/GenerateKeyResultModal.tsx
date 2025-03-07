import { CircleX, Sparkles } from 'lucide-react';
import * as React from 'react';
import { ChangeEvent, useState } from 'react';
import { ToastContainer } from 'react-toastify';

import { generateKeyResultFromLLM } from '../database/okr.store.ts';
import { KeyResultToBeInsertedType } from '../types/okr.types.ts';
import Input from './Input';
import Toast from './Toast.tsx';

interface NumberOfKeyResultsModalPropType {
  objectivePrompt: string;
  setKeyResults: React.Dispatch<React.SetStateAction<KeyResultToBeInsertedType[]>>;
  setIsNumberOfKeyResultModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function GenerateKeyResultModal({
  objectivePrompt,
  setKeyResults,
  setIsNumberOfKeyResultModalOpen,
}: NumberOfKeyResultsModalPropType) {
  const [numberOfKeyResults, setNumberOfKeyResults] = useState<number>(2);
  const [isGeneratingKeyResult, setIsGeneratingKeyResult] = useState<boolean>(false);
  const { successToast, failureToast } = Toast();

  function handleGenerateKeyResultFromLLM() {
    if (numberOfKeyResults < 1) {
      failureToast('Hmm, seems like zero won’t work.');
    } else {
      setIsGeneratingKeyResult(true);

      generateKeyResultFromLLM(objectivePrompt, numberOfKeyResults)
        .then((generatedKeyResults: KeyResultToBeInsertedType[]) => {
          setKeyResults(generatedKeyResults);
          successToast('Key Result has been generated successfully!');
        })
        .catch((error: Error) => {
          failureToast(`Something went wrong! ${error.message}`);
        })
        .finally(() => {
          setIsGeneratingKeyResult(false);
          setIsNumberOfKeyResultModalOpen(false);
        });
    }
  }

  return (
    <div className="h-full inset-0 fixed top-0 left-0 right-0 bottom-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-20">
      <div
        className="bg-white relative border-3 rounded-md p-5 w-1/3 flex flex-col space-y-2 justify-between"
        id="firstKeyResult"
      >
        <div className="w-full flex justify-between items-center mb-5">
          <p className="font-medium text-sm">AI-Powered Target Crafting</p>
          <CircleX
            className="w-5 h-5 cursor-pointer text-red-500"
            onClick={() => {
              setIsNumberOfKeyResultModalOpen(false);
            }}
          />
        </div>
        <div>
          <div className="flex justify-between">
            <Input
              label={'No. of Key Result'}
              type="number"
              placeholder=""
              className="flex-grow"
              value={numberOfKeyResults}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setNumberOfKeyResults(parseInt(e.target.value));
              }}
            />
            <button
              className="bg-white border-2 my-2 h-10 border-[#12a6a7] hover:border-gray-700 hover:bg-gray-700 hover:text-white text-primary ease-linear flex items-center gap-x-2 px-4 py-1 rounded-md text-sm font-medium shadow-md"
              onClick={() => handleGenerateKeyResultFromLLM()}
            >
              <Sparkles
                className={`w-4 h-4 -rotate-45 ${isGeneratingKeyResult ? 'animate-ping' : ''}`}
              />{' '}
              {isGeneratingKeyResult ? 'Crafting...' : 'Craft Targets'}
            </button>
          </div>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}
