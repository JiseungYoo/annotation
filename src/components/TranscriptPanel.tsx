'use client';

import { useEffect, useRef } from 'react';
import { TranscriptRow } from '@/types';
import { formatTime } from '@/utils/formatTime';

interface TranscriptPanelProps {
  data: TranscriptRow[];
  currentIndex: number;
  onRowClick: (index: number, time: number) => void;
}

export function TranscriptPanel({ data, currentIndex, onRowClick }: TranscriptPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentRowRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to current utterance
  useEffect(() => {
    if (currentRowRef.current && containerRef.current) {
      const container = containerRef.current;
      const row = currentRowRef.current;
      const rowTop = row.offsetTop;
      const rowHeight = row.offsetHeight;
      const containerHeight = container.clientHeight;
      const scrollTop = container.scrollTop;

      // Check if row is out of view
      if (rowTop < scrollTop || rowTop + rowHeight > scrollTop + containerHeight) {
        container.scrollTo({
          top: rowTop - containerHeight / 2 + rowHeight / 2,
          behavior: 'smooth',
        });
      }
    }
  }, [currentIndex]);

  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p className="text-lg">No transcript loaded</p>
          <p className="text-sm mt-2">Load a CSV file to view the transcript</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-full overflow-y-auto">
      <div className="p-4 space-y-2">
        {data.map((row, index) => {
          const isCurrent = index === currentIndex;
          return (
            <div
              key={row.turn_id}
              ref={isCurrent ? currentRowRef : null}
              onClick={() => onRowClick(index, row.start)}
              className={`p-3 rounded-lg cursor-pointer transition-all ${
                isCurrent
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-200'
              }`}
            >
              <div className="flex items-center gap-3 mb-1">
                <span className={`text-xs font-mono ${isCurrent ? 'text-blue-200' : 'text-gray-500'}`}>
                  #{row.turn_id}
                </span>
                <span className={`font-semibold ${isCurrent ? 'text-blue-100' : 'text-blue-400'}`}>
                  {row.speaker}
                </span>
                <span className={`text-xs ${isCurrent ? 'text-blue-200' : 'text-gray-500'}`}>
                  {formatTime(row.start)} - {formatTime(row.end)}
                </span>
              </div>
              <p className="text-sm leading-relaxed">
                {row.utterance}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
