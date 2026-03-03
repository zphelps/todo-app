import { useState } from 'react';
import { FilterType } from './types/todo';
import { useTodos } from './hooks/useTodos';
import { useCategories } from './hooks/useCategories';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { CategoryPanel, CategorySelection } from './components/CategoryPanel';

export default function App() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [selection, setSelection] = useState<CategorySelection>({
    categoryId: null,
    subCategoryId: null,
  });

  const {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    unassignCategory,
    unassignSubCategory,
  } = useTodos();

  const {
    categories,
    addCategory,
    deleteCategory,
    addSubCategory,
    deleteSubCategory,
  } = useCategories();

  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  const handleDeleteCategory = (categoryId: string) => {
    const { subCategoryIds } = deleteCategory(categoryId);
    unassignCategory(categoryId);
    subCategoryIds.forEach(id => unassignSubCategory(id));
    // If we were viewing the deleted category, go back to "All"
    if (selection.categoryId === categoryId) {
      setSelection({ categoryId: null, subCategoryId: null });
    }
  };

  const handleDeleteSubCategory = (categoryId: string, subCategoryId: string) => {
    deleteSubCategory(categoryId, subCategoryId);
    unassignSubCategory(subCategoryId);
    // If we were viewing the deleted sub-category, go back to the parent category
    if (selection.subCategoryId === subCategoryId) {
      setSelection({ categoryId, subCategoryId: null });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-start justify-center px-4 pt-16 pb-16">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-widest text-indigo-600 uppercase">
            Todos
          </h1>
          <p className="mt-1 text-sm text-gray-400">Stay focused. Get things done.</p>
        </div>

        {/* Main layout: sidebar + content */}
        <div className="flex gap-6 items-start">
          {/* Category Sidebar */}
          <div className="bg-white rounded-2xl shadow-xl shadow-indigo-100/50 border border-gray-100 p-4 flex-shrink-0 w-56">
            <CategoryPanel
              categories={categories}
              selection={selection}
              onSelect={setSelection}
              onAddCategory={addCategory}
              onDeleteCategory={handleDeleteCategory}
              onAddSubCategory={addSubCategory}
              onDeleteSubCategory={handleDeleteSubCategory}
            />
          </div>

          {/* Todo card */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl shadow-xl shadow-indigo-100/50 overflow-hidden border border-gray-100">
              {/* Input */}
              <TodoInput
                onAdd={addTodo}
                categories={categories}
              />

              {/* List */}
              <TodoList
                todos={todos}
                filter={filter}
                categories={categories}
                selectedCategoryId={selection.categoryId}
                selectedSubCategoryId={selection.subCategoryId}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
              />

              {/* Footer / filter bar */}
              {todos.length > 0 && (
                <TodoFilter
                  filter={filter}
                  activeCount={activeCount}
                  completedCount={completedCount}
                  onFilterChange={setFilter}
                  onClearCompleted={clearCompleted}
                />
              )}
            </div>

            {/* Hint */}
            <p className="mt-4 text-center text-xs text-gray-400">
              Double-click a todo to edit it
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
