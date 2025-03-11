import {
  InsertKeyResultType,
  InsertObjectiveType,
  KeyResultType,
  ObjectiveType,
} from '../types/OKRTypes';

const HTTP_RESPONSE_STATUS = {
  NOT_FOUND: 404,
};

async function getOkrsFromDB(): Promise<ObjectiveType[]> {
  const response: Response = await fetch(`${import.meta.env.VITE_LOCAL_URL}/objectives`);
  return await response.json();
}

async function addObjectiveToDB(
  objective: Omit<InsertObjectiveType, 'keyResults'>
): Promise<ObjectiveType> {
  const response: Response = await fetch(`${import.meta.env.VITE_LOCAL_URL}/objectives`, {
    method: 'POST',
    body: JSON.stringify(objective),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}

async function updateOkrsToDB(objectiveTobeUpdated: ObjectiveType): Promise<ObjectiveType> {
  let response: Response;
  if (objectiveTobeUpdated.keyResults.length > 0) {
    response = await fetch(`${import.meta.env.VITE_LOCAL_URL}/objectives`, {
      method: 'PUT',
      body: JSON.stringify(objectiveTobeUpdated),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } else {
    response = await fetch(`${import.meta.env.VITE_LOCAL_URL}/objectives`, {
      method: 'PATCH',
      body: JSON.stringify({
        objective: objectiveTobeUpdated.objective,
        id: objectiveTobeUpdated.id,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  return await response.json();
}

async function deleteOkrsFromDB(okrId: string): Promise<ObjectiveType> {
  const response: Response = await fetch(`${import.meta.env.VITE_LOCAL_URL}/objectives`, {
    method: 'DELETE',
    body: JSON.stringify({ id: okrId }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.status === HTTP_RESPONSE_STATUS.NOT_FOUND) {
    throw new Error('Something Went Wrong');
  }
  return await response.json();
}

async function deleteKeyResultFromDB(keyResultId: string): Promise<
  KeyResultType & {
    id: string;
    objectiveId: string;
  }
> {
  const response: Response = await fetch(`${import.meta.env.VITE_LOCAL_URL}/key-results`, {
    method: 'DELETE',
    body: JSON.stringify({ id: keyResultId }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await response.json();
}

type ResponseKeyResultType = KeyResultType & { id: string; objectiveId: string };
async function addKeyResultsToDB(
  keyResults: InsertKeyResultType[],
  objectiveId: string
): Promise<ResponseKeyResultType[]> {
  const keyResultToBeInserted: InsertKeyResultType[] = keyResults.map(
    (keyResult: InsertKeyResultType) => {
      return { ...keyResult, objectiveId: objectiveId };
    }
  );

  const response: Response = await fetch(`${import.meta.env.VITE_LOCAL_URL}/key-results`, {
    method: 'POST',
    body: JSON.stringify(keyResultToBeInserted),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const keyResultsData = await response.json();
  return [...keyResultsData];
}

async function generateKeyResultFromLLM(
  objective: string,
  noOfKeyResultsWant: number
): Promise<KeyResultType[]> {
  const response = await fetch(
    `${import.meta.env.VITE_LOCAL_URL}/rag?objective=${objective}&noOfKeyResultsWant=${noOfKeyResultsWant}`
  );
  return await response.json();
}

async function saveCsvDataToDB(okrs: ObjectiveType[]): Promise<ObjectiveType[]> {
  if (okrs) {
    try {
      const createdOkrs = Promise.all(
        okrs.map(async (okr: ObjectiveType) => {
          const createdObjective = await addObjectiveToDB({ objective: okr.objective });
          const createdKeyResults = await addKeyResultsToDB(okr.keyResults, createdObjective.id);
          createdObjective.keyResults = createdKeyResults;
          return createdObjective;
        })
      );
      return createdOkrs;
    } catch (error) {
      throw new Error('Failed to create okrs in server');
    }
  } else {
    throw new Error('okrs are undefined');
  }
}

export {
  addKeyResultsToDB,
  addObjectiveToDB,
  deleteKeyResultFromDB,
  deleteOkrsFromDB,
  generateKeyResultFromLLM,
  getOkrsFromDB,
  saveCsvDataToDB,
  updateOkrsToDB,
};
