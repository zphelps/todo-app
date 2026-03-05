import { useState } from 'react';
import { FilterType } from './types/todo';
import { useTodos } from './hooks/useTodos';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';

export default function App() {
  const [filter, setFilter] = useState<FilterType>('all');
  const { todos, addTodo, toggleTodo, deleteTodo, editTodo, clearCompleted, reorderTodos } = useTodos();

  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-start justify-center px-4 pt-16 pb-16">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-widest text-indigo-600 uppercase">
            Todos
          </h1>
          <p className="mt-1 text-sm text-gray-400">Stay focused. Get things done.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-indigo-100/50 overflow-hidden border border-gray-100">
          {/* Input */}
          <TodoInput onAdd={addTodo} />

          {/* List */}
          <TodoList
            todos={todos}
            filter={filter}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onEdit={editTodo}
            onReorder={reorderTodos}
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
          Double-click to edit · Drag ⠿ to reorder
        </p>
      </div>
    </div>
  );
}
