import { Todo, FilterType, Category } from '../types/todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  filter: FilterType;
  categories: Category[];
  selectedCategoryId: string | null;
  selectedSubCategoryId: string | null;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

export function TodoList({
  todos,
  filter,
  categories,
  selectedCategoryId,
  selectedSubCategoryId,
  onToggle,
  onDelete,
  onEdit,
}: TodoListProps) {
  const filtered = todos.filter(todo => {
    // Completion filter
    if (filter === 'active' && todo.completed) return false;
    if (filter === 'completed' && !todo.completed) return false;

    // Category filter
    if (selectedCategoryId !== null) {
      if (todo.categoryId !== selectedCategoryId) return false;
      if (selectedSubCategoryId !== null && todo.subCategoryId !== selectedSubCategoryId) {
        return false;
      }
    }

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
          categories={categories}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
