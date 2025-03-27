import { CircleX, PackagePlus, SquarePlus } from 'lucide-react';
import { useContext } from 'react';
import { ToastContainer } from 'react-toastify';

import { OkrContext } from '../../context/okr-data/okr.provider.tsx';
import { KeyResultInputsGroup } from '../ui/KeyResultInputsGroup.tsx';
import useQuery from './actions/keyresult.query.tsx';
import { useStateAction } from './actions/keyresult.state.tsx';

export default function KeyResultModal({ objectiveIndex }: { objectiveIndex: number }) {
  const { okrs } = useContext(OkrContext);

  const {
    handleInputOnChange,
    openKeyResultModal,
    closeKeyResultModal,
    isKeyResultModalOpen,
    keyResult,
  } = useStateAction();

  const { handleAddKeyResult } = useQuery();
  return (
    <>
      <button
        onClick={() => openKeyResultModal(objectiveIndex)}
        className="absolute -bottom-5 left-1/2 -translate-x-1/2 p-2 rounded-full border border-secondary hover:bg-white bg-secondary hover:text-[#91b30f] text-white shadow-md"
      >
        <SquarePlus className="w-4 h-4" />
      </button>
      {isKeyResultModalOpen.isOpen && (
        <div className="inset-0 fixed bg-gray-500 flex bg-opacity-50 justify-center items-center z-20">
          <div
            id="firstKeyResult"
            className="bg-white relative border-3 rounded-md p-10 w-2/5 flex flex-col space-y-2"
          >
            <div className="w-full flex justify-between mb-1">
              <h1 className="text-secondary font-medium mb-2">
                {okrs && okrs[isKeyResultModalOpen.objectiveIndex].objective}
              </h1>
              <button onClick={closeKeyResultModal} className="text-red-500">
                <CircleX className="w-5 h-5" />
              </button>
            </div>

            <KeyResultInputsGroup
              keyResult={keyResult}
              keyResultInputIndex={0}
              handleInputOnChange={handleInputOnChange}
            />

            <button
              onClick={() => handleAddKeyResult()}
              className="hover:bg-white h-full border hover:border-[#12a6a7] bg-primary text-white hover:text-[#12a6a7] p-3 px-4 rounded-md text-sm font-medium flex items-center justify-center gap-x-1.5 ease-in-out"
            >
              <PackagePlus className="w-4 h-4" />
              Add Key Result
            </button>
          </div>
          <ToastContainer />
        </div>
      )}
    </>
  );
}
