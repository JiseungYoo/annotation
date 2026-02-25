'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useMediaPlayer } from '@/hooks/useMediaPlayer';
import { TranscriptPanel } from '@/components/TranscriptPanel';
import { AnnotationPanel } from '@/components/AnnotationPanel';
import { SchemaSetup } from '@/components/SchemaSetup';
import { ThreePanelLayout } from '@/components/ThreePanelLayout';
import { MediaPanel } from '@/components/MediaPanel';
import { JumpToTurn } from '@/components/JumpToTurn';
import { TranscriptRow, AnnotationSchema } from '@/types';
import { parseCSV, exportToCSV } from '@/utils/csvParser';
import { Download, FileSpreadsheet, AlertCircle, Info } from 'lucide-react';

// Demo-specific schema with "Questioning" as the first column
const DEMO_SCHEMA: AnnotationSchema = [
  { id: 'col_1', name: 'Questioning' },
  { id: 'col_2', name: 'Ann2' },
  { id: 'col_3', name: 'Ann3' },
];

export default function SessionDemoPage() {
  const {
    mediaState,
    loadAudio,
    play,
    playSegment,
    pause,
    stop,
    seek,
    setVolume,
    cleanup: cleanupMedia,
  } = useMediaPlayer();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [transcriptData, setTranscriptData] = useState<TranscriptRow[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [schema, setSchema] = useState<AnnotationSchema>(DEMO_SCHEMA);
  const [isSchemaSetupOpen, setIsSchemaSetupOpen] = useState(false);
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
        const result = parseCSV(csvText, schema);
        setTranscriptData(result.data);

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

    // Cleanup on unmount to free memory
    return () => {
      cleanupMedia();
      setTranscriptData([]);
    };
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // Update current utterance based on playback time
  useEffect(() => {
    if (!mediaState.isPlaying || transcriptData.length === 0) return;

    const currentTime = mediaState.currentTime;

    const index = transcriptData.findIndex(
      (row, i) => {
        const nextRow = transcriptData[i + 1];
        const endTime = nextRow ? nextRow.start : row.end;
        return currentTime >= row.start && currentTime < endTime;
      }
    );

    if (index !== -1 && index !== currentIndex) {
      setCurrentIndex(index);
    }
  }, [mediaState.currentTime, mediaState.isPlaying, transcriptData, currentIndex]);

  // Handle row click - play only that segment
  const handleRowClick = useCallback((index: number) => {
    setCurrentIndex(index);
    const row = transcriptData[index];
    if (row) {
      playSegment(row.start, row.end);
    }
  }, [transcriptData, playSegment]);

  // Handle jump to turn
  const handleJumpToTurn = useCallback((turnId: number) => {
    const index = transcriptData.findIndex(row => row.turn_id === turnId);
    if (index !== -1) {
      setCurrentIndex(index);
      seek(transcriptData[index].start);
    }
  }, [transcriptData, seek]);

  // Handle annotation change
  const handleAnnotationChange = useCallback((rowIndex: number, columnId: string, value: string) => {
    setTranscriptData(prev => {
      const newData = [...prev];
      newData[rowIndex] = {
        ...newData[rowIndex],
        annotations: {
          ...newData[rowIndex].annotations,
          [columnId]: value,
        },
      };
      return newData;
    });
  }, []);

  // Handle schema save
  const handleSchemaSave = useCallback((newSchema: AnnotationSchema) => {
    setSchema(newSchema);
    if (transcriptData.length > 0) {
      setTranscriptData(prev => prev.map(row => {
        const newAnnotations: Record<string, string> = {};
        for (const col of newSchema) {
          const existingCol = schema.find(c => c.name.toLowerCase() === col.name.toLowerCase());
          if (existingCol && row.annotations[existingCol.id]) {
            newAnnotations[col.id] = row.annotations[existingCol.id];
          } else {
            newAnnotations[col.id] = row.annotations[col.id] || '';
          }
        }
        return { ...row, annotations: newAnnotations };
      }));
    }
  }, [schema, transcriptData.length]);

  // Export annotations
  const handleExport = useCallback(() => {
    if (transcriptData.length === 0) return;

    const csv = exportToCSV(transcriptData, schema);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'demo_annotated.csv';
    link.click();

    URL.revokeObjectURL(url);
  }, [transcriptData, schema]);

  const maxTurnId = transcriptData.length > 0
    ? Math.max(...transcriptData.map(r => r.turn_id))
    : 0;

  const hasMedia = mediaState.isLoaded;

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
          <span className="font-medium">Demo Mode - Session</span>
          <span className="ml-2 text-blue-100">
            This page shows sample data to demonstrate how session annotation works.
            Go to <a href="/run/session" className="underline hover:text-white">Run → Session</a> to load your own files.
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Sample: Teacher explaining plant biology
          </div>
          <button
            onClick={() => setIsSchemaSetupOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg transition-colors text-sm"
          >
            <FileSpreadsheet size={18} />
            <span>Set Up Schema</span>
          </button>
        </div>
      </header>

      {/* Tip Banner */}
      <div className="bg-gray-800/50 border-b border-gray-700 px-4 py-2 text-sm text-gray-400">
        Tip: Click on any row to play that segment. Press Space to play/pause. Try editing annotations in the right panel.
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-900/50 border-b border-red-700 px-4 py-2 text-red-200 flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-4 text-red-400 hover:text-red-200"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <JumpToTurn
            maxTurnId={maxTurnId}
            onJump={handleJumpToTurn}
            disabled={transcriptData.length === 0}
          />
          {currentIndex >= 0 && (
            <span className="text-sm text-gray-400">
              Current: Turn #{transcriptData[currentIndex]?.turn_id} ({currentIndex + 1} of {transcriptData.length})
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            disabled={transcriptData.length === 0}
            className="flex items-center gap-1 px-3 py-2 bg-green-700 hover:bg-green-600 rounded-lg transition-colors text-sm
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={16} />
            <span>Save Annotations</span>
          </button>
        </div>
      </div>

      {/* Main Content - Three Panel Layout */}
      <div className="flex-1 overflow-hidden">
        <ThreePanelLayout
          showTop={hasMedia}
          defaultTopHeight={300}
          maxTopHeight={500}
          minTopHeight={150}
          defaultLeftWidth={50}
          minLeftWidth={25}
          minRightWidth={25}
          top={
            <div className="h-full bg-gray-900 border-b border-gray-700">
              <div className="p-2 bg-gray-800 border-b border-gray-700">
                <h2 className="text-sm font-medium text-gray-400">Media</h2>
              </div>
              <div className="h-[calc(100%-40px)]">
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
            </div>
          }
          left={
            <div className="h-full bg-gray-900 border-r border-gray-700">
              <div className="p-2 bg-gray-800 border-b border-gray-700">
                <h2 className="text-sm font-medium text-gray-400">Transcript</h2>
              </div>
              <div className="h-[calc(100%-40px)]">
                <TranscriptPanel
                  data={transcriptData}
                  currentIndex={currentIndex}
                  onRowClick={handleRowClick}
                />
              </div>
            </div>
          }
          right={
            <div className="h-full bg-gray-900">
              <div className="p-2 bg-gray-800 border-b border-gray-700">
                <h2 className="text-sm font-medium text-gray-400">Annotations</h2>
              </div>
              <div className="h-[calc(100%-40px)]">
                <AnnotationPanel
                  data={transcriptData}
                  currentIndex={currentIndex}
                  schema={schema}
                  onAnnotationChange={handleAnnotationChange}
                  onRowClick={handleRowClick}
                />
              </div>
            </div>
          }
        />
      </div>

      {/* Schema Setup Modal */}
      <SchemaSetup
        isOpen={isSchemaSetupOpen}
        schema={schema}
        onSave={handleSchemaSave}
        onClose={() => setIsSchemaSetupOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 px-4 py-2 text-xs text-gray-500">
        <div className="flex items-center justify-between">
          <span>Demo data is automatically cleared when you leave this page</span>
          <a href="/run/session" className="text-blue-400 hover:text-blue-300">
            Go to Run page to use your own data →
          </a>
        </div>
      </footer>
    </div>
  );
}
