import {
  KeyResultToBeInsertedType,
  OkrToBeInsertedType,
  KeyResultType,
  OkrType,
} from '../types/okr.types.ts';

const HTTP_RESPONSE_STATUS = {
  NOT_FOUND: 404,
};

async function getOkrsFromDB(): Promise<OkrType[]> {
  const response: Response = await fetch(`${import.meta.env.VITE_LOCAL_URL}/objectives`);
  return await response.json();
}

async function addObjectiveToDB(
  objective: Omit<OkrToBeInsertedType, 'keyResults'>
): Promise<OkrType> {
  const response: Response = await fetch(`${import.meta.env.VITE_LOCAL_URL}/objectives`, {
    method: 'POST',
    body: JSON.stringify(objective),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}

async function updateOkrsToDB(objectiveTobeUpdated: OkrType): Promise<OkrType> {
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

async function deleteOkrsFromDB(okrId: string): Promise<OkrType> {
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

async function deleteKeyResultFromDB(keyResultId: string): Promise<KeyResultType> {
  const response: Response = await fetch(`${import.meta.env.VITE_LOCAL_URL}/key-results`, {
    method: 'DELETE',
    body: JSON.stringify({ id: keyResultId }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await response.json();
}

async function addKeyResultsToDB(
  keyResult: KeyResultToBeInsertedType[],
  objectiveId: string
): Promise<KeyResultType[]> {
  const keyResultToBeInserted: KeyResultToBeInsertedType[] = keyResult.map(
    (keyResult: KeyResultToBeInsertedType) => {
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

export {
  addKeyResultsToDB,
  addObjectiveToDB,
  deleteKeyResultFromDB,
  deleteOkrsFromDB,
  generateKeyResultFromLLM,
  getOkrsFromDB,
  updateOkrsToDB,
};
