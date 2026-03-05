import React, { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Todo } from '../types/todo';
import { GripIcon } from './GripIcon';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  dragDisabled?: boolean;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit, dragDisabled = false }: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id, disabled: dragDisabled });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const startEdit = () => {
    setEditValue(todo.text);
    setEditing(true);
  };

  const commitEdit = () => {
    onEdit(todo.id, editValue);
    setEditing(false);
  };

  const cancelEdit = () => {
    setEditValue(todo.text);
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') cancelEdit();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-3 px-4 py-3 border-b border-gray-100 transition-all duration-150 ${
        isDragging
          ? 'shadow-lg scale-[1.02] opacity-90 bg-white z-50 relative rounded-xl border-gray-200'
          : 'hover:bg-gray-50/60'
      }`}
    >
      {/* Drag handle */}
      {!dragDisabled && (
        <button
          {...attributes}
          {...listeners}
          className={`flex-shrink-0 text-gray-300 group-hover:text-gray-400 hover:!text-gray-500 transition-colors duration-150 focus:outline-none ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          aria-label="Drag to reorder"
          tabIndex={0}
        >
          <GripIcon />
        </button>
      )}

      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo.id)}
        className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 focus:outline-none ${
          todo.completed
            ? 'bg-indigo-500 border-indigo-500'
            : 'border-gray-300 hover:border-indigo-400'
        }`}
        aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {todo.completed && (
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Text / Edit input */}
      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={commitEdit}
            className="w-full text-base text-gray-700 bg-white border border-indigo-400 rounded-md px-2 py-0.5 outline-none ring-2 ring-indigo-100"
          />
        ) : (
          <span
            onDoubleClick={startEdit}
            className={`block text-base select-none cursor-text transition-all duration-200 truncate ${
              todo.completed
                ? 'line-through text-gray-400'
                : 'text-gray-700'
            }`}
            title="Double-click to edit"
          >
            {todo.text}
          </span>
        )}
      </div>

      {/* Delete button */}
      {!editing && (
        <button
          onClick={() => onDelete(todo.id)}
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-all duration-150 focus:opacity-100 focus:outline-none ml-2 flex-shrink-0"
          aria-label="Delete todo"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
