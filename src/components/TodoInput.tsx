import React, { useState } from 'react';
import { Category } from '../types/todo';

interface TodoInputProps {
  onAdd: (text: string, categoryId?: string, subCategoryId?: string) => void;
  categories: Category[];
}

export function TodoInput({ onAdd, categories }: TodoInputProps) {
  const [value, setValue] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState('');

  const selectedCategory = categories.find(c => c.id === selectedCategoryId) ?? null;

  const handleSubmit = () => {
    onAdd(
      value,
      selectedCategoryId || undefined,
      selectedSubCategoryId || undefined
    );
    setValue('');
    // Keep the selected category/sub for convenience — user can clear manually
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategoryId(e.target.value);
    setSelectedSubCategoryId(''); // reset sub when category changes
  };

  return (
    <div className="border-b border-gray-100">
      {/* Main input row */}
      <div className="flex items-center gap-3 px-4 py-3">
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

      {/* Category selectors — only shown when categories exist */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 px-4 pb-3">
          <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>

          {/* Category dropdown */}
          <select
            value={selectedCategoryId}
            onChange={handleCategoryChange}
            className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-md px-2 py-1 outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-100 cursor-pointer"
          >
            <option value="">No category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Sub-category dropdown — only shown when a category with subs is selected */}
          {selectedCategory && selectedCategory.subCategories.length > 0 && (
            <>
              <span className="text-gray-300 text-xs">›</span>
              <select
                value={selectedSubCategoryId}
                onChange={e => setSelectedSubCategoryId(e.target.value)}
                className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-md px-2 py-1 outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-100 cursor-pointer"
              >
                <option value="">No sub-category</option>
                {selectedCategory.subCategories.map(sub => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
      )}
    </div>
  );
}
