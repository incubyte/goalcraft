import { useContext, useEffect, useState } from 'react';
import InitialLoader from './components/InitialLoader.tsx';
import OKRDisplay from './components/OKRDisplay';
import OKRForm from './components/OKRForm';
import { OkrContext } from './context/okr.provider.tsx';
import { getOkrsFromDB } from './database/okr.store.ts';
import { OkrType } from './types/okr.types.ts';

function App() {
  const { setObjectives } = useContext(OkrContext);
  const [isLoadingInitData, setIsLoadingInitData] = useState<boolean>(true);
    
  useEffect(() => {
    void (async () => {
      const objectivesResponse: OkrType[] = await getOkrsFromDB();
      setTimeout(() => {
        setObjectives(objectivesResponse);
        setIsLoadingInitData(false);
      }, 3000);
    })();
  }, []);

  return (
    <main className="w-full bg-[url(https://www.toptal.com/designers/subtlepatterns/uploads/dot-grid.png)] bg-opacity-30 h-screen flex justify-around items-center space-y-4">
      {isLoadingInitData ? (
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
