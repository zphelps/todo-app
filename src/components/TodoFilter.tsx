import { FilterType } from '../types/todo';

interface TodoFilterProps {
  filter: FilterType;
  activeCount: number;
  completedCount: number;
  onFilterChange: (filter: FilterType) => void;
  onClearCompleted: () => void;
}

const FILTERS: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
];

export function TodoFilter({
  filter,
  activeCount,
  completedCount,
  onFilterChange,
  onClearCompleted,
}: TodoFilterProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-500 border-t border-gray-100">
      {/* Item count */}
      <span className="min-w-[80px]">
        {activeCount} {activeCount === 1 ? 'item' : 'items'} left
      </span>

      {/* Filter buttons */}
      <div className="flex items-center gap-1">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            className={`px-3 py-1 rounded-md transition-all duration-150 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
              filter === f.value
                ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Clear completed */}
      <div className="min-w-[80px] flex justify-end">
        {completedCount > 0 ? (
          <button
            onClick={onClearCompleted}
            className="hover:text-red-400 hover:underline transition-colors duration-150 focus:outline-none"
          >
            Clear completed
          </button>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
