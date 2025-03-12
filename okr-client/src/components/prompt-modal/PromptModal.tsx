import { Tooltip } from '@mui/material';
import { CircleX, Sparkles } from 'lucide-react';
import { ChangeEvent } from 'react';
import { ToastContainer } from 'react-toastify';

import UseFormValidators from '../../hooks/useFormValidators.tsx';
import { KeyResultToBeInsertedType } from '../../types/okr.types.ts';
import Input from '../ui/Input.tsx';
import useQuery from './actions/prompt.query.tsx';
import { useStateAction } from './actions/prompt.state.tsx';

interface GenerateKeyResultModalProps {
  handleSetKeyResults: (keyResults: KeyResultToBeInsertedType[]) => void;
}

export default function PromptModal({ handleSetKeyResults }: GenerateKeyResultModalProps) {
  const {
    isNumberOfKeyResultModalOpen,
    isGeneratingKeyResult,
    numberOfKeyResults,
    handleNoOfKeyResultsInputOnChange,
    openPromptModal,
    closePromptModal,
  } = useStateAction();
  const { isObjectiveEmpty } = UseFormValidators();

  const { handleGenerateKeyResultFromLLM } = useQuery({ handleSetKeyResults });
  return (
    <>
      <Tooltip
        title="Use AI-Generated key-Results."
        placement="right"
        slotProps={{
          tooltip: {
            sx: {
              color: 'black',
              backgroundColor: '#E1E1E1',
              fontSize: '0.7em',
            },
          },
        }}
      >
        <button
          onClick={() => openPromptModal(isObjectiveEmpty)}
          className="bg-white absolute left-1/2 -translate-x-1/2 z-10 -bottom-7 border-2 border-[#12a6a7] hover:border-gray-700 hover:bg-gray-700 hover:text-white text-primary ease-linear flex items-center gap-x-1.5 px-4 py-2 rounded-md text-sm font-medium shadow-md"
        >
          <Sparkles className={`w-4 h-4 -rotate-45`} />
          Craft With AI
        </button>
      </Tooltip>
      <ToastContainer />
      {isNumberOfKeyResultModalOpen && (
        <div className="h-full inset-0 fixed top-0 left-0 right-0 bottom-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-20">
          <div
            className="bg-white relative border-3 rounded-md p-5 w-1/3 flex flex-col space-y-2 justify-between"
            id="firstKeyResult"
          >
            <div className="w-full flex justify-between items-center mb-5">
              <p className="font-medium text-sm">AI-Powered Target Crafting</p>
              <CircleX className="w-5 h-5 cursor-pointer text-red-500" onClick={closePromptModal} />
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
                    handleNoOfKeyResultsInputOnChange(parseInt(e.target.value));
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
            </div>
          </div>
          <ToastContainer />
        </div>
      )}
    </>
  );
}
