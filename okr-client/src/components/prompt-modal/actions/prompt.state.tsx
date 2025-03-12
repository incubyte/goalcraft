import { create } from 'zustand/react';

import Toast from '../../ui/Toast.tsx';

interface promptStateActionType {
  isNumberOfKeyResultModalOpen: boolean;
  numberOfKeyResults: number;
  isGeneratingKeyResult: boolean;

  startActionLoading: () => void;
  stopActionLoading: () => void;
  openPromptModal: (isObjectiveEmpty: () => boolean) => void;
  closePromptModal: () => void;
  handleNoOfKeyResultsInputOnChange: (noOfKeyResult: number) => void;
}

export const useStateAction = create<promptStateActionType>(set => {
  const { failureToast } = Toast();
  return {
    isNumberOfKeyResultModalOpen: false,
    numberOfKeyResults: 2,
    isGeneratingKeyResult: false,

    startActionLoading: () => {
      set({ isGeneratingKeyResult: true });
    },

    stopActionLoading: () => {
      set({ isGeneratingKeyResult: false });
    },

    openPromptModal: (isObjectiveEmpty: () => boolean) => {
      if (isObjectiveEmpty()) {
        failureToast('Please enter an objective!');
      } else {
        set({ isNumberOfKeyResultModalOpen: true });
      }
    },

    closePromptModal: () => {
      set({ isNumberOfKeyResultModalOpen: false });
    },

    handleNoOfKeyResultsInputOnChange: (noOfKeyResult: number) => {
      set({ numberOfKeyResults: noOfKeyResult });
    },
  };
});
