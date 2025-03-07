import { useContext, useEffect, useState } from 'react';

import InitialLoader from './components/InitialLoader.tsx';
import OKRDisplay from './components/OKRDisplay';
import OKRForm from './components/OKRForm';
import { OkrContext } from './context/OkrProvider';
import { getOkrsFromDB } from './database/okr.store.ts';
import { ObjectiveType } from './types/OKRTypes';

function App() {
  const { setObjectives } = useContext(OkrContext);
  const [isLoadingInitData, setIsLoadingInitData] = useState<boolean>(true);

  const [objectiveForUpdate, setObjectiveForUpdate] = useState<ObjectiveType>({
    id: '',
    objective: '',
    keyResults: [
      {
        id: '',
        title: '',
        initialValue: 0,
        currentValue: 0,
        targetValue: 0,
        metric: '',
        objectiveId: '',
      },
    ],
  });

  useEffect(() => {
    void (async () => {
      const objectivesResponse: ObjectiveType[] = await getOkrsFromDB();
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
          <OKRForm
            objectiveForUpdate={objectiveForUpdate}
            setObjectiveForUpdate={setObjectiveForUpdate}
          />
          <OKRDisplay
            objectiveForUpdate={objectiveForUpdate}
            setObjectiveForUpdate={setObjectiveForUpdate}
          />
        </>
      )}
    </main>
  );
}

export default App;
