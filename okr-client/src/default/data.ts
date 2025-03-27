const defaultOKR = {
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
};

const defaultKeyResult = {
  title: '',
  initialValue: 0,
  currentValue: 0,
  targetValue: 0,
  metric: '',
};

const defaultOkrFormState = {
  objective: '',
  keyResults: [defaultKeyResult],
  isFormForOkrToUpdate: false,
};

export { defaultKeyResult, defaultOKR, defaultOkrFormState };
