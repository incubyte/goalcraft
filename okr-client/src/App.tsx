import { useContext, useEffect, useState } from 'react';
import { ObjectiveType } from './types/OKRTypes';
import OKRForm from './components/OKRForm';
import OKRDisplay from './components/OKRDisplay';
import { getOkrsData } from './database/OKRStore';
import { OkrContext } from './context/OkrProvider';
import InitialLoader from './components/InitialLoader.tsx';

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
    (async () => {
      const objectivesResponse = await getOkrsData();
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
