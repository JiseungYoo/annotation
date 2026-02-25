'use client';

import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { useMediaPlayer } from '@/hooks/useMediaPlayer';
import { MediaPanel } from '@/components/MediaPanel';
import { ItemList } from '@/components/ItemList';
import { Download, AlertCircle, Info, Play, ChevronLeft, ChevronRight } from 'lucide-react';

interface PairRow {
  pair_id: string;
  turn_position: string; // 'A' or 'B'
  turn_id: number;
  speaker: string;
  utterance: string;
  start: number;
  end: number;
  choice?: string; // 'A', 'B', or 'Tie'
  note?: string;
  [key: string]: unknown;
}

// Store pair annotations separately (choice + note per pair)
interface PairAnnotation {
  choice: string; // 'A', 'B', 'Tie', or ''
  note: string;
}

function parsePairCSV(text: string): {
  data: PairRow[];
  hasChoice: boolean;
  hasNote: boolean;
} {
  const lines = text.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV file is empty or has no data rows');
  }

  const headers = lines[0].replace(/^\uFEFF/, '').split(',').map(h => h.trim().toLowerCase());

  // Required columns
  const requiredCols = ['pair_id', 'turn_id', 'speaker', 'utterance', 'start', 'end'];
  for (const col of requiredCols) {
    if (!headers.includes(col)) {
      throw new Error(`Missing required column: ${col}`);
    }
  }

  const pairIdIdx = headers.indexOf('pair_id');
  const turnPositionIdx = headers.indexOf('turn_position');
  const turnIdIdx = headers.indexOf('turn_id');
  const speakerIdx = headers.indexOf('speaker');
  const utteranceIdx = headers.indexOf('utterance');
  const startIdx = headers.indexOf('start');
  const endIdx = headers.indexOf('end');
  const choiceIdx = headers.indexOf('choice');
  const noteIdx = headers.indexOf('note');

  const data: PairRow[] = [];

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

    const pairId = values[pairIdIdx] || '';
    // Skip rows without pair_id
    if (!pairId) continue;

    data.push({
      pair_id: pairId,
      turn_position: turnPositionIdx !== -1 ? values[turnPositionIdx] || 'A' : 'A',
      turn_id: parseInt(values[turnIdIdx] || '0', 10),
      speaker: values[speakerIdx] || '',
      utterance: values[utteranceIdx] || '',
      start: parseFloat(values[startIdx] || '0'),
      end: parseFloat(values[endIdx] || '0'),
      choice: choiceIdx !== -1 ? values[choiceIdx] || '' : '',
      note: noteIdx !== -1 ? values[noteIdx] || '' : '',
    });
  }

  // If no turn_position column, assign A/B based on order within each pair
  if (turnPositionIdx === -1) {
    const pairGroups = new Map<string, PairRow[]>();
    for (const row of data) {
      if (!pairGroups.has(row.pair_id)) {
        pairGroups.set(row.pair_id, []);
      }
      pairGroups.get(row.pair_id)!.push(row);
    }
    for (const rows of pairGroups.values()) {
      rows.sort((a, b) => a.turn_id - b.turn_id);
      if (rows.length >= 1) rows[0].turn_position = 'A';
      if (rows.length >= 2) rows[1].turn_position = 'B';
    }
  }

  return {
    data,
    hasChoice: choiceIdx !== -1,
    hasNote: noteIdx !== -1,
  };
}

