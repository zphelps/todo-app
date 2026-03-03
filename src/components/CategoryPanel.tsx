import React, { useState } from 'react';
import { Category } from '../types/todo';

export interface CategorySelection {
  categoryId: string | null;
  subCategoryId: string | null;
}

interface CategoryPanelProps {
  categories: Category[];
  selection: CategorySelection;
  onSelect: (sel: CategorySelection) => void;
  onAddCategory: (name: string) => void;
  onDeleteCategory: (categoryId: string) => void;
  onAddSubCategory: (categoryId: string, name: string) => void;
  onDeleteSubCategory: (categoryId: string, subCategoryId: string) => void;
}

export function CategoryPanel({
  categories,
  selection,
  onSelect,
  onAddCategory,
  onDeleteCategory,
  onAddSubCategory,
  onDeleteSubCategory,
}: CategoryPanelProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [addingSubFor, setAddingSubFor] = useState<string | null>(null);
  const [newSubName, setNewSubName] = useState('');

  const toggleExpand = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const handleSelectAll = () => onSelect({ categoryId: null, subCategoryId: null });

  const handleSelectCategory = (categoryId: string) => {
    onSelect({ categoryId, subCategoryId: null });
    if (!expandedCategories.has(categoryId)) {
      toggleExpand(categoryId);
    }
  };

  const handleSelectSubCategory = (categoryId: string, subCategoryId: string) => {
    onSelect({ categoryId, subCategoryId });
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName.trim());
      setNewCategoryName('');
    }
    setAddingCategory(false);
  };

  const handleCategoryKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAddCategory();
    if (e.key === 'Escape') {
      setAddingCategory(false);
      setNewCategoryName('');
    }
  };

  const handleAddSubCategory = (categoryId: string) => {
    if (newSubName.trim()) {
      onAddSubCategory(categoryId, newSubName.trim());
      setNewSubName('');
    }
    setAddingSubFor(null);
  };

  const handleSubKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, categoryId: string) => {
    if (e.key === 'Enter') handleAddSubCategory(categoryId);
    if (e.key === 'Escape') {
      setAddingSubFor(null);
      setNewSubName('');
    }
  };

  const isAllSelected = selection.categoryId === null;

  return (
    <div className="flex flex-col w-52 flex-shrink-0">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">
        Categories
      </h2>

      {/* All todos */}
      <button
        onClick={handleSelectAll}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 mb-1 ${
          isAllSelected
            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
        All Todos
      </button>

      {/* Category list */}
      <div className="flex-1 overflow-y-auto space-y-0.5">
        {categories.map(cat => {
          const isCatSelected = selection.categoryId === cat.id && selection.subCategoryId === null;
          const isExpanded = expandedCategories.has(cat.id);

          return (
            <div key={cat.id}>
              {/* Category row */}
              <div className="group flex items-center gap-1">
                {/* Expand toggle */}
                <button
                  onClick={() => toggleExpand(cat.id)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors flex-shrink-0 focus:outline-none"
                  aria-label={isExpanded ? 'Collapse' : 'Expand'}
                >
                  <svg
                    className={`w-3 h-3 transition-transform duration-150 ${isExpanded ? 'rotate-90' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Category name button */}
                <button
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`flex-1 text-left px-2 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 truncate ${
                    isCatSelected
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {cat.name}
                </button>

                {/* Actions: add sub + delete */}
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-0.5 flex-shrink-0">
                  <button
                    onClick={() => {
                      setAddingSubFor(cat.id);
                      if (!expandedCategories.has(cat.id)) toggleExpand(cat.id);
                    }}
                    className="p-1 text-gray-400 hover:text-indigo-500 rounded transition-colors focus:outline-none"
                    title="Add sub-category"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDeleteCategory(cat.id)}
                    className="p-1 text-gray-400 hover:text-red-400 rounded transition-colors focus:outline-none"
                    title="Delete category"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Sub-categories (expanded) */}
              {isExpanded && (
                <div className="ml-6 mt-0.5 space-y-0.5">
                  {cat.subCategories.map(sub => {
                    const isSubSelected =
                      selection.categoryId === cat.id && selection.subCategoryId === sub.id;
                    return (
                      <div key={sub.id} className="group flex items-center gap-1">
                        <button
                          onClick={() => handleSelectSubCategory(cat.id, sub.id)}
                          className={`flex-1 text-left px-2 py-1 rounded-lg text-xs font-medium transition-all duration-150 truncate ${
                            isSubSelected
                              ? 'bg-purple-50 text-purple-700'
                              : 'text-gray-500 hover:bg-gray-100'
                          }`}
                        >
                          {sub.name}
                        </button>
                        <button
                          onClick={() => onDeleteSubCategory(cat.id, sub.id)}
                          className="p-1 text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 rounded transition-all focus:outline-none flex-shrink-0"
                          title="Delete sub-category"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    );
                  })}

                  {/* Add sub-category inline input */}
                  {addingSubFor === cat.id ? (
                    <input
                      type="text"
                      autoFocus
                      value={newSubName}
                      onChange={e => setNewSubName(e.target.value)}
                      onKeyDown={e => handleSubKeyDown(e, cat.id)}
                      onBlur={() => handleAddSubCategory(cat.id)}
                      placeholder="Sub-category name…"
                      className="w-full text-xs px-2 py-1 border border-indigo-300 rounded-md outline-none ring-1 ring-indigo-100 bg-white text-gray-700 placeholder-gray-400"
                    />
                  ) : (
                    <button
                      onClick={() => {
                        setAddingSubFor(cat.id);
                      }}
                      className="text-xs text-gray-400 hover:text-indigo-500 px-2 py-1 w-full text-left transition-colors"
                    >
                      + Add sub-category
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Add category inline input */}
        {addingCategory ? (
          <div className="px-1 mt-1">
            <input
              type="text"
              autoFocus
              value={newCategoryName}
              onChange={e => setNewCategoryName(e.target.value)}
              onKeyDown={handleCategoryKeyDown}
              onBlur={handleAddCategory}
              placeholder="Category name…"
              className="w-full text-sm px-2 py-1.5 border border-indigo-300 rounded-lg outline-none ring-1 ring-indigo-100 bg-white text-gray-700 placeholder-gray-400"
            />
          </div>
        ) : (
          <button
            onClick={() => setAddingCategory(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-400 hover:text-indigo-600 transition-colors w-full mt-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add category
          </button>
        )}
      </div>
    </div>
  );
}
