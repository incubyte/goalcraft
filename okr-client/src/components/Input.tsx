import { ChangeEvent } from 'react';

export default function Input({
  label,
  type,
  placeholder,
  onChange,
  className,
  value,
}: {
  label: string;
  type: 'text' | 'number';
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  value: string | number;
}) {
  return (
    <div className={`relative my-2 ${label === 'Objective' ? 'w-full' : ''}`}>
      <p className="bg-gray-50 absolute -top-2 px-3 rounded-full border border-gray-50 left-2 text-xs text-primary font-medium">
        {label}
      </p>
      <input
        value={value}
        min={0}
        type={type}
        className={`border ${label === 'Objective' || label === 'Title' ? 'w-full' : ''} focus:outline-none focus:outline-[#12a6a7] rounded-md px-4 py-2 ${className}`}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
}
