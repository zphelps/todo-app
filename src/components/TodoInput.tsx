import React, { useState } from 'react';

interface TodoInputProps {
  onAdd: (text: string) => void;
}

export function TodoInput({ onAdd }: TodoInputProps) {
  const [value, setValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onAdd(value);
      setValue('');
    }
  };

  const handleSubmit = () => {
    onAdd(value);
    setValue('');
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
      <button
        onClick={handleSubmit}
        className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-indigo-400 flex-shrink-0 transition-colors duration-200 focus:outline-none focus:border-indigo-500"
        aria-label="Add todo"
      />
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="What needs to be done?"
        className="flex-1 text-gray-700 placeholder-gray-400 text-base bg-transparent outline-none py-1"
        autoFocus
      />
    </div>
  );
}
