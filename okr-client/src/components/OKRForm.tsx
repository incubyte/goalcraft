import { useContext, useEffect, useState } from 'react';
import Input from './Input';
import { KeyResultType, ObjectiveType } from '../types/OKRTypes';
import {
  addKeyResultToObjective,
  addOkrsDataToDB,
  generateKeyResultFromLLM,
  getOkrsData,
  updateOkrsDataToDb,
} from '../database/OKRStore';
import {
  BetweenHorizonalStart,
  Goal,
  LoaderCircle,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { OkrContext } from '../context/OkrProvider';
import { toast } from 'react-toastify';
import { PrimeReactProvider } from 'primereact/api';
import { confirmDialog } from 'primereact/confirmdialog';
import { Button } from 'primereact/button';

const defaultKeyResults = {
  title: '',
  initialValue: 0,
  currentValue: 0,
  targetValue: 0,
  metric: '',
};

export default function OKRForm({
  objectiveForUpdate,
  setObjectiveForUpdate,
}: {
  objectiveForUpdate: ObjectiveType;
  setObjectiveForUpdate: React.Dispatch<React.SetStateAction<ObjectiveType>>;
}) {
  const {
    objectives,
    setObjectives,
    isWaitingForResponse,
    setIsWaitingForResponse,
  } = useContext(OkrContext);
  const [isUpdateForm, setIsUpdateForm] = useState<boolean>(false);
  const [newObjective, setNewObjective] = useState<string>('');
  const [keyResults, setKeyResults] = useState<KeyResultType[]>([
    defaultKeyResults,
  ]);

  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  function handleCancelUpdateORKs() {
    setObjectiveForUpdate({
      id: '',
      objective: '',
      keyResults: [
        {
          id: '',
          title: '',
          initialValue: 0,
          currentValue: 0,
          targetValue: 0,
          metric: '',
          objectiveId: '',
        },
      ],
    });
    setKeyResults([defaultKeyResults]);
    setNewObjective('');
    setIsUpdateForm(false);
    (async () => {
      const objectivesResponse = await getOkrsData();
      setObjectives(objectivesResponse);
    })();
  }

  useEffect(() => {
    if (objectiveForUpdate.id != '') {
      console.warn(objectives, keyResults, objectiveForUpdate);
      setNewObjective(objectiveForUpdate.objective);
      setKeyResults(objectiveForUpdate.keyResults);
      setIsUpdateForm(true);
    }
  }, [objectiveForUpdate]);

  function handleChange(key: string, value: string | number, index: number) {
    console.warn(objectives, value, keyResults);

    setKeyResults((prev) => {
      const keyResultToBeUpdated = { ...prev[index] };
      prev[index] = { ...keyResultToBeUpdated, [key]: value };
      return [...prev];
    });
  }

  function addNewObjective() {
    // validation
    if (newObjective.length == 0 || keyResults.length == 0) {
      toast('Please fill all required field value', {
        position: 'top-center',
        type: 'error',
        autoClose: 3000,
      });
      return;
    }

    // set loader true
    setIsWaitingForResponse(true);
    const objectiveToBeAdded = { objective: newObjective };

    // inserting objective into db.
    addOkrsDataToDB(objectiveToBeAdded)
      .then((objectiveResponse: ObjectiveType) => {
        if (objectives === null) return;
        console.log(keyResults);
        if (keyResults[0].title != '') {
          addKeyResultToObjective(keyResults, objectiveResponse.id).then(
            (keyResultsResponse) => {
              const objectiveToBeAddedToState = {
                ...objectiveResponse,
                keyResults: keyResultsResponse,
              };
              console.warn(objectiveToBeAddedToState);

              setObjectives([...objectives, objectiveToBeAddedToState]);
            }
          );
        } else {
          setObjectives([...objectives, objectiveResponse]);
        }

        setKeyResults([defaultKeyResults]);
        setNewObjective('');
        setIsWaitingForResponse(false);
      })
      .catch((error) => {
        alert(error);
      });
  }

  function handleGenerateKeyResultFromLLM() {
    if (newObjective.length == 0) {
      toast('Please fill all required field value', {
        position: 'top-center',
        type: 'error',
        autoClose: 3000,
      });
    } else {
      setIsGenerating(true);
      generateKeyResultFromLLM(newObjective, keyResults.length)
        .then((generatedKeyResults: KeyResultType[]) => {
          setKeyResults(generatedKeyResults);
          setIsGenerating(false);
        })
        .catch((error) => {
          alert(error);
          setIsGenerating(false);
        });
    }
  }

  const accept = () => {
    handleUpdateObjective();
    toast('Update objective successfully!', {
      position: 'top-center',
      type: 'success',
      autoClose: 3000,
    });
  };

  const reject = () => {
    toast('Failed to update objective!', {
      position: 'top-center',
      type: 'error',
      autoClose: 3000,
    });
  };

  function confirmUpdateObjective() {
    confirmDialog({
      message: 'Are you sure you want to update the objective?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      accept,
      reject,
    });
  }

  function handleUpdateObjective() {
    setIsWaitingForResponse(true);

    const okrsToBeUpdated = {
      id: objectiveForUpdate.id,
      objective: newObjective,
      keyResults: keyResults.map((keyResult) => {
        return {
          ...keyResult,
          id: objectiveForUpdate.keyResults[0].id,
          objectiveId: objectiveForUpdate.keyResults[0].objectiveId,
        };
      }),
    };

    updateOkrsDataToDb(okrsToBeUpdated).then((data) => {
      if (objectives === null) return;
      const updatedObjectives = objectives.map((objective) => {
        return objective.id === data.id ? okrsToBeUpdated : objective;
      });

      setObjectives([...updatedObjectives]);

      // Reset
      setNewObjective('');
      setKeyResults([defaultKeyResults]);
      setTimeout(() => {
        setIsUpdateForm(false);
        setIsWaitingForResponse(false);
      }, 1000);
    });
  }

  function addNewKeyResults() {
    setKeyResults((prev) => [...prev, defaultKeyResults]);
  }

  function deleteKeyResultInputList(selectedInptListMapIndex: number) {
    const updatedKeyResultInptList = keyResults.filter((_m, index) => {
      return index !== selectedInptListMapIndex;
    });

    setKeyResults(updatedKeyResultInptList);
  }

  return (
    <>
      <PrimeReactProvider>
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
                onChange={(e) => {
                  setNewObjective(e.target.value);
                }}
              />
            </div>
            {!isUpdateForm && (
              <>
                <button
                  onClick={() => handleGenerateKeyResultFromLLM()}
                  className="bg-white absolute left-1/2 -translate-x-1/2 z-10 -bottom-7 border-2 border-[#12a6a7] hover:border-gray-700 hover:bg-gray-700 hover:text-white text-primary ease-linear flex items-center gap-x-1.5 px-4 py-2 rounded-md text-sm font-medium shadow-md"
                >
                  <Sparkles
                    className={`w-4 h-4 -rotate-45 ${isGenerating ? 'animate-ping' : ''}`}
                  />{' '}
                  Generate
                </button>
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
                <div
                  key={index}
                  id="firstKeyResult"
                  className="flex flex-col space-y-2"
                >
                  <Input
                    label={'Title'}
                    className="flex-grow"
                    value={keyResult.title}
                    type="text"
                    placeholder="E.g.: Increase website traffic by 30%"
                    onChange={(e) => {
                      handleChange('title', e.target.value, index);
                    }}
                  />
                  <div
                    id="firstKeyResultMetrics"
                    className="flex justify-between flex-wrap gap-y-2 relative"
                  >
                    <Input
                      label={'Initial Value'}
                      value={keyResult.initialValue}
                      type="number"
                      placeholder="Initial Value"
                      onChange={(e) => {
                        handleChange(
                          'initialValue',
                          parseInt(e.target.value),
                          index
                        );
                      }}
                    />
                    <Input
                      label={'Current Value'}
                      type="number"
                      value={keyResult.currentValue}
                      placeholder="Current Value"
                      onChange={(e) => {
                        handleChange(
                          'currentValue',
                          parseInt(e.target.value),
                          index
                        );
                      }}
                    />
                    <Input
                      label={'Target Value'}
                      type="number"
                      value={keyResult.targetValue}
                      placeholder="Target Value"
                      onChange={(e) => {
                        handleChange(
                          'targetValue',
                          parseInt(e.target.value),
                          index
                        );
                      }}
                    />
                    <Input
                      label={'Metric'}
                      type="text"
                      value={keyResult.metric}
                      placeholder="Number of visitors"
                      onChange={(e) => {
                        handleChange('metric', e.target.value, index);
                      }}
                    />
                    <button
                      onClick={() => deleteKeyResultInputList(index)}
                      className={`bg-white border border-red-500 text-red-500 hover:bg-red-500 hover:text-white absolute left-1/2 -translate-x-1/2 top-1/2 ${keyResults.length == 1 ? 'hidden' : 'visible'} -translate-y-1/2 shadow-lg hover:shadow-inner rounded-full p-2`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>

          <div
            id="submitButton"
            className="w-full flex justify-between bg-gray-50 px-8 py-5"
          >
            {isUpdateForm ? (
              <button
                className="bg-secondary hover:bg-gray-800 ease-linear px-4 py-2 rounded-md text-white text-sm font-medium"
                onClick={handleCancelUpdateORKs}
              >
                Cancel
              </button>
            ) : (
              <button
                onClick={addNewKeyResults}
                className="bg-secondary hover:bg-gray-800 ease-linear px-4 py-2 rounded-md text-white text-sm font-medium flex items-center gap-x-1"
              >
                <BetweenHorizonalStart className="w-4 h-4" />
                Add Key Result
              </button>
            )}
            <Button
              onClick={isUpdateForm ? confirmUpdateObjective : addNewObjective}
              className="bg-primary hover:bg-gray-800 px-4 py-2 rounded-md text-white text-sm font-medium flex items-center"
            >
              {isWaitingForResponse && (
                <LoaderCircle className="w-4 h-4 mr-1 animate-spin" />
              )}{' '}
              {isUpdateForm ? (
                'Update Objective'
              ) : (
                <p className="flex items-center gap-x-1">
                  <Goal className="w-4 h-4" />
                  <span>Set Goal</span>
                </p>
              )}
            </Button>
          </div>
        </div>
      </PrimeReactProvider>
    </>
  );
}