export default function PairDemoPage() {
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
    cleanup: cleanupMedia,
  } = useMediaPlayer();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [rawData, setRawData] = useState<PairRow[]>([]);
  const [currentPairId, setCurrentPairId] = useState<string | null>(null);
  const [pairAnnotations, setPairAnnotations] = useState<Record<string, PairAnnotation>>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load demo data on mount
  useEffect(() => {
    const loadDemoData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load demo CSV
        const csvResponse = await fetch('/demo/sample.csv');
        if (!csvResponse.ok) {
          throw new Error('Failed to load demo transcript');
        }
        const csvText = await csvResponse.text();
        const result = parsePairCSV(csvText);
        setRawData(result.data);

        // Initialize annotations from loaded data
        const annotations: Record<string, PairAnnotation> = {};
        const pairIdsSet = new Set(result.data.map(r => r.pair_id));
        pairIdsSet.forEach(pairId => {
          const turnARow = result.data.find(r => r.pair_id === pairId && r.turn_position === 'A');
          annotations[pairId] = {
            choice: turnARow?.choice || '',
            note: turnARow?.note || '',
          };
        });
        setPairAnnotations(annotations);

        // Auto-select first pair
        const ids = [...pairIdsSet];
        if (ids.length > 0) {
          setCurrentPairId(ids.sort((a, b) => parseInt(a) - parseInt(b))[0]);
        }

        // Load demo audio
        const audioResponse = await fetch('/demo/sample.mp3');
        if (!audioResponse.ok) {
          throw new Error('Failed to load demo audio');
        }
        const audioBlob = await audioResponse.blob();
        const audioFile = new File([audioBlob], 'sample.mp3', { type: 'audio/mpeg' });
        loadAudio(audioFile);

        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load demo data');
        setIsLoading(false);
      }
    };

    loadDemoData();

    return () => {
      cleanupMedia();
      setRawData([]);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Get unique pair IDs
  const pairIds = useMemo(() => {
    const ids = [...new Set(rawData.map(r => r.pair_id))];
    return ids.sort((a, b) => parseInt(a) - parseInt(b));
  }, [rawData]);

  // Get rows for current pair
  const currentPairRows = useMemo(() => {
    if (!currentPairId) return [];
    return rawData.filter(r => r.pair_id === currentPairId);
  }, [rawData, currentPairId]);

  // Get A and B turns
  const turnA = useMemo(() => {
    return currentPairRows.find(r => r.turn_position === 'A');
  }, [currentPairRows]);

  const turnB = useMemo(() => {
    return currentPairRows.find(r => r.turn_position === 'B');
  }, [currentPairRows]);

  // Get current pair annotation
  const currentAnnotation = useMemo(() => {
    if (!currentPairId) return { choice: '', note: '' };
    return pairAnnotations[currentPairId] || { choice: '', note: '' };
  }, [currentPairId, pairAnnotations]);

  // Get completed pair IDs (pairs where a choice has been made)
  const completedPairIds = useMemo(() => {
    const completed = new Set<string>();
    for (const [pairId, annotation] of Object.entries(pairAnnotations)) {
      if (annotation.choice && annotation.choice.trim() !== '') {
        completed.add(pairId);
      }
    }
    return completed;
  }, [pairAnnotations]);

  // Navigation handlers
  const currentIndex = currentPairId ? pairIds.indexOf(currentPairId) : -1;

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentPairId(pairIds[currentIndex - 1]);
    }
  }, [currentIndex, pairIds]);

  const handleNext = useCallback(() => {
    if (currentIndex < pairIds.length - 1) {
      setCurrentPairId(pairIds[currentIndex + 1]);
    }
  }, [currentIndex, pairIds]);

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

  // Handle choice selection
  const handleChoiceSelect = useCallback((choice: 'A' | 'B' | 'Tie') => {
    if (!currentPairId) return;
    setPairAnnotations(prev => ({
      ...prev,
      [currentPairId]: {
        ...prev[currentPairId],
        choice,
      },
    }));
  }, [currentPairId]);

  // Handle note change
  const handleNoteChange = useCallback((note: string) => {
    if (!currentPairId) return;
    setPairAnnotations(prev => ({
      ...prev,
      [currentPairId]: {
        ...prev[currentPairId],
        note,
      },
    }));
  }, [currentPairId]);

  // Handle play segment for A or B
  const handlePlaySegment = useCallback((turn: PairRow | undefined) => {
    if (turn && mediaState.isLoaded) {
      playSegment(turn.start, turn.end);
    }
  }, [mediaState.isLoaded, playSegment]);

  // Export annotations
  const handleExport = useCallback(() => {
    if (rawData.length === 0) return;

    // Build CSV with choice and note columns
    const headers = ['pair_id', 'turn_position', 'turn_id', 'speaker', 'start', 'end', 'utterance', 'choice', 'note'];
    const rows = rawData.map(row => {
      const annotation = pairAnnotations[row.pair_id] || { choice: '', note: '' };
      // Only include choice/note on turn A row
      const choice = row.turn_position === 'A' ? annotation.choice : '';
      const note = row.turn_position === 'A' ? annotation.note : '';

      return [
        row.pair_id,
        row.turn_position,
        row.turn_id,
        row.speaker,
        row.start,
        row.end,
        `"${(row.utterance || '').replace(/"/g, '""')}"`,
        choice,
        `"${(note || '').replace(/"/g, '""')}"`,
      ].join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'demo_pair_annotated.csv';
    link.click();

    URL.revokeObjectURL(url);
  }, [rawData, pairAnnotations]);

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-64px)] bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading demo data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] bg-gray-900 text-white flex flex-col overflow-hidden">
      {/* Demo Banner */}
      <div className="bg-blue-600 px-4 py-3 text-white flex items-center gap-3">
        <Info size={20} />
        <div>
          <span className="font-medium">Demo Mode - Pair</span>
          <span className="ml-2 text-blue-100">
            This page shows sample data to demonstrate how paired comparison annotation works.
            Go to <a href="/run/pair" className="underline hover:text-white">Run → Pair</a> to load your own files.
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Pair Demo</h1>
          <div className="flex items-center gap-4">
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

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Pair List */}
        <div className="w-48 border-r border-gray-700 flex-shrink-0">
          <ItemList
            items={pairIds}
            currentItem={currentPairId}
            onSelectItem={setCurrentPairId}
            label="Pair"
            completedItems={completedPairIds}
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
                fileName="sample.mp3"
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

          {/* Comparison Panel */}
          <div className="flex-1 overflow-auto p-4">
            {!currentPairId ? (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <p className="text-lg mb-2">No pair selected</p>
                  <p className="text-sm">Select a pair from the list</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-medium text-gray-400">
                  Pair {currentPairId} - Comparison
                </h3>

                {/* A/B Cards */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Turn A */}
                  <div
                    onClick={() => handlePlaySegment(turnA)}
                    className={`bg-gray-800 border-2 rounded-lg p-4 ${
                      currentAnnotation.choice === 'A'
                        ? 'border-blue-500 bg-blue-900/20'
                        : 'border-blue-600/50'
                    } ${mediaState.isLoaded ? 'cursor-pointer hover:bg-gray-750' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-blue-400">A</span>
                        <span className="text-sm text-gray-400">
                          {turnA?.speaker || 'No turn A'}
                        </span>
                      </div>
                      {mediaState.isLoaded && turnA && (
                        <Play size={16} className="text-blue-400" />
                      )}
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {turnA?.utterance || '—'}
                    </p>
                    {currentAnnotation.choice === 'A' && (
                      <div className="mt-3 text-xs text-blue-400 font-medium">
                        SELECTED
                      </div>
                    )}
                  </div>

                  {/* Turn B */}
                  <div
                    onClick={() => handlePlaySegment(turnB)}
                    className={`bg-gray-800 border-2 rounded-lg p-4 ${
                      currentAnnotation.choice === 'B'
                        ? 'border-purple-500 bg-purple-900/20'
                        : 'border-purple-600/50'
                    } ${mediaState.isLoaded ? 'cursor-pointer hover:bg-gray-750' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-purple-400">B</span>
                        <span className="text-sm text-gray-400">
                          {turnB?.speaker || 'No turn B'}
                        </span>
                      </div>
                      {mediaState.isLoaded && turnB && (
                        <Play size={16} className="text-purple-400" />
                      )}
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {turnB?.utterance || '—'}
                    </p>
                    {currentAnnotation.choice === 'B' && (
                      <div className="mt-3 text-xs text-purple-400 font-medium">
                        SELECTED
                      </div>
                    )}
                  </div>
                </div>

                {/* Annotation Panel - Choice buttons + Note */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 mt-8">
                  <div className="flex items-center gap-6">
                    {/* Choice buttons */}
                    <div className="flex items-center gap-3">
                      <label className="text-xs text-gray-400 font-medium">Answer</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleChoiceSelect('A')}
                          className={`px-5 py-1.5 rounded font-medium transition-colors text-sm ${
                            currentAnnotation.choice === 'A'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          A
                        </button>
                        <button
                          onClick={() => handleChoiceSelect('B')}
                          className={`px-5 py-1.5 rounded font-medium transition-colors text-sm ${
                            currentAnnotation.choice === 'B'
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          B
                        </button>
                        <button
                          onClick={() => handleChoiceSelect('Tie')}
                          className={`px-5 py-1.5 rounded font-medium transition-colors text-sm ${
                            currentAnnotation.choice === 'Tie'
                              ? 'bg-yellow-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          Tie
                        </button>
                      </div>
                    </div>

                    {/* Note input */}
                    <div className="flex items-center gap-3">
                      <label className="text-xs text-gray-400 font-medium">Note</label>
                      <input
                        type="text"
                        value={currentAnnotation.note}
                        onChange={(e) => handleNoteChange(e.target.value)}
                        placeholder="Add a note..."
                        size={Math.max(15, currentAnnotation.note.length + 2)}
                        className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-4">
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
                    disabled={currentIndex >= pairIds.length - 1}
                    className="flex items-center gap-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Next</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
