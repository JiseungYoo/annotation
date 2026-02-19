'use client';

import { useState, useRef, useEffect } from 'react';
import { TranscriptRow, AnnotationSchema } from '@/types';
import { formatTime } from '@/utils/formatTime';

interface AnnotationPanelProps {
  data: TranscriptRow[];
  currentIndex: number;
  schema: AnnotationSchema;
  onAnnotationChange: (rowIndex: number, columnId: string, value: string) => void;
  onRowClick: (index: number) => void;
}

export function AnnotationPanel({
  data,
  currentIndex,
  schema,
  onAnnotationChange,
  onRowClick,
}: AnnotationPanelProps) {
  const [editingCell, setEditingCell] = useState<{ row: number; columnId: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentRowRef = useRef<HTMLTableRowElement>(null);

  // Auto-scroll to current row
  useEffect(() => {
    if (currentRowRef.current && containerRef.current) {
      const container = containerRef.current;
      const row = currentRowRef.current;
      const rowTop = row.offsetTop;
      const rowHeight = row.offsetHeight;
      const containerHeight = container.clientHeight;
      const scrollTop = container.scrollTop;

      if (rowTop < scrollTop || rowTop + rowHeight > scrollTop + containerHeight) {
        container.scrollTo({
          top: rowTop - containerHeight / 2 + rowHeight / 2,
          behavior: 'smooth',
        });
      }
    }
  }, [currentIndex]);

  // Focus input when editing
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingCell]);

  const handleCellClick = (rowIndex: number, columnId: string) => {
    setEditingCell({ row: rowIndex, columnId });
    setEditValue(data[rowIndex].annotations[columnId] || '');
  };

  const handleSave = () => {
    if (editingCell) {
      onAnnotationChange(editingCell.row, editingCell.columnId, editValue);
      setEditingCell(null);
    }
  };

  const handleCancel = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleSave();

      // Move to next cell
      if (editingCell) {
        const columnIds = schema.map(col => col.id);
        const currentColIndex = columnIds.indexOf(editingCell.columnId);

        if (e.shiftKey) {
          // Move to previous cell
          if (currentColIndex > 0) {
            const prevColumnId = columnIds[currentColIndex - 1];
            setTimeout(() => handleCellClick(editingCell.row, prevColumnId), 0);
          } else if (editingCell.row > 0) {
            const lastColumnId = columnIds[columnIds.length - 1];
            setTimeout(() => handleCellClick(editingCell.row - 1, lastColumnId), 0);
          }
        } else {
          // Move to next cell
          if (currentColIndex < columnIds.length - 1) {
            const nextColumnId = columnIds[currentColIndex + 1];
            setTimeout(() => handleCellClick(editingCell.row, nextColumnId), 0);
          } else if (editingCell.row < data.length - 1) {
            const firstColumnId = columnIds[0];
            setTimeout(() => handleCellClick(editingCell.row + 1, firstColumnId), 0);
          }
        }
      }
    }
  };

  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p className="text-lg">No data to annotate</p>
          <p className="text-sm mt-2">Load a transcript CSV file first</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-full overflow-auto">
      <table className="w-full border-collapse">
        <thead className="sticky top-0 bg-gray-900 z-10">
          <tr>
            <th className="p-2 text-left text-xs font-medium text-gray-400 border-b border-gray-700 w-12">#</th>
            <th className="p-2 text-left text-xs font-medium text-gray-400 border-b border-gray-700 w-16">Speaker</th>
            <th className="p-2 text-left text-xs font-medium text-gray-400 border-b border-gray-700 w-20">Time</th>
            <th className="p-2 text-left text-xs font-medium text-gray-400 border-b border-gray-700 min-w-[150px]">Utterance</th>
            {schema.map(col => (
              <th
                key={col.id}
                className="p-2 text-left text-xs font-medium text-blue-400 border-b border-gray-700 min-w-[100px]"
              >
                {col.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => {
            const isCurrent = index === currentIndex;
            return (
              <tr
                key={row.turn_id}
                ref={isCurrent ? currentRowRef : null}
                onClick={() => onRowClick(index)}
                className={`cursor-pointer ${
                  isCurrent ? 'bg-blue-900/50' : 'hover:bg-gray-800/50'
                } transition-colors`}
              >
                <td className="p-2 text-xs font-mono text-gray-500 border-b border-gray-800">
                  {row.turn_id}
                </td>
                <td className="p-2 text-sm text-blue-400 border-b border-gray-800">
                  {row.speaker}
                </td>
                <td className="p-2 text-xs text-gray-500 border-b border-gray-800">
                  {formatTime(row.start)}
                </td>
                <td
                  className="p-2 text-sm text-gray-300 border-b border-gray-800 max-w-[200px] truncate"
                  title={row.utterance}
                >
                  {row.utterance}
                </td>
                {schema.map(col => {
                  const cellValue = row.annotations[col.id] || '';
                  const isEditing = editingCell?.row === index && editingCell?.columnId === col.id;

                  return (
                    <td
                      key={col.id}
                      className="p-2 border-b border-gray-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCellClick(index, col.id);
                      }}
                    >
                      {isEditing ? (
                        <input
                          ref={inputRef}
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleSave}
                          onKeyDown={handleKeyDown}
                          className="w-full px-2 py-1 bg-gray-700 border border-blue-500 rounded text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      ) : (
                        <div
                          className={`px-2 py-1 rounded cursor-pointer min-h-[28px] ${
                            cellValue
                              ? 'bg-gray-800 text-gray-200'
                              : 'bg-gray-900/50 text-gray-500 hover:bg-gray-800/50'
                          }`}
                        >
                          {cellValue || <span className="text-xs italic">Click to edit</span>}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
