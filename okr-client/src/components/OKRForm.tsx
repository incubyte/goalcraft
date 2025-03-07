import { Tooltip } from '@mui/material';
import { BetweenHorizonalStart, Goal, LoaderCircle, Sparkles } from 'lucide-react';
import { ChangeEvent, memo, useContext, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';

import { OkrContext } from '../context/okr.provider.tsx';
import { addKeyResultsToDB, addObjectiveToDB, updateOkrsToDB } from '../database/okr.store.ts';
import {
  KeyResultToBeInsertedType,
  KeyResultType,
  ObjectiveToBeInsertedType,
  OkrType,
} from '../types/okr.types.ts';
import GenerateKeyResultModal from './GenerateKeyResultModal.tsx';
import Input from './Input';
import { KeyResultInputs } from './KeyResultInputs.tsx';
import Toast from './Toast.tsx';

export default memo(function OKRForm() {
  const {
    okrs,
    setOkrs,
    isWaitingForResponse,
    setIsWaitingForResponse,
    selectedOkrsToBeUpdated,
    setSelectedOkrsToBeUpdated,
    defaultKeyResult,
    defaultOKR,
  } = useContext(OkrContext);

  const { failureToast, successToast } = Toast();

  const [isFormForOkrToUpdate, setIsFormForOkrToUpdate] = useState<boolean>(false);
  const [newObjective, setNewObjective] = useState<string>('');
  const [keyResults, setKeyResults] = useState<KeyResultToBeInsertedType[]>([defaultKeyResult]);
  const [isNumberOfKeyResultModalOpen, setIsNumberOfKeyResultModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (selectedOkrsToBeUpdated.id != '') turnFormIntoUpdateMode();
  }, [selectedOkrsToBeUpdated]);

  function turnFormIntoUpdateMode() {
    setNewObjective(selectedOkrsToBeUpdated.objective);
    setKeyResults([...selectedOkrsToBeUpdated.keyResults]);
    setIsFormForOkrToUpdate(true);
  }

  function isObjectiveEmpty(): boolean {
    return newObjective.trim().length === 0;
  }

  function isKeyResultsTitleEmpty(): boolean {
    return (
      keyResults.filter(
        (keyResultInputGroup: KeyResultToBeInsertedType) =>
          keyResultInputGroup.title.trim().length == 0
      ).length != 0
    );
  }

  function isKeyResultWithZeroInitAndTarget(): boolean {
    const noOfInvalidKeyResult: KeyResultToBeInsertedType[] = keyResults.filter(
      (keyResultInputGroup: KeyResultToBeInsertedType) => {
        return keyResultInputGroup.targetValue == 0 && keyResultInputGroup.initialValue == 0;
      }
    );

    return noOfInvalidKeyResult.length > 0;
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

  function addOkrToState(insertedObjective: OkrType, insertedKeyResult: KeyResultType[]) {
    const okrToBeAddedInState = {
      ...insertedObjective,
      keyResults: insertedKeyResult,
    };
    setOkrs([...okrs, okrToBeAddedInState]);
  }

  function getObjectiveToBeAdded(): ObjectiveToBeInsertedType {
    return { objective: newObjective };
  }

  function handleAddOkr() {
    if (!isInputValidToBeProcess()) return;

    setIsWaitingForResponse(true);

    const objectiveToBeAdded: ObjectiveToBeInsertedType = getObjectiveToBeAdded();

    addObjectiveToDB(objectiveToBeAdded)
      .then((insertedObjective: OkrType) => {
        addKeyResultsToDB(keyResults, insertedObjective.id)
          .then((insertedKeyResult: KeyResultType[]) => {
            addOkrToState(insertedObjective, insertedKeyResult);
            successToast('Your goal has been added successfully.');
          })
          .catch((error: Error) => {
            failureToast(`Something went wrong! ${error.message}`);
          })
          .finally(() => {
            resetFormInputs();
          });
      })
      .catch((error: Error) => {
        failureToast(`Something went wrong! ${error.message}`);
      })
      .finally(() => {
        resetFormInputs();
      });
  }

  function handleGenerateKeyResultFromLLM() {
    if (newObjective.length == 0) {
      failureToast('Please enter an objective!');
    } else {
      setIsNumberOfKeyResultModalOpen(true);
    }
  }

  function updateOkrsToState(updatedOkr: OkrType, okrsToBeUpdatedInDB: OkrType) {
    const okrsToBeUpdatedInState: OkrType[] = okrs.map((okr: OkrType) => {
      return okr.id === updatedOkr.id ? okrsToBeUpdatedInDB : okr;
    });

    setOkrs([...okrsToBeUpdatedInState]);
  }

  function getOkrToBeUpdated(): OkrType {
    return {
      id: selectedOkrsToBeUpdated.id,
      objective: newObjective,
      keyResults: keyResults.map((keyResult: KeyResultToBeInsertedType) => {
        return {
          ...keyResult,
          id: selectedOkrsToBeUpdated.keyResults[0].id,
          objectiveId: selectedOkrsToBeUpdated.keyResults[0].objectiveId,
        };
      }),
    };
  }

  function handleUpdateOkr() {
    setIsWaitingForResponse(true);

    const okrToBeUpdatedInDB: OkrType = getOkrToBeUpdated();

    updateOkrsToDB(okrToBeUpdatedInDB)
      .then((updatedOkr: OkrType) => {
        updateOkrsToState(updatedOkr, okrToBeUpdatedInDB);
        successToast('Your okr has been updated successfully.');
      })
      .catch((error: Error) => {
        failureToast(`Something went wrong ${error.message}`);
      })
      .finally(() => {
        resetFormInputs();
        turnFormIntoDefaultMode();
      });
  }

  function handleAddKeyResultInputsGroup() {
    setKeyResults((prev: KeyResultToBeInsertedType[]) => [...prev, defaultKeyResult]);
  }

  function handleDeleteKeyResultInputsGroup(inputsGroupId: number) {
    const updatedKeyResultInputList: KeyResultToBeInsertedType[] = keyResults.filter(
      (_, index: number) => {
        return index !== inputsGroupId;
      }
    );

    setKeyResults(updatedKeyResultInputList);
  }

  function handleAbortOkrToBeUpdate() {
    resetFormInputs();
    turnFormIntoDefaultMode();
  }

  function handleKeyResultInputOnChange(key: string, value: string | number, index: number) {
    console.warn(index);
    setKeyResults((keyResultsInState: KeyResultToBeInsertedType[]) => {
      const keyResultToBeUpdated = { ...keyResultsInState[index] };
      keyResultsInState[index] = { ...keyResultToBeUpdated, [key]: value };
      return [...keyResultsInState];
    });
  }

  function resetFormInputs() {
    setNewObjective('');
    setKeyResults([defaultKeyResult]);
    setIsWaitingForResponse(false);
  }

  function turnFormIntoDefaultMode() {
    setSelectedOkrsToBeUpdated(defaultOKR);
    setIsFormForOkrToUpdate(false);
  }

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
            value={newObjective}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setNewObjective(e.target.value);
            }}
          />
        </div>

        {!isFormForOkrToUpdate && (
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
                onClick={() => handleGenerateKeyResultFromLLM()}
                className="bg-white absolute left-1/2 -translate-x-1/2 z-10 -bottom-7 border-2 border-[#12a6a7] hover:border-gray-700 hover:bg-gray-700 hover:text-white text-primary ease-linear flex items-center gap-x-1.5 px-4 py-2 rounded-md text-sm font-medium shadow-md"
              >
                <Sparkles className={`w-4 h-4 -rotate-45`} />
                Craft With AI
              </button>
            </Tooltip>
            <ToastContainer />
          </>
        )}
      </div>
      <hr />

      <div
        className="w-full h-full overflow-y-scroll relative flex flex-col space-y-4 px-8 py-4 pt-5"
        id="keyResultForm"
      >
        {keyResults &&
          keyResults.length > 0 &&
          keyResults.map(
            (keyResultInput: KeyResultToBeInsertedType, keyResultInputIndex: number) => (
              <div
                className="flex flex-col space-y-2"
                id="firstKeyResult"
                key={keyResultInputIndex}
              >
                <KeyResultInputs
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
        {isFormForOkrToUpdate ? (
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
          onClick={isFormForOkrToUpdate ? handleUpdateOkr : handleAddOkr}
        >
          {isWaitingForResponse && <LoaderCircle className="w-4 h-4 mr-1 animate-spin" />}{' '}
          {isFormForOkrToUpdate ? (
            'Update Objective'
          ) : (
            <p className="flex items-center gap-x-1">
              <Goal className="w-4 h-4" />
              <span>Set Goal</span>
            </p>
          )}
        </button>

        {isNumberOfKeyResultModalOpen && (
          <GenerateKeyResultModal
            objectivePrompt={newObjective}
            setKeyResults={setKeyResults}
            setIsNumberOfKeyResultModalOpen={setIsNumberOfKeyResultModalOpen}
          />
        )}
      </div>
    </div>
  );
});
