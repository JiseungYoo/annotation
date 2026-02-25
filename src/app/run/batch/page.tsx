'use client';

import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { useMediaPlayer } from '@/hooks/useMediaPlayer';
import { FileUpload, DropZone } from '@/components/FileUpload';
import { SchemaSetup } from '@/components/SchemaSetup';
import { MediaPanel } from '@/components/MediaPanel';
import { ItemList } from '@/components/ItemList';
import { AnnotationSchema, DEFAULT_SCHEMA } from '@/types';
import { exportToCSV } from '@/utils/csvParser';
import { Download, FileSpreadsheet, CheckCircle, AlertCircle, Play, ChevronLeft, ChevronRight } from 'lucide-react';

interface BatchRow {
  batch_id: string;
  turn_id: number;
  speaker: string;
  utterance: string;
  start: number;
  end: number;
  annotations: Record<string, string>;
  [key: string]: unknown;
}

function parseBatchCSV(text: string, schema: AnnotationSchema): {
  data: BatchRow[];
  matchedColumns: string[];
  newColumns: string[];
} {
  const lines = text.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV file is empty or has no data rows');
  }

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

  // Required columns
  const requiredCols = ['batch_id', 'turn_id', 'speaker', 'utterance', 'start', 'end'];
  for (const col of requiredCols) {
    if (!headers.includes(col)) {
      throw new Error(`Missing required column: ${col}`);
    }
  }

  const batchIdIdx = headers.indexOf('batch_id');
  const turnIdIdx = headers.indexOf('turn_id');
  const speakerIdx = headers.indexOf('speaker');
  const utteranceIdx = headers.indexOf('utterance');
  const startIdx = headers.indexOf('start');
  const endIdx = headers.indexOf('end');

  // Find annotation columns
  const matchedColumns: string[] = [];
  const newColumns: string[] = [];
  const schemaColIndices: { colId: string; idx: number }[] = [];

  for (const col of schema) {
    const headerIdx = headers.findIndex(h =>
      h === col.name.toLowerCase() ||
      h === `ann_${col.name.toLowerCase()}`
    );
    if (headerIdx !== -1) {
      matchedColumns.push(col.name);
      schemaColIndices.push({ colId: col.id, idx: headerIdx });
    } else {
      newColumns.push(col.name);
    }
  }

  const data: BatchRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple CSV parsing (handles quoted fields)
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const annotations: Record<string, string> = {};
    for (const col of schema) {
      const matched = schemaColIndices.find(s => s.colId === col.id);
      annotations[col.id] = matched ? (values[matched.idx] || '') : '';
    }

    data.push({
      batch_id: values[batchIdIdx] || '',
      turn_id: parseInt(values[turnIdIdx] || '0', 10),
      speaker: values[speakerIdx] || '',
      utterance: values[utteranceIdx] || '',
      start: parseFloat(values[startIdx] || '0'),
      end: parseFloat(values[endIdx] || '0'),
      annotations,
    });
  }

  return { data, matchedColumns, newColumns };
}

