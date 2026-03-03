import { useState, useEffect } from 'react';
import { Todo } from '../types/todo';

const STORAGE_KEY = 'jarvis-todos';

function loadFromStorage(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(loadFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string, categoryId?: string, subCategoryId?: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTodos(prev => [
      {
        id: crypto.randomUUID(),
        text: trimmed,
        completed: false,
        createdAt: Date.now(),
        categoryId: categoryId || undefined,
        subCategoryId: subCategoryId || undefined,
      },
      ...prev,
    ]);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const editTodo = (id: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      deleteTodo(id);
      return;
    }
    setTodos(prev =>
      prev.map(todo => (todo.id === id ? { ...todo, text: trimmed } : todo))
    );
  };

  const clearCompleted = () => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  };

  /** Clear categoryId (and subCategoryId) from todos that belong to the given category */
  const unassignCategory = (categoryId: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.categoryId === categoryId
          ? { ...todo, categoryId: undefined, subCategoryId: undefined }
          : todo
      )
    );
  };

  /** Clear subCategoryId from todos that belong to the given sub-category */
  const unassignSubCategory = (subCategoryId: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.subCategoryId === subCategoryId
          ? { ...todo, subCategoryId: undefined }
          : todo
      )
    );
  };

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    unassignCategory,
    unassignSubCategory,
  };
}
