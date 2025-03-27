import { Context, createContext, Dispatch, ReactElement, SetStateAction, useState } from 'react';

import { defaultOKR } from '../../default/data.ts';
import { OkrType } from '../../types/okr.types.ts';

interface OkrContextType {
  okrs: OkrType[];
  setOkrs: Dispatch<SetStateAction<OkrType[]>>;
  isWaitingForResponse: boolean;
  setIsWaitingForResponse: Dispatch<SetStateAction<boolean>>;
  selectedOkrsToBeUpdated: OkrType;
  setSelectedOkrsToBeUpdated: Dispatch<SetStateAction<OkrType>>;
}

export const OkrContext: Context<OkrContextType> = createContext<OkrContextType>({
  okrs: [],
  setOkrs: () => {},
  isWaitingForResponse: false,
  setIsWaitingForResponse: () => {},
  selectedOkrsToBeUpdated: defaultOKR,
  setSelectedOkrsToBeUpdated: () => {},
});

const OkrProvider = ({ children }: { children: ReactElement }) => {
  const [okrs, setOkrs] = useState<OkrType[]>([]);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState<boolean>(false);
  const [selectedOkrsToBeUpdated, setSelectedOkrsToBeUpdated] = useState<OkrType>(defaultOKR);

  return (
    <OkrContext.Provider
      value={{
        okrs,
        setOkrs,
        isWaitingForResponse,
        setIsWaitingForResponse,
        selectedOkrsToBeUpdated,
        setSelectedOkrsToBeUpdated,
      }}
    >
      {children}
    </OkrContext.Provider>
  );
};

export default OkrProvider;
