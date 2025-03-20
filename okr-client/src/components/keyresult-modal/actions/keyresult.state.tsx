import { create } from 'zustand/react';

import { defaultKeyResult } from '../../../default/data.ts';
import { KeyResultModalType, KeyResultToBeInsertedType } from '../../../types/okr.types.ts';

interface useStateActionPropsType {
  keyResult: KeyResultToBeInsertedType;
  isKeyResultModalOpen: KeyResultModalType;

  openKeyResultModal: (objectiveIndex: number) => void;
  closeKeyResultModal: () => void;
  isKeyResultEmpty: () => boolean;
  // getCurrentOkr: () => OkrType | undefined;
  // addKeyResultsToOkrState: (currentOkr: OkrType, insertedKeyResult: KeyResultType[]) => void;
  handleInputOnChange: (key: string, value: string | number) => void;
}

// const { okrs, setOkrs } = useContext(OkrContext);
export const useStateAction = create<useStateActionPropsType>((set, get) => {
  return {
    keyResult: defaultKeyResult,
    isKeyResultModalOpen: {
      isOpen: false,
      objectiveIndex: -1,
    },

    openKeyResultModal: (objectiveIndex: number) => {
      set({
        isKeyResultModalOpen: {
          isOpen: true,
          objectiveIndex: objectiveIndex,
        },
      });
    },

    closeKeyResultModal: () => {
      set({
        isKeyResultModalOpen: {
          isOpen: false,
          objectiveIndex: -1,
        },
      });
    },

    isKeyResultEmpty: () => {
      const { keyResult } = get();
      return keyResult.title.trim().length === 0;
    },

    // getCurrentOkr: () => {
    //   const { isKeyResultModalOpen } = get();
    //   return okrs.find((_, idx: number) => idx === isKeyResultModalOpen.objectiveIndex);
    // },
    // addKeyResultsToOkrState: (currentOkr: OkrType, insertedKeyResult: KeyResultType[]) => {
    //   const { keyResult, isKeyResultModalOpen } = get();
    //   currentOkr.keyResults.push({
    //     ...keyResult,
    //     id: insertedKeyResult[0].id,
    //     objectiveId: insertedKeyResult[0].objectiveId,
    //   });
    //
    //   const okrsToBeUpdated: OkrType[] = okrs.map((objective: OkrType, idx: number) => {
    //     return idx === isKeyResultModalOpen.objectiveIndex ? currentOkr : objective;
    //   });
    //   setOkrs(okrsToBeUpdated);
    // },

    handleInputOnChange: (key: string, value: number | string) => {
      const { keyResult } = get();
      const keyResultInputToBeChanged: KeyResultToBeInsertedType = { ...keyResult, [key]: value };
      set({ keyResult: keyResultInputToBeChanged });
    },
  };
});
