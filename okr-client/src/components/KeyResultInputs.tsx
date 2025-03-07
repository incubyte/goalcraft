import { ChangeEvent } from 'react';

import { KeyResultToBeInsertedType } from '../types/okr.types.ts';
import Input from './Input.tsx';

interface KeyResultInputsPropsType {
  keyResult: KeyResultToBeInsertedType;
  handleInputOnChange: (key: string, value: number | string) => void;
}

export function KeyResultInputs({ keyResult, handleInputOnChange }: KeyResultInputsPropsType) {
  return (
    <div id="firstKeyResultMetrics" className="flex justify-between items-center flex-wrap gap-1">
      <Input
        label={'Title'}
        value={keyResult.title}
        className="flex-grow"
        type="text"
        placeholder="Increase brand awarness"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          handleInputOnChange('title', e.target.value);
        }}
      />
      <Input
        label={'Initial Value'}
        value={keyResult.initialValue}
        type="number"
        placeholder="Initial Value"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          handleInputOnChange('initialValue', parseInt(e.target.value));
        }}
      />
      <Input
        label={'Current Value'}
        value={keyResult.currentValue}
        type="number"
        placeholder="Current Value"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          handleInputOnChange('currentValue', parseInt(e.target.value));
        }}
      />
      <Input
        label={'Target Value'}
        value={keyResult.targetValue}
        type="number"
        placeholder="Target Value"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          handleInputOnChange('targetValue', parseInt(e.target.value));
        }}
      />
      <Input
        label={'Metric'}
        value={keyResult.metric}
        type="text"
        placeholder="%"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          handleInputOnChange('metric', e.target.value);
        }}
      />
    </div>
  );
}
