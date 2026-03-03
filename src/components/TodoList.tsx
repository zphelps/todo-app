import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from '@dnd-kit/modifiers';
import { useState } from 'react';
import { Todo, FilterType } from '../types/todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  filter: FilterType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onReorder: (activeId: string, overId: string) => void;
}

export function TodoList({ todos, filter, onToggle, onDelete, onEdit, onReorder }: TodoListProps) {
  const [activeTodo, setActiveTodo] = useState<Todo | null>(null);

  const filtered = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  if (filtered.length === 0) {
    const messages: Record<FilterType, string> = {
      all: 'No todos yet — add something above!',
      active: 'Nothing left to do 🎉',
      completed: 'No completed todos yet.',
    };
    return (
      <div className="py-12 text-center text-gray-400 text-sm">
        {messages[filter]}
      </div>
    );
  }

  const handleDragStart = (event: DragStartEvent) => {
    const todo = todos.find(t => t.id === event.active.id);
    setActiveTodo(todo ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTodo(null);
    if (over && active.id !== over.id) {
      onReorder(String(active.id), String(over.id));
    }
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={filtered.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div>
          {filtered.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeTodo ? (
          <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl shadow-xl shadow-indigo-100/60 border border-gray-200 scale-[1.02] opacity-95">
            {/* Grip icon */}
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="5" cy="4" r="1.2" />
              <circle cx="11" cy="4" r="1.2" />
              <circle cx="5" cy="8" r="1.2" />
              <circle cx="11" cy="8" r="1.2" />
              <circle cx="5" cy="12" r="1.2" />
              <circle cx="11" cy="12" r="1.2" />
            </svg>
            {/* Checkbox indicator */}
            <div
              className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                activeTodo.completed
                  ? 'bg-indigo-500 border-indigo-500'
                  : 'border-gray-300'
              }`}
            >
              {activeTodo.completed && (
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            {/* Text */}
            <span
              className={`flex-1 text-base truncate ${
                activeTodo.completed ? 'line-through text-gray-400' : 'text-gray-700'
              }`}
            >
              {activeTodo.text}
            </span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
