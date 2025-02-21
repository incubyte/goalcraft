import { createContext, ReactElement, useState } from 'react';
import { ObjectiveType } from '../types/OKRTypes';

type OkrContextType = {
  objectives: ObjectiveType[] | null;
  setObjectives: React.Dispatch<React.SetStateAction<ObjectiveType[] | null>>;
  isWaitingForResponse: boolean;
  setIsWaitingForResponse: React.Dispatch<React.SetStateAction<boolean>>;
};

export const OkrContext = createContext<OkrContextType>({
  objectives: [],
  setObjectives: () => {},
  isWaitingForResponse: false,
  setIsWaitingForResponse: () => {},
});

const OkrProvider = ({ children }: { children: ReactElement }) => {
  const [objectives, setObjectives] = useState<ObjectiveType[] | null>([]);
  const [isWaitingForResponse, setIsWaitingForResponse] =
    useState<boolean>(false);

  return (
    <OkrContext.Provider
      value={{
        objectives,
        setObjectives,
        isWaitingForResponse,
        setIsWaitingForResponse,
      }}
    >
      {children}
    </OkrContext.Provider>
  );
};

export default OkrProvider;
