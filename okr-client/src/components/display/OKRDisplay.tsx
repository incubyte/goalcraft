import {
  ArrowRight,
  CircleCheck,
  FilePenLine,
  Goal,
  LoaderCircle,
  Package,
  Trash2,
} from 'lucide-react';
import { useContext } from 'react';
import { ToastContainer } from 'react-toastify';

import NoGoalImage from '../../assets/NoGoal.svg';
import { OkrContext } from '../../context/okr-data/okr.provider.tsx';
import { KeyResultType, OkrType } from '../../types/okr.types.ts';
import KeyResultModal from '../keyresult-modal/KeyResultModal.tsx';
import useQuery from './actions/okr.query.tsx';
import MetricsLabel from './components/MetricLabel.tsx';

export default function OKRDisplay() {
  const { okrs, isWaitingForResponse, selectedOkrsToBeUpdated, setSelectedOkrsToBeUpdated } =
    useContext(OkrContext);
  const { handleDeleteOkrs } = useQuery();

  return (
    <div
      id="showObjectives"
      className="w-1/2 h-[90%] rounded-md p-10 bg-white border-1 shadow overflow-y-scroll flex flex-wrap justify-between gap-14"
    >
      {okrs.length == 0 ? (
        <EmptyGoalSetup />
      ) : (
        okrs.map((okr: OkrType, objectiveIndex: number) => {
          return (
            <div
              key={objectiveIndex}
              className="relative w-72 h-max border border-gray-200 rounded-md p-5 shadow group"
            >
              {okr.id === selectedOkrsToBeUpdated.id && isWaitingForResponse && <LoaderOKRCard />}
              <div className="flex items-center justify-between mb-3">
                <h1 className="font-bold text-center text-base w-full truncate mb-2">
                  {okr.objective}
                </h1>
                <div className="items-center gap-x-3 z-10 -mt-2 hidden group-hover:flex absolute -top-3 bg-white p-2 shadow px-5 border rounded-full left-1/2 -translate-x-1/2">
                  <button
                    onClick={() => handleDeleteOkrs(okr.id, objectiveIndex)}
                    className="text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setSelectedOkrsToBeUpdated({ ...okr })}>
                    <FilePenLine className="w-4 h-4 text-primary" />
                  </button>
                </div>
              </div>

              {okr.keyResults.length > 0 ? (
                okr.keyResults.map((keyResult: KeyResultType, keyResultIndex: number) => (
                  <KeyResultCard
                    key={keyResultIndex}
                    keyResultIndex={keyResultIndex}
                    objectiveIndex={objectiveIndex}
                    keyResult={keyResult}
                  />
                ))
              ) : (
                <p className="text-sm font-medium text-gray-600 my-5 flex flex-col items-center justify-center">
                  <Package className="w-5 h-5 mr-1" />
                  No Key-Results Defined.
                </p>
              )}
              <KeyResultModal objectiveIndex={objectiveIndex} />
            </div>
          );
        })
      )}
    </div>
  );
}

const KeyResultCard = ({
  keyResult,
  keyResultIndex,
  objectiveIndex,
}: {
  keyResult: KeyResultType;
  keyResultIndex: number;
  objectiveIndex: number;
}) => {
  const { handleDeleteKeyResult } = useQuery();

  const isCompletedTarget: boolean =
    getCompletionPercentage(
      keyResult.initialValue,
      keyResult.currentValue,
      keyResult.targetValue
    ) == 100;

  return (
    <div
      key={keyResultIndex}
      className={`relative pt-2 p-3 ${isCompletedTarget ? (keyResultIndex != 0 ? 'mt-8' : 'mt-3') : 'mt-3'} bg-gray-100 rounded-md shadow`}
    >
      {isCompletedTarget && <DoneBadge />}
      <button
        onClick={() => handleDeleteKeyResult(objectiveIndex, keyResultIndex, keyResult.id)}
        className="border bg-red-500 text-white hover:text-red-500 hover:bg-white hover:border-red-500 absolute top-1/2 -translate-y-1/2 -right-10 shadow-lg hover:shadow-inner rounded-full p-2"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <div
        className={`mb-3 bg-white ${isCompletedTarget ? 'mt-3' : 'mt-1'} rounded-md flex items-center justify-between shadow-sm`}
      >
        <Goal className="w-4 h-4 text-gray-700 ml-3 " />
        <p className={`text-primary text-xs w-full p-2 font-medium rounded-md`}>
          {keyResult.title}
        </p>
      </div>

      <MetricsLabel label={'Metric'} value={keyResult.metric} />

      <MetricStatsGroup
        initial={keyResult.initialValue}
        current={keyResult.currentValue}
        target={keyResult.targetValue}
      />

      <KeyResultProgress
        initial={keyResult.initialValue}
        current={keyResult.currentValue}
        target={keyResult.targetValue}
      />
      <ToastContainer />
    </div>
  );
};

