import { BetweenHorizonalStart, Goal, LoaderCircle } from 'lucide-react';
import { ChangeEvent, memo, useContext, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';

import { OkrContext } from '../../context/okr-data/okr.provider.tsx';
import { formContext } from '../../context/okr-form/form.provider.tsx';
import { KeyResultToBeInsertedType } from '../../types/okr.types.ts';
import PromptModal from '../prompt-modal/PromptModal.tsx';
import Input from '../ui/Input.tsx';
import { KeyResultInputsGroup } from '../ui/KeyResultInputsGroup.tsx';
import useQuery from './actions/form.query.tsx';
import useStateAction from './actions/form.state.tsx';

export default memo(function OKRForm() {
  const { isWaitingForResponse, selectedOkrsToBeUpdated } = useContext(OkrContext);
  const { okrForm } = useContext(formContext);
  const { handleAddOkr, handleUpdateOkr } = useQuery();
  const {
    handleObjectiveInputOnChange,
    handleKeyResultInputOnChange,
    handleAddKeyResultInputsGroup,
    handleDeleteKeyResultInputsGroup,
    handleSetKeyResults,
    handleAbortOkrToBeUpdate,
    turnFormIntoUpdateMode,
  } = useStateAction();

  useEffect(() => {
    if (selectedOkrsToBeUpdated.id != '') turnFormIntoUpdateMode();
  }, [selectedOkrsToBeUpdated]);

  return (
    <div
      id="addObjective"
      className="w-2/5 h-[90%] overflow-hidden flex flex-col space-y-2 rounded-md bg-gray-50 border-1 shadow"
    >
      <div className="relative top-0 bg-gray-50 space-y-8 px-8 py-4 z-10">
        <h1 className="font-medium text-lg mt-2 text-center">
          <span className="text-primary">Goal</span>Craft -{' '}
          <span className="text-secondary">OKR Application</span>
        </h1>

        <div id="objectForm" className="w-full">
          <Input
            label={'Objective'}
            type="text"
            placeholder="E.g.: Increase brand awareness"
            className="flex-grow"
            value={okrForm.objective}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              handleObjectiveInputOnChange(e.target.value);
            }}
          />
        </div>

        {!okrForm.isFormForOkrToUpdate && <PromptModal handleSetKeyResults={handleSetKeyResults} />}
      </div>
      <hr />

      <div
        className="w-full h-full overflow-y-scroll relative flex flex-col space-y-4 px-8 py-4 pt-5"
        id="keyResultForm"
      >
        {okrForm.keyResults.map(
          (keyResultInput: KeyResultToBeInsertedType, keyResultInputIndex: number) => (
            <div className="flex flex-col space-y-2" id="firstKeyResult" key={keyResultInputIndex}>
              <KeyResultInputsGroup
                keyResult={keyResultInput}
                keyResultInputIndex={keyResultInputIndex}
                handleInputOnChange={handleKeyResultInputOnChange}
                handleDeleteKeyResultInputsGroup={handleDeleteKeyResultInputsGroup}
              />
            </div>
          )
        )}
      </div>

      <div className="w-full flex justify-between bg-gray-50 px-8 py-5" id="submitButton">
        {okrForm.isFormForOkrToUpdate ? (
          <button
            className="bg-secondary hover:bg-gray-800 ease-linear px-4 py-2 rounded-md text-white text-sm font-medium"
            onClick={handleAbortOkrToBeUpdate}
          >
            Cancel
          </button>
        ) : (
          <button
            className="bg-secondary hover:bg-gray-800 ease-linear px-4 py-2 rounded-md text-white text-sm font-medium flex items-center gap-x-1"
            onClick={handleAddKeyResultInputsGroup}
          >
            <BetweenHorizonalStart className="w-4 h-4" />
            Add Key Result
          </button>
        )}
        <button
          className="bg-primary hover:bg-gray-800 px-4 py-2 rounded-md text-white text-sm font-medium flex items-center"
          onClick={okrForm.isFormForOkrToUpdate ? handleUpdateOkr : handleAddOkr}
        >
          {isWaitingForResponse && <LoaderCircle className="w-4 h-4 mr-1 animate-spin" />}{' '}
          {okrForm.isFormForOkrToUpdate ? (
            'Update Objective'
          ) : (
            <p className="flex items-center gap-x-1">
              <Goal className="w-4 h-4" />
              <span>Set Goal</span>
            </p>
          )}
        </button>
      </div>
      <ToastContainer />
    </div>
  );
});