export default function BatchPage() {
  const {
    mediaState,
    loadAudio,
    loadVideo,
    play,
    playSegment,
    pause,
    stop,
    seek,
    setVolume,
  } = useMediaPlayer();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [mediaFileName, setMediaFileName] = useState<string | null>(null);
  const [transcriptFileName, setTranscriptFileName] = useState<string | null>(null);
  const [rawData, setRawData] = useState<BatchRow[]>([]);
  const [currentBatchId, setCurrentBatchId] = useState<string | null>(null);
  const [schema, setSchema] = useState<AnnotationSchema>(DEFAULT_SCHEMA);
  const [isSchemaSetupOpen, setIsSchemaSetupOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadInfo, setLoadInfo] = useState<{ matched: string[]; new: string[] } | null>(null);

  // Get unique batch IDs
  const batchIds = useMemo(() => {
    const ids = [...new Set(rawData.map(r => r.batch_id))];
    return ids.sort();
  }, [rawData]);

  // Get rows for current batch
  const currentBatchRows = useMemo(() => {
    if (!currentBatchId) return [];
    return rawData.filter(r => r.batch_id === currentBatchId);
  }, [rawData, currentBatchId]);

  // Get completed batch IDs (batches where at least one row has an annotation)
  const completedBatchIds = useMemo(() => {
    const completed = new Set<string>();
    for (const row of rawData) {
      if (Object.values(row.annotations).some(v => v && v.trim() !== '')) {
        completed.add(row.batch_id);
      }
    }
    return completed;
  }, [rawData]);

  // Navigation handlers
  const currentIndex = currentBatchId ? batchIds.indexOf(currentBatchId) : -1;

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentBatchId(batchIds[currentIndex - 1]);
    }
  }, [currentIndex, batchIds]);

  const handleNext = useCallback(() => {
    if (currentIndex < batchIds.length - 1) {
      setCurrentBatchId(batchIds[currentIndex + 1]);
    }
  }, [currentIndex, batchIds]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) {
          handlePrevious();
        } else {
          handleNext();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrevious, handleNext]);

  // Handle media file selection
  const handleMediaFile = useCallback((file: File) => {
    setError(null);
    setMediaFileName(file.name);
    const ext = file.name.toLowerCase().split('.').pop() || '';
    const videoExtensions = ['webm', 'mov', 'avi', 'mkv'];
    // Audio extensions that can be played with audio element (including mp4 with audio-only)
    const audioExtensions = ['wav', 'mp3', 'ogg', 'm4a', 'aac', 'mp4'];

    if (videoExtensions.includes(ext)) {
      // Use video player for video files
      setTimeout(() => {
        if (videoRef.current) {
          loadVideo(file, videoRef.current);
        }
      }, 0);
    } else if (audioExtensions.includes(ext)) {
      // Use audio player for audio files (including mp4)
      loadAudio(file);
    } else {
      // Default to audio for unknown extensions
      loadAudio(file);
    }
  }, [loadAudio, loadVideo]);

  // Handle transcript file selection
  const handleTranscriptFile = useCallback((file: File) => {
    setError(null);
    setLoadInfo(null);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const result = parseBatchCSV(text, schema);
        setRawData(result.data);
        setTranscriptFileName(file.name);

        // Auto-select first batch
        const ids = [...new Set(result.data.map(r => r.batch_id))];
        if (ids.length > 0) {
          setCurrentBatchId(ids.sort()[0]);
        }

        if (result.matchedColumns.length > 0 || result.newColumns.length > 0) {
          setLoadInfo({
            matched: result.matchedColumns,
            new: result.newColumns,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to parse CSV file');
      }
    };

    reader.onerror = () => {
      setError('Failed to read file');
    };

    reader.readAsText(file);
  }, [schema]);

  // Handle playing a segment
  const handlePlaySegment = useCallback((row: BatchRow) => {
    if (mediaState.isLoaded) {
      playSegment(row.start, row.end);
    }
  }, [mediaState.isLoaded, playSegment]);

  // Handle annotation change for any row
  const handleAnnotationChange = useCallback((turnId: number, columnId: string, value: string) => {
    setRawData(prev => prev.map(row => {
      if (row.batch_id === currentBatchId && row.turn_id === turnId) {
        return {
          ...row,
          annotations: {
            ...row.annotations,
            [columnId]: value,
          },
        };
      }
      return row;
    }));
  }, [currentBatchId]);

  // Handle schema save
  const handleSchemaSave = useCallback((newSchema: AnnotationSchema) => {
    setSchema(newSchema);
  }, []);

  // Export annotations
  const handleExport = useCallback(() => {
    if (rawData.length === 0) return;

    const exportData = rawData.map(row => ({
      turn_id: row.turn_id,
      speaker: row.speaker,
      start: row.start,
      end: row.end,
      utterance: row.utterance,
      annotations: row.annotations,
      batch_id: row.batch_id,
    }));

    const csv = exportToCSV(exportData as never[], schema);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = transcriptFileName
      ? transcriptFileName.replace('.csv', '_annotated.csv')
      : 'batch_annotated.csv';
    link.click();

    URL.revokeObjectURL(url);
  }, [rawData, schema, transcriptFileName]);

  return (
    <DropZone onAudioDrop={handleMediaFile} onTranscriptDrop={handleTranscriptFile}>
      <div className="h-[calc(100vh-64px)] bg-gray-900 text-white flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">Batch</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSchemaSetupOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg transition-colors text-sm"
              >
                <FileSpreadsheet size={18} />
                <span>Set Up Schema</span>
              </button>
              <FileUpload
                type="media"
                fileName={mediaFileName}
                onFileSelect={handleMediaFile}
                accept=".wav,.mp3,.ogg,.webm,.m4a,.aac,.mp4,.mov,.avi,.mkv"
              />
              <FileUpload
                type="transcript"
                fileName={transcriptFileName}
                onFileSelect={handleTranscriptFile}
                accept=".csv"
              />
              <button
                onClick={handleExport}
                disabled={rawData.length === 0}
                className="flex items-center gap-1 px-3 py-2 bg-green-700 hover:bg-green-600 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={16} />
                <span>Export</span>
              </button>
            </div>
          </div>
        </header>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-900/50 border-b border-red-700 px-4 py-2 text-red-200 flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-4 text-red-400 hover:text-red-200">
              Dismiss
            </button>
          </div>
        )}

        {/* Load Info Banner */}
        {loadInfo && (
          <div className="bg-blue-900/30 border-b border-blue-700 px-4 py-2 text-blue-200 text-sm">
            <div className="flex items-center gap-4">
              {loadInfo.matched.length > 0 && (
                <span className="flex items-center gap-1">
                  <CheckCircle size={14} className="text-green-400" />
                  Loaded: {loadInfo.matched.join(', ')}
                </span>
              )}
              {loadInfo.new.length > 0 && (
                <span className="flex items-center gap-1">
                  <AlertCircle size={14} className="text-yellow-400" />
                  New: {loadInfo.new.join(', ')}
                </span>
              )}
              <button onClick={() => setLoadInfo(null)} className="ml-auto text-blue-400 hover:text-blue-200">
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Batch List */}
          <div className="w-48 border-r border-gray-700 flex-shrink-0">
            <ItemList
              items={batchIds}
              currentItem={currentBatchId}
              onSelectItem={setCurrentBatchId}
              label="Batch"
              completedItems={completedBatchIds}
            />
          </div>

          {/* Right Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Media Panel (if loaded) */}
            {mediaState.isLoaded && (
              <div className="h-48 border-b border-gray-700 flex-shrink-0">
                <MediaPanel
                  ref={videoRef}
                  mediaType={mediaState.mediaType}
                  fileName={mediaFileName}
                  isPlaying={mediaState.isPlaying}
                  currentTime={mediaState.currentTime}
                  duration={mediaState.duration}
                  volume={mediaState.volume}
                  isLoaded={mediaState.isLoaded}
                  onPlay={play}
                  onPause={pause}
                  onStop={stop}
                  onSeek={seek}
                  onVolumeChange={setVolume}
                />
              </div>
            )}

            {/* Batch Table with Annotations */}
            <div className="flex-1 overflow-auto">
              {currentBatchRows.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <p className="text-lg mb-2">No batch selected</p>
                    <p className="text-sm">Load a CSV file and select a batch from the list</p>
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-3">
                    Batch {currentBatchId} - {currentBatchRows.length} turns
                  </h3>
                  <table className="w-full text-sm">
                    <thead className="bg-gray-800 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left text-gray-400 w-12">#</th>
                        <th className="px-3 py-2 text-left text-gray-400 w-24">Speaker</th>
                        <th className="px-3 py-2 text-left text-gray-400">Utterance</th>
                        {schema.map(col => (
                          <th key={col.id} className="px-3 py-2 text-left text-gray-400 w-32">
                            {col.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {currentBatchRows.map((row) => (
                        <tr
                          key={row.turn_id}
                          className={`border-b border-gray-700 hover:bg-gray-800 ${
                            mediaState.isLoaded ? 'cursor-pointer' : ''
                          }`}
                        >
                          <td
                            className="px-3 py-2 text-gray-500"
                            onClick={() => handlePlaySegment(row)}
                          >
                            <div className="flex items-center gap-1">
                              {mediaState.isLoaded && (
                                <Play size={12} className="text-blue-400" />
                              )}
                              {row.turn_id}
                            </div>
                          </td>
                          <td
                            className="px-3 py-2"
                            onClick={() => handlePlaySegment(row)}
                          >
                            <span className={`${
                              row.speaker.toLowerCase().includes('teacher')
                                ? 'text-blue-400'
                                : 'text-green-400'
                            }`}>
                              {row.speaker}
                            </span>
                          </td>
                          <td
                            className="px-3 py-2 text-gray-300 max-w-md"
                            onClick={() => handlePlaySegment(row)}
                          >
                            <div className="truncate" title={row.utterance}>
                              {row.utterance}
                            </div>
                          </td>
                          {schema.map(col => (
                            <td key={col.id} className="px-3 py-2">
                              <input
                                type="text"
                                value={row.annotations[col.id] || ''}
                                onChange={(e) => handleAnnotationChange(row.turn_id, col.id, e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            {currentBatchId && (
              <div className="border-t border-gray-700 p-3 bg-gray-800 flex justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentIndex <= 0}
                  className="flex items-center gap-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentIndex >= batchIds.length - 1}
                  className="flex items-center gap-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Schema Setup Modal */}
        <SchemaSetup
          isOpen={isSchemaSetupOpen}
          schema={schema}
          onSave={handleSchemaSave}
          onClose={() => setIsSchemaSetupOpen(false)}
        />
      </div>
    </DropZone>
  );
}
