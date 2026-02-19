'use client';

import { TranscriptRow } from '@/types';
import { formatTime } from '@/utils/formatTime';

interface TranscriptPanelProps {
  data: TranscriptRow[];
  currentIndex: number;
  onRowClick: (index: number, time: number) => void;
}

export function TranscriptPanel({ data, currentIndex }: TranscriptPanelProps) {
  // Show empty state when no data loaded
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

  // Show empty state when no item selected
  if (currentIndex < 0 || currentIndex >= data.length) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p className="text-lg">No utterance selected</p>
          <p className="text-sm mt-2">Click a row in the Annotations panel to view details</p>
        </div>
      </div>
    );
  }

  const row = data[currentIndex];

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="bg-gray-800 rounded-lg p-6 space-y-4">
        {/* Header info */}
        <div className="flex items-center gap-4 pb-4 border-b border-gray-700">
          <span className="text-sm font-mono text-gray-400 bg-gray-900 px-2 py-1 rounded">
            Turn #{row.turn_id}
          </span>
          <span className="text-lg font-semibold text-blue-400">
            {row.speaker}
          </span>
          <span className="text-sm text-gray-500">
            {formatTime(row.start)} - {formatTime(row.end)}
          </span>
        </div>

        {/* Utterance text */}
        <div className="space-y-2">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Utterance</h3>
          <p className="text-lg text-gray-100 leading-relaxed">
            {row.utterance}
          </p>
        </div>

        {/* Clean utterance if available */}
        {row.clean_utterance && (
          <div className="space-y-2 pt-4 border-t border-gray-700">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Clean Utterance</h3>
            <p className="text-base text-gray-300 leading-relaxed">
              {row.clean_utterance}
            </p>
          </div>
        )}

        {/* Additional metadata */}
        <div className="pt-4 border-t border-gray-700 grid grid-cols-2 gap-4 text-sm">
          {row.words !== undefined && (
            <div>
              <span className="text-gray-500">Words:</span>
              <span className="ml-2 text-gray-300">{row.words}</span>
            </div>
          )}
          {row.length_seconds !== undefined && (
            <div>
              <span className="text-gray-500">Duration:</span>
              <span className="ml-2 text-gray-300">{row.length_seconds.toFixed(2)}s</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
