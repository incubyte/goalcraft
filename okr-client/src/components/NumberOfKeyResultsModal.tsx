import { useState } from 'react';
import Input from './Input';
import { CircleX, Sparkles } from 'lucide-react';
import * as React from 'react';
import { generateKeyResultFromLLM } from '../database/okr.store.ts';
import {KeyResultToBeInsertedType} from '../types/okr.types.ts';
import { toast, ToastContainer } from 'react-toastify';

type NumberOfKeyResultsModalPropType = {
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  newObjective: string;
  setKeyResults: React.Dispatch<React.SetStateAction<KeyResultToBeInsertedType[]>>;
  isGenerating: boolean;
  setIsGenerate: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function NumberOfKeyResultsModal({
  setIsGenerating,
  newObjective,
  setKeyResults,
  isGenerating,
  setIsGenerate,
}: NumberOfKeyResultsModalPropType) {
  const [numberOfKeyResults, setNumberOfKeyResults] = useState<number>(3);

  function handleGenerateKeyResultFromLLM() {
    if (numberOfKeyResults < 1) {
      toast('Number of key results must be greater than 0 !!', {
        type: 'error',
        position: 'top-center',
        autoClose: 3000,
      });
    } else {
      setIsGenerate(false);
      setIsGenerating(true);

      generateKeyResultFromLLM(newObjective, numberOfKeyResults)
        .then((generatedKeyResults: KeyResultToBeInsertedType[]) => {
          setKeyResults(generatedKeyResults);
          setIsGenerating(false);
        })
        .catch(error => {
          alert(error);
          setIsGenerating(false);
        });
    }
  }

  return (
    <div className="h-full inset-0 fixed top-0 left-0 right-0 bottom-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-20">
      <div
        className="bg-white relative border-3 rounded-md p-5 w-1/3 flex flex-col space-y-2 justify-between"
        id="firstKeyResult"
      >
        <CircleX
          className="w-5 h-5 absolute top-3 right-3 cursor-pointer text-red-500"
          onClick={() => {
            setIsGenerate(false);
          }}
        />
        <div className="space-y-2">
          <h2 className="text-[#12a6a7]">Enter number of key results you want to generate</h2>
          <div className="flex justify-between">
            <Input
              label={''}
              type="number"
              placeholder=""
              className="flex-grow"
              value={numberOfKeyResults}
              onChange={e => {
                setNumberOfKeyResults(e.target.value);
              }}
            />
            <button
              className="bg-white z-10 border-2 my-2 h-10 border-[#12a6a7] hover:border-gray-700 hover:bg-gray-700 hover:text-white text-primary ease-linear flex items-center gap-x-3 px-4 py-1 rounded-md text-sm font-medium shadow-md"
              onClick={() => handleGenerateKeyResultFromLLM()}
            >
              <Sparkles className={`w-3 h-3 -rotate-45 ${isGenerating ? 'animate-ping' : ''}`} />{' '}
              Generate
            </button>
          </div>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}
