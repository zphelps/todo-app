import { useState, useEffect } from 'react';
import { Category } from '../types/todo';

const STORAGE_KEY = 'jarvis-todo-categories';

function loadFromStorage(): Category[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(loadFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  }, [categories]);

  const addCategory = (name: string): string => {
    const trimmed = name.trim();
    if (!trimmed) return '';
    const id = crypto.randomUUID();
    setCategories(prev => [
      ...prev,
      { id, name: trimmed, subCategories: [] },
    ]);
    return id;
  };

  /** Deletes a category and returns { categoryId, subCategoryIds } for cleanup */
  const deleteCategory = (categoryId: string): { categoryId: string; subCategoryIds: string[] } => {
    let subCategoryIds: string[] = [];
    setCategories(prev => {
      const cat = prev.find(c => c.id === categoryId);
      subCategoryIds = cat ? cat.subCategories.map(sc => sc.id) : [];
      return prev.filter(c => c.id !== categoryId);
    });
    return { categoryId, subCategoryIds };
  };

  const addSubCategory = (categoryId: string, name: string): string => {
    const trimmed = name.trim();
    if (!trimmed) return '';
    const id = crypto.randomUUID();
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? { ...cat, subCategories: [...cat.subCategories, { id, name: trimmed }] }
          : cat
      )
    );
    return id;
  };

  /** Deletes a sub-category and returns its id for cleanup */
  const deleteSubCategory = (categoryId: string, subCategoryId: string): string => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? { ...cat, subCategories: cat.subCategories.filter(sc => sc.id !== subCategoryId) }
          : cat
      )
    );
    return subCategoryId;
  };

  return {
    categories,
    addCategory,
    deleteCategory,
    addSubCategory,
    deleteSubCategory,
  };
}
