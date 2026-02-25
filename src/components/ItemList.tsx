'use client';

import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface ItemListProps {
  items: string[];
  currentItem: string | null;
  onSelectItem: (id: string) => void;
  label: string;
  completedItems?: Set<string>;
}

export function ItemList({ items, currentItem, onSelectItem, label, completedItems }: ItemListProps) {
  const currentIndex = currentItem ? items.indexOf(currentItem) : -1;

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectItem(items[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      onSelectItem(items[currentIndex + 1]);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-850">
      {/* Header */}
      <div className="p-3 border-b border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-300">{label}s</h3>
          <span className="text-xs text-gray-500">{items.length} items</span>
        </div>
        {/* Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentIndex <= 0}
            className="p-1 rounded hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs text-gray-400 flex-1 text-center">
            {currentIndex >= 0 ? `${currentIndex + 1} / ${items.length}` : '—'}
          </span>
          <button
            onClick={handleNext}
            disabled={currentIndex >= items.length - 1}
            className="p-1 rounded hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            No items loaded
          </div>
        ) : (
          <ul className="divide-y divide-gray-700">
            {items.map((item, index) => (
              <li key={item}>
                <button
                  onClick={() => onSelectItem(item)}
                  className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center justify-between ${
                    currentItem === item
                      ? 'bg-blue-900/50 text-blue-200 border-l-2 border-blue-400'
                      : 'hover:bg-gray-800 text-gray-300'
                  }`}
                >
                  <span>
                    <span className="text-gray-500 mr-2">{index + 1}.</span>
                    {label} {item}
                  </span>
                  {completedItems?.has(item) && (
                    <Check size={14} className="text-green-400 flex-shrink-0" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
