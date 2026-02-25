'use client';

import { useRef } from 'react';
import { Upload, FileAudio, FileText, FileVideo } from 'lucide-react';

interface FileUploadProps {
  type: 'audio' | 'video' | 'media' | 'transcript';
  fileName: string | null;
  onFileSelect: (file: File) => void;
  accept: string;
}

export function FileUpload({ type, fileName, onFileSelect, accept }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'video': return FileVideo;
      case 'audio': return FileAudio;
      case 'media': return FileVideo;
      default: return FileText;
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'video': return 'Load Video File';
      case 'audio': return 'Load Audio File';
      case 'media': return 'Load Media File';
      default: return 'Load Transcript CSV';
    }
  };

  const Icon = getIcon();
  const label = getLabel();

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      <button
        onClick={handleClick}
        className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm"
      >
        <Icon size={18} />
        <span>{label}</span>
      </button>
      {fileName && (
        <p className="mt-1 text-xs text-gray-400 truncate max-w-[200px]" title={fileName}>
          {fileName}
        </p>
      )}
    </div>
  );
}

interface DropZoneProps {
  onAudioDrop?: (file: File) => void;
  onTranscriptDrop: (file: File) => void;
  children: React.ReactNode;
}

export function DropZone({ onAudioDrop, onTranscriptDrop, children }: DropZoneProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    const audioExtensions = ['wav', 'mp3', 'ogg', 'webm', 'm4a', 'aac'];
    const videoExtensions = ['mp4', 'webm', 'mov', 'avi', 'mkv'];

    for (const file of files) {
      const ext = file.name.toLowerCase().split('.').pop();

      if (ext === 'csv') {
        onTranscriptDrop(file);
      } else if (onAudioDrop && (audioExtensions.includes(ext || '') || videoExtensions.includes(ext || ''))) {
        onAudioDrop(file);
      }
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="min-h-screen"
    >
      {children}
    </div>
  );
}
