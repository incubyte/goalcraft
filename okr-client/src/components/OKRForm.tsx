import { Tooltip } from '@mui/material';
import { BetweenHorizonalStart, Goal, LoaderCircle, Sparkles, Trash2 } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';

import { OkrContext } from '../context/okr.provider.tsx';
import {
  addKeyResultsToDB,
  addObjectiveToDB,
  getOkrsFromDB,
  updateOkrsToDB,
} from '../database/okr.store.ts';
import { KeyResultToBeInsertedType, KeyResultType, OkrType } from '../types/okr.types.ts';
import Input from './Input';
import NumberOfKeyResultsModal from './NumberOfKeyResultsModal.tsx';

export default function OKRForm() {
  const {
    objectives,
    setObjectives,
    isWaitingForResponse,
    setIsWaitingForResponse,
    objectiveForUpdate,
    setObjectiveForUpdate,
    defaultKeyResult,
    defaultOKR,
  } = useContext(OkrContext);

  const [isUpdateForm, setIsUpdateForm] = useState<boolean>(false);
  const [newObjective, setNewObjective] = useState<string>('');
  const [keyResults, setKeyResults] = useState<KeyResultToBeInsertedType[]>([defaultKeyResult]);
  const [isNumberOfKeyResultModalOpen, setIsNumberOfKeyResultModalOpen] = useState<boolean>(false);

  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  function handleCancelUpdateORKs() {
    setObjectiveForUpdate(defaultOKR);
    setKeyResults([defaultKeyResult]);
    setNewObjective('');
    setIsUpdateForm(false);
    (async () => {
      const objectivesResponse: OkrType[] = await getOkrsFromDB();
      setObjectives(objectivesResponse);
    })();
  }

  useEffect(() => {
    if (objectiveForUpdate.id != '') {
      setNewObjective(objectiveForUpdate.objective);
      setKeyResults(objectiveForUpdate.keyResults);
      setIsUpdateForm(true);
    }
  }, [objectiveForUpdate]);

  function handleKeyResultChange(key: string, value: string | number, index: number) {
    setKeyResults((prev: KeyResultToBeInsertedType[]) => {
      const keyResultToBeUpdated = { ...prev[index] };
      prev[index] = { ...keyResultToBeUpdated, [key]: value };
      return [...prev];
    });
  }

  function addNewObjective() {
    if (newObjective.length == 0 || keyResults.length == 0) {
      toast('Please enter an Objective!', {
        position: 'top-center',
        type: 'error',
        autoClose: 3000,
      });
      return;
    }

    setIsWaitingForResponse(true);
    const objectiveToBeAdded = { objective: newObjective };

    // inserting objective into db.
    addObjectiveToDB(objectiveToBeAdded)
      .then((objectiveResponse: OkrType) => {
        if (objectives === null) return;
        if (keyResults[0].title != '') {
          addKeyResultsToDB(keyResults, objectiveResponse.id).then(
            (keyResultsResponse: KeyResultType[]) => {
              const objectiveToBeAddedToState = {
                ...objectiveResponse,
                keyResults: keyResultsResponse,
              };
              setObjectives([...objectives, objectiveToBeAddedToState]);
            }
          );
        } else {
          setObjectives([...objectives, objectiveResponse]);
        }

        setKeyResults([defaultKeyResult]);
        setNewObjective('');
        setIsWaitingForResponse(false);
      })
      .catch(error => {
        alert(error);
      });
  }

  function handleGenerateKeyResultFromLLM() {
    if (newObjective.length == 0) {
      toast('Please enter an Objective!', {
        position: 'top-center',
        type: 'error',
        autoClose: 3000,
      });
    } else {
      setIsNumberOfKeyResultModalOpen(true);
    }
  }

  function handleUpdateObjective() {
    setIsWaitingForResponse(true);

    const okrsToBeUpdated = {
      id: objectiveForUpdate.id,
      objective: newObjective,
      keyResults: keyResults.map((keyResult: KeyResultToBeInsertedType) => {
        return {
          ...keyResult,
          id: objectiveForUpdate.keyResults[0].id,
          objectiveId: objectiveForUpdate.keyResults[0].objectiveId,
        };
      }),
    };

    updateOkrsToDB(okrsToBeUpdated).then((data: OkrType) => {
      if (objectives === null) return;

      const updatedObjectives: OkrType[] = objectives.map((objective: OkrType) => {
        return objective.id === data.id ? okrsToBeUpdated : objective;
      });

      setObjectives([...updatedObjectives]);
      setNewObjective('');
      setKeyResults([defaultKeyResult]);

      //TODO: remove set timeout
      setTimeout(() => {
        setIsUpdateForm(false);
        setIsWaitingForResponse(false);
      }, 1000);
    });
  }

  function addNewKeyResults() {
    setKeyResults((prev: KeyResultToBeInsertedType[]) => [...prev, defaultKeyResult]);
  }

  function deleteKeyResultInputList(selectedInputListMapIndex: number) {
    const updatedKeyResultInputList: KeyResultToBeInsertedType[] = keyResults.filter(
      (_, index: number) => {
        return index !== selectedInputListMapIndex;
      }
    );

    setKeyResults(updatedKeyResultInputList);
  }

  return (
    <div
      id="addObjective"
      className="w-2/5 h-[90%] overflow-hidden flex flex-col space-y-2 rounded-md bg-gray-50 border-1 shadow"
    >
      <div className="relative top-0 bg-gray-50 space-y-8 px-8 py-4 z-10">
        <h1 className="font-medium text-lg mt-2 text-center">
          <span className="text-primary">Goal</span>Sync -{' '}
          <span className="text-secondary">OKR Application</span>
        </h1>

        <div id="objectForm" className="w-full">
          <Input
            label={'Objective'}
            type="text"
            placeholder="E.g.: Increase brand awareness"
            className="flex-grow"
            value={newObjective}
            onChange={e => {
              setNewObjective(e.target.value);
            }}
          />
        </div>
        {!isUpdateForm && (
          <>
            <Tooltip
              title="Generates key results from given objective using AI"
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
                <Sparkles className={`w-4 h-4 -rotate-45 ${isGenerating ? 'animate-ping' : ''}`} />
                Generate
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
          keyResults.map((keyResult, index) => (
            <div className="flex flex-col space-y-2" id="firstKeyResult" key={index}>
              <Input
                label={'Title'}
                type="text"
                placeholder="E.g.: Increase website traffic by 30%"
                className="flex-grow"
                value={keyResult.title}
                onChange={e => {
                  handleKeyResultChange('title', e.target.value, index);
                }}
              />
              <div
                className="flex justify-between flex-wrap gap-y-2 relative"
                id="firstKeyResultMetrics"
              >
                <Input
                  label={'Initial Value'}
                  type="number"
                  placeholder="Initial Value"
                  value={keyResult.initialValue}
                  onChange={e => {
                    handleKeyResultChange('initialValue', parseInt(e.target.value), index);
                  }}
                />
                <Input
                  label={'Current Value'}
                  type="number"
                  placeholder="Current Value"
                  value={keyResult.currentValue}
                  onChange={e => {
                    handleKeyResultChange('currentValue', parseInt(e.target.value), index);
                  }}
                />
                <Input
                  label={'Target Value'}
                  type="number"
                  placeholder="Target Value"
                  value={keyResult.targetValue}
                  onChange={e => {
                    handleKeyResultChange('targetValue', parseInt(e.target.value), index);
                  }}
                />
                <Input
                  label={'Metric'}
                  type="text"
                  placeholder="Number of visitors"
                  value={keyResult.metric}
                  onChange={e => {
                    handleKeyResultChange('metric', e.target.value, index);
                  }}
                />
                <button
                  className={`bg-white border border-red-500 text-red-500 hover:bg-red-500 hover:text-white absolute left-1/2 -translate-x-1/2 top-1/2 ${
                    keyResults.length == 1 ? 'hidden' : 'visible'
                  } -translate-y-1/2 shadow-lg hover:shadow-inner rounded-full p-2`}
                  onClick={() => deleteKeyResultInputList(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
      </div>

      <div className="w-full flex justify-between bg-gray-50 px-8 py-5" id="submitButton">
        {isUpdateForm ? (
          <button
            className="bg-secondary hover:bg-gray-800 ease-linear px-4 py-2 rounded-md text-white text-sm font-medium"
            onClick={handleCancelUpdateORKs}
          >
            Cancel
          </button>
        ) : (
          <button
            className="bg-secondary hover:bg-gray-800 ease-linear px-4 py-2 rounded-md text-white text-sm font-medium flex items-center gap-x-1"
            onClick={addNewKeyResults}
          >
            <BetweenHorizonalStart className="w-4 h-4" />
            Add Key Result
          </button>
        )}
        <button
          className="bg-primary hover:bg-gray-800 px-4 py-2 rounded-md text-white text-sm font-medium flex items-center"
          onClick={isUpdateForm ? handleUpdateObjective : addNewObjective}
        >
          {isWaitingForResponse && <LoaderCircle className="w-4 h-4 mr-1 animate-spin" />}{' '}
          {isUpdateForm ? (
            'Update Objective'
          ) : (
            <p className="flex items-center gap-x-1">
              <Goal className="w-4 h-4" />
              <span>Set Goal</span>
            </p>
          )}
        </button>
        {isNumberOfKeyResultModalOpen && (
          <NumberOfKeyResultsModal
            setKeyResults={setKeyResults}
            setIsGenerating={setIsGenerating}
            isGenerating={isGenerating}
            setIsGenerate={setIsNumberOfKeyResultModalOpen}
            newObjective={newObjective}
          />
        )}
      </div>
    </div>
  );
}
