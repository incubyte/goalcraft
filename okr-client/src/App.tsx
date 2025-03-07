import { useContext, useEffect, useState } from 'react';

import InitialLoader from './components/InitialLoader.tsx';
import OKRDisplay from './components/OKRDisplay';
import OKRForm from './components/OKRForm';
import { OkrContext } from './context/okr.provider.tsx';
import { getOkrsFromDB } from './database/okr.store.ts';
import { OkrType } from './types/okr.types.ts';

function App() {
  const { setOkrs } = useContext(OkrContext);
  const [isLoadingInitialData, setIsLoadingInitialData] = useState<boolean>(true);

  useEffect(() => {
    void (async () => {
      const objectivesResponse: OkrType[] = await getOkrsFromDB();
      setTimeout(() => {
        setOkrs(objectivesResponse);
        setIsLoadingInitialData(false);
      }, 3000);
    })();
  }, []);

  return (
    <main className="w-full bg-dot bg-opacity-30 h-screen flex justify-around items-center space-y-4">
      {isLoadingInitialData ? (
        <InitialLoader />
      ) : (
        <>
          <OKRForm />
          <OKRDisplay />
        </>
      )}
    </main>
  );
}

export default App;
