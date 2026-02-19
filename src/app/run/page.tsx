'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useMediaPlayer } from '@/hooks/useMediaPlayer';
import { TranscriptPanel } from '@/components/TranscriptPanel';
import { AnnotationPanel } from '@/components/AnnotationPanel';
import { FileUpload, DropZone } from '@/components/FileUpload';
import { SchemaSetup } from '@/components/SchemaSetup';
import { ThreePanelLayout } from '@/components/ThreePanelLayout';
import { MediaPanel } from '@/components/MediaPanel';
import { JumpToTurn } from '@/components/JumpToTurn';
import { TranscriptRow, AnnotationSchema, DEFAULT_SCHEMA } from '@/types';
import { parseCSV, exportToCSV } from '@/utils/csvParser';
import { Download, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';

const AUDIO_EXTENSIONS = ['wav', 'mp3', 'ogg', 'webm', 'm4a', 'aac'];
const VIDEO_EXTENSIONS = ['mp4', 'webm', 'mov', 'avi', 'mkv'];

export default function PlayerPage() {
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
  const [transcriptData, setTranscriptData] = useState<TranscriptRow[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [schema, setSchema] = useState<AnnotationSchema>(DEFAULT_SCHEMA);
  const [isSchemaSetupOpen, setIsSchemaSetupOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadInfo, setLoadInfo] = useState<{ matched: string[]; new: string[] } | null>(null);

  // Handle media file selection (audio or video)
  const handleMediaFile = useCallback((file: File) => {
    setError(null);
    setMediaFileName(file.name);

    const ext = file.name.toLowerCase().split('.').pop() || '';

    if (VIDEO_EXTENSIONS.includes(ext)) {
      // Wait for videoRef to be available
      setTimeout(() => {
        if (videoRef.current) {
          loadVideo(file, videoRef.current);
        }
      }, 0);
    } else {
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
        const result = parseCSV(text, schema);
        setTranscriptData(result.data);
        setTranscriptFileName(file.name);
        setCurrentIndex(-1); // Start with no selection

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
    link.download = transcriptFileName
      ? transcriptFileName.replace('.csv', '_annotated.csv')
      : 'annotated_transcript.csv';
    link.click();

    URL.revokeObjectURL(url);
  }, [transcriptData, schema, transcriptFileName]);

  const maxTurnId = transcriptData.length > 0
    ? Math.max(...transcriptData.map(r => r.turn_id))
    : 0;

  const hasMedia = mediaState.isLoaded;

  return (
    <DropZone onAudioDrop={handleMediaFile} onTranscriptDrop={handleTranscriptFile}>
      <div className="h-[calc(100vh-64px)] bg-gray-900 text-white flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="flex items-center justify-end gap-4">
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
          </div>
        </header>

        {/* Tip Banner - Right under navbar */}
        <div className="bg-gray-800/50 border-b border-gray-700 px-4 py-2 text-sm text-gray-400">
          Tip: Set up schema first, then load CSV. Press Space to play/pause. Drag files onto the window.
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

        {/* Load Info Banner */}
        {loadInfo && (
          <div className="bg-blue-900/30 border-b border-blue-700 px-4 py-2 text-blue-200 text-sm">
            <div className="flex items-center gap-4">
              {loadInfo.matched.length > 0 && (
                <span className="flex items-center gap-1">
                  <CheckCircle size={14} className="text-green-400" />
                  Loaded from CSV: {loadInfo.matched.join(', ')}
                </span>
              )}
              {loadInfo.new.length > 0 && (
                <span className="flex items-center gap-1">
                  <AlertCircle size={14} className="text-yellow-400" />
                  Created new: {loadInfo.new.join(', ')}
                </span>
              )}
              <button
                onClick={() => setLoadInfo(null)}
                className="ml-auto text-blue-400 hover:text-blue-200"
              >
                Dismiss
              </button>
            </div>
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
          <div className="flex items-center justify-end">
            <span className="text-gray-600">
              Required CSV columns: <code className="text-gray-400 bg-gray-900 px-1 rounded">turn_id, speaker, start, end, utterance</code>
            </span>
          </div>
        </footer>
      </div>
    </DropZone>
  );
}
