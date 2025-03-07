import { Trash2 } from 'lucide-react';
import { ChangeEvent } from 'react';

import { KeyResultToBeInsertedType } from '../types/okr.types.ts';
import Input from './Input.tsx';

interface KeyResultInputsPropsType {
  keyResult: KeyResultToBeInsertedType;
  keyResultInputIndex: number;
  handleInputOnChange: (key: string, value: number | string, index: number) => void;
  handleDeleteKeyResultInputsGroup?: (inputsGroupId: number) => void;
}

export function KeyResultInputs({
  keyResult,
  handleInputOnChange,
  keyResultInputIndex,
  handleDeleteKeyResultInputsGroup,
}: KeyResultInputsPropsType) {
  return (
    <div id="firstKeyResultMetrics" className="flex justify-between flex-wrap gap-1 relative">
      <Input
        label={'Title'}
        value={keyResult.title}
        className="flex-grow"
        type="text"
        placeholder="E.g.: Increase website traffic by 30%"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          handleInputOnChange('title', e.target.value, keyResultInputIndex);
        }}
      />
      <Input
        label={'Initial Value'}
        value={keyResult.initialValue}
        type="number"
        placeholder="Initial Value"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          handleInputOnChange('initialValue', parseInt(e.target.value), keyResultInputIndex);
        }}
      />
      <Input
        label={'Current Value'}
        value={keyResult.currentValue}
        type="number"
        placeholder="Current Value"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          handleInputOnChange('currentValue', parseInt(e.target.value), keyResultInputIndex);
        }}
      />
      <Input
        label={'Target Value'}
        value={keyResult.targetValue}
        type="number"
        placeholder="Target Value"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          handleInputOnChange('targetValue', parseInt(e.target.value), keyResultInputIndex);
        }}
      />
      <Input
        label={'Metric'}
        value={keyResult.metric}
        type="text"
        placeholder="%"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          handleInputOnChange('metric', e.target.value, keyResultInputIndex);
        }}
      />

      <button
        className={`bg-white border border-red-500 text-red-500 hover:bg-red-500 hover:text-white absolute left-1/2 -translate-x-1/2 top-1/2 ${
          !handleDeleteKeyResultInputsGroup ? 'hidden' : 'visible'
        } -translate-y-1/2 shadow-lg hover:shadow-inner rounded-full p-2`}
        onClick={() =>
          handleDeleteKeyResultInputsGroup && handleDeleteKeyResultInputsGroup(keyResultInputIndex)
        }
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
