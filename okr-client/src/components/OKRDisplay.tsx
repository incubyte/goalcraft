import {
  CircleCheck,
  FilePenLine,
  Goal,
  LoaderCircle,
  Package,
  SquarePlus,
  Trash2,
} from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import NoGoalImage from '../assets/NoGoal.svg';
import { OkrContext } from '../context/okr.provider.tsx';
import { deleteKeyResultFromDB, deleteOkrsFromDB, getOkrsFromDB } from '../database/okr.store.ts';
import { KeyResultModalType, KeyResultType, OkrType } from '../types/okr.types.ts';
import KeyResultModal from './KeyResultModal.tsx';
import MetricsLabel from './MetricLabel';

enum PROGRESS_THRESHOLD {
  LOW = 0.33,
  HIGH = 0.66,
  OPTIMUM = 0.8,
}

export default function OKRDisplay() {
  const {
    okrs,
    setOkrs,
    isWaitingForResponse,
    selectedOkrsToBeUpdated,
    setSelectedOkrsToBeUpdated,
  } = useContext(OkrContext);

  const [keyResultModal, setKeyResultModal] = useState<KeyResultModalType>({
    isOpen: false,
    objectiveIndex: -1,
  });

  useEffect(() => {
    if (!keyResultModal.isOpen) {
      (async () => {
        const objectivesResponse: OkrType[] = await getOkrsFromDB();
        setOkrs(objectivesResponse);
      })();
    }
  }, [keyResultModal.isOpen]);

  function handleDeleteKeyResult(
    objectiveIdx: number,
    keyResultIdx: number,
    keyResultDBId: string
  ) {
    if (okrs === null) return;
    deleteKeyResultFromDB(keyResultDBId)
      .then(() => {
        const foundObj: OkrType | undefined = okrs.find((_, idx: number) => objectiveIdx === idx);

        if (foundObj === undefined) return;
        foundObj.keyResults = foundObj?.keyResults.filter(
          (_, krIdx: number) => krIdx !== keyResultIdx
        );

        const updatedObjectives: OkrType[] = okrs.map((objective: OkrType, idx: number) => {
          return idx === objectiveIdx ? foundObj : objective;
        });

        setOkrs(updatedObjectives);
      })
      .catch((error: Error) => {
        toast(`Something went wrong! ${error.message}`, {
          position: 'top-center',
          type: 'error',
          autoClose: 3000,
        });
      });
  }

  async function handleDeleteOkrs(objectiveIdx: string, index: number) {
    if (okrs === null) return;

    try {
      await deleteOkrsFromDB(objectiveIdx);
    } catch (error) {
      toast(`Something went wrong! ${error.toString()}`, {
        position: 'top-center',
        type: 'error',
        autoClose: 3000,
      });
    }
    const updatedObjectives: OkrType[] = okrs.filter((_, idx: number) => index !== idx);
    setOkrs(updatedObjectives);
  }

  function isAlreadyCompleted(init: number, current: number, target: number): boolean {
    return (
      (target != 0 && current === target && target === init) ||
      getCompletionPercentage(init, current, target) == 100
    );
  }

  function getCompletionPercentage(init: number, current: number, target: number): number {
    const percentage: number = ((current - init) / (target - init)) * 100;
    return parseFloat(percentage.toFixed(2));
  }

  function getProgressThreshold(target: number, threshold: number): number {
    return ((target * threshold) / target) * 100;
  }

  return (
    <div
      id="showObjectives"
      className="w-1/2 h-[90%] rounded-md p-10 bg-white border-1 shadow overflow-y-scroll flex flex-wrap justify-between gap-14"
    >
      {okrs != null && okrs.length > 0 ? (
        okrs.map((okr: OkrType, index: number) => {
          return (
            <div
              key={index}
              className="relative w-72 h-max border border-gray-200 rounded-md p-5 shadow group"
            >
              {okr.id === selectedOkrsToBeUpdated.id && isWaitingForResponse && (
                <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center bg-white z-10 bg-opacity-80 border-gray-200">
                  <LoaderCircle className="w-10 h-10 mr-1 animate-spin" />
                </div>
              )}
              <div className="flex items-center justify-between mb-3">
                <h1 className="font-bold text-center text-base w-full truncate mb-2">
                  {okr.objective}
                </h1>
                <div className="items-center gap-x-3 z-10 -mt-2 hidden group-hover:flex absolute -top-3 bg-white p-2 shadow px-5 border rounded-full left-1/2 -translate-x-1/2">
                  <button onClick={() => handleDeleteOkrs(okr.id, index)} className="text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setSelectedOkrsToBeUpdated({ ...okr })}>
                    <FilePenLine className="w-4 h-4 text-primary" />
                  </button>
                </div>
              </div>

              {okr.keyResults && okr.keyResults.length > 0 ? (
                okr.keyResults.map((keyResult: KeyResultType, index: number) => (
                  <div
                    key={index}
                    className={`relative pt-2 p-3 ${
                      isAlreadyCompleted(
                        keyResult.initialValue,
                        keyResult.currentValue,
                        keyResult.targetValue
                      ) && index == 0
                        ? 'mt-4'
                        : isAlreadyCompleted(
                              keyResult.initialValue,
                              keyResult.currentValue,
                              keyResult.targetValue
                            )
                          ? 'mt-8'
                          : 'mt-3'
                    } bg-gray-100 rounded-md shadow`}
                  >
                    {isAlreadyCompleted(
                      keyResult.initialValue,
                      keyResult.currentValue,
                      keyResult.targetValue
                    ) && (
                      <p className="absolute -top-3 left-5 flex items-center gap-x-1 text-xs bg-gray-600 font-medium text-white rounded-full px-2 py-1">
                        <CircleCheck className="w-3.5 h-3.5" /> Done
                      </p>
                    )}
                    <button
                      onClick={() => handleDeleteKeyResult(index, index, keyResult.id)}
                      className="border bg-red-500 text-white hover:text-red-500 hover:bg-white hover:border-red-500 absolute top-1/2 -translate-y-1/2 -right-10 shadow-lg hover:shadow-inner rounded-full p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div
                      className={`mb-3 bg-white ${
                        isAlreadyCompleted(
                          keyResult.initialValue,
                          keyResult.currentValue,
                          keyResult.targetValue
                        )
                          ? 'mt-3'
                          : 'mt-1'
                      } rounded-md flex items-center justify-between shadow-sm`}
                    >
                      <Goal className="w-4 h-4 text-gray-700 ml-3 " />
                      <p className={`text-primary text-xs w-full p-2 font-medium rounded-md`}>
                        {keyResult.title}
                      </p>
                    </div>
                    <MetricsLabel label={'Metric'} value={keyResult.metric} />
                    <div className="w-full flex items-center justify-between mt-3">
                      <StatisticsCard label={'Initial'} value={keyResult.initialValue} />
                      <StatisticsCard label={'Current'} value={keyResult.currentValue} />
                      <StatisticsCard label={'Target'} value={keyResult.targetValue} />
                    </div>
                    <meter
                      className="w-full rounded-full mt-2"
                      min={0}
                      max={100}
                      optimum={getProgressThreshold(
                        keyResult.targetValue,
                        PROGRESS_THRESHOLD.OPTIMUM
                      )}
                      low={getProgressThreshold(keyResult.targetValue, PROGRESS_THRESHOLD.LOW)}
                      high={getProgressThreshold(keyResult.targetValue, PROGRESS_THRESHOLD.HIGH)}
                      value={getCompletionPercentage(
                        keyResult.initialValue,
                        keyResult.currentValue,
                        keyResult.targetValue
                      )}
                    ></meter>

                    <div className="flex w-full font-medium items-center justify-between">
                      <p className="text-xs">
                        {keyResult.currentValue} of{' '}
                        <span className="text-gray-500">{keyResult.targetValue} (Progress)</span>
                      </p>
                      <p className="text-xs text-primary">
                        {getCompletionPercentage(
                          keyResult.initialValue,
                          keyResult.currentValue,
                          keyResult.targetValue
                        )}{' '}
                        %
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm font-medium text-gray-600 my-5 flex flex-col items-center justify-center">
                  <Package className="w-5 h-5 mr-1" />
                  No Key-Results Defined.
                </p>
              )}

              <button
                onClick={() =>
                  setKeyResultModal({
                    isOpen: true,
                    objectiveIndex: index,
                  })
                }
                className="absolute -bottom-5 left-1/2 -translate-x-1/2 p-2 rounded-full border border-secondary hover:bg-white bg-secondary hover:text-[#91b30f] text-white shadow-md"
              >
                <SquarePlus className="w-4 h-4" />
              </button>
            </div>
          );
        })
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <img src={NoGoalImage} alt="No Goal" width={300} />
          <p className="mt-6 font-medium text-gray-700">
            Ready to <span className="text-primary">level up?</span> Set your first goal.
          </p>
        </div>
      )}
      {keyResultModal.isOpen && (
        <KeyResultModal
          keyResultModal={keyResultModal}
          closeModal={() => setKeyResultModal({ isOpen: false, objectiveIndex: -1 })}
        />
      )}
    </div>
  );
}

const StatisticsCard = ({ label, value }: { label: string; value: number | string }) => {
  return (
    <div className="flex flex-col bg-white shadow-sm w-[60px] items-center justify-center text-xs font-medium p-2 rounded-md">
      <p className="text-secondary mb-1">{label}</p>
      <p>{value}</p>
    </div>
  );
};
