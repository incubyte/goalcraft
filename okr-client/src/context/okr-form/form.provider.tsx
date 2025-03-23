import { createContext, ReactElement } from 'react';

import { defaultKeyResult, defaultOkrFormState } from '../../default/data.ts';
import useFormReducer from '../../hooks/useFormReducer.ts';
import { formContextType } from './types.ts';

export const formContext = createContext<formContextType>({
  okrForm: defaultOkrFormState,
  dispatch: () => {},
});

export const FormProvider = ({ children }: { children: ReactElement }) => {
  const [okrForm, dispatch] = useFormReducer(defaultKeyResult);

  return <formContext.Provider value={{ okrForm, dispatch }}>{children}</formContext.Provider>;
};
