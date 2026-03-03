import { Todo, FilterType } from '../types/todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  filter: FilterType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

export function TodoList({ todos, filter, onToggle, onDelete, onEdit }: TodoListProps) {
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

  return (
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
  );
}