const MetricStatsGroup = ({
  initial,
  current,
  target,
}: {
  initial: number;
  current: number;
  target: number;
}) => {
  return (
    <div className="w-full flex items-center justify-between mt-3">
      <StatisticsCard label={'Initial'} value={initial} />
      <StatisticsCard label={'Current'} value={current} />
      <StatisticsCard label={'Target'} value={target} />
    </div>
  );
};

function isAlreadyCompleted(init: number, current: number, target: number): boolean {
  return current === target && target === init;
}

function getCompletionPercentage(init: number, current: number, target: number): number {
  if (isAlreadyCompleted(init, current, target)) return 100;
  const percentage: number = ((current - init) / (target - init)) * 100;
  const absolutePercentage: number = Math.abs(percentage);
  return parseFloat(absolutePercentage.toFixed(2));
}

enum PROGRESS_THRESHOLD {
  LOW = 0.33,
  HIGH = 0.66,
  OPTIMUM = 0.8,
}

function getProgressThreshold(target: number, threshold: number): number {
  return ((target * threshold) / target) * 100;
}

const KeyResultProgress = ({
  initial,
  current,
  target,
}: {
  initial: number;
  current: number;
  target: number;
}) => {
  return (
    <>
      <meter
        className="w-full rounded-full mt-2"
        min={0}
        max={100}
        optimum={getProgressThreshold(target, PROGRESS_THRESHOLD.OPTIMUM)}
        low={getProgressThreshold(target, PROGRESS_THRESHOLD.LOW)}
        high={getProgressThreshold(target, PROGRESS_THRESHOLD.HIGH)}
        value={getCompletionPercentage(initial, current, target)}
      ></meter>

      <div className="flex w-full font-medium items-center justify-between">
        <p className="text-xs flex items-center">
          {initial} <ArrowRight className="w-3 mx-1 h-3" />
          <span className="text-gray-500">{target} (Progress)</span>
        </p>
        <p className="text-xs text-primary">
          {getCompletionPercentage(initial, current, target)} %
        </p>
      </div>
    </>
  );
};

const EmptyGoalSetup = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <img src={NoGoalImage} alt="No Goal" width={300} />
      <p className="mt-6 font-medium text-gray-700">
        Ready to <span className="text-primary">level up?</span> Set your first goal.
      </p>
    </div>
  );
};

const LoaderOKRCard = () => {
  return (
    <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center bg-white z-10 bg-opacity-80 border-gray-200">
      <LoaderCircle className="w-10 h-10 mr-1 animate-spin" />
    </div>
  );
};

const DoneBadge = () => {
  return (
    <p className="absolute -top-3 left-5 flex items-center gap-x-1 text-xs bg-gray-600 font-medium text-white rounded-full px-2 py-1">
      <CircleCheck className="w-3.5 h-3.5" /> Done
    </p>
  );
};

const StatisticsCard = ({ label, value }: { label: string; value: number | string }) => {
  return (
    <div className="flex flex-col bg-white shadow-sm w-[60px] items-center justify-center text-xs font-medium p-2 rounded-md">
      <p className="text-secondary mb-1">{label}</p>
      <p>{value}</p>
    </div>
  );
};
