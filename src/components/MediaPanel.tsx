'use client';

import { forwardRef } from 'react';
import { FileVideo, FileAudio, Play, Pause, Square, Volume2, VolumeX } from 'lucide-react';
import { formatTime } from '@/utils/formatTime';

interface MediaPanelProps {
  mediaType: 'audio' | 'video' | null;
  fileName: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLoaded: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
}

export const MediaPanel = forwardRef<HTMLVideoElement, MediaPanelProps>(
  function MediaPanel({
    mediaType,
    fileName,
    isPlaying,
    currentTime,
    duration,
    volume,
    isLoaded,
    onPlay,
    onPause,
    onStop,
    onSeek,
    onVolumeChange,
  }, ref) {

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isLoaded) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      onSeek(percentage * duration);
    };

    const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

    const PlaybackControls = () => (
      <div className="p-3 bg-gray-800/90 space-y-2">
        {/* Progress Bar */}
        <div
          className={`h-1.5 bg-gray-700 rounded-full overflow-hidden ${isLoaded ? 'cursor-pointer' : 'cursor-not-allowed'}`}
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-blue-500 transition-all duration-100"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {/* Play/Pause Button */}
            <button
              onClick={isPlaying ? onPause : onPlay}
              disabled={!isLoaded}
              className={`p-2 rounded-full ${
                isLoaded
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              } transition-colors`}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>

            {/* Stop Button */}
            <button
              onClick={onStop}
              disabled={!isLoaded}
              className={`p-1.5 rounded-full ${
                isLoaded
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              } transition-colors`}
            >
              <Square size={14} />
            </button>

            {/* Time Display */}
            <span className="text-xs text-gray-400 ml-2">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onVolumeChange(volume > 0 ? 0 : 0.7)}
              className="p-1 text-gray-400 hover:text-white transition-colors"
            >
              {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-16 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-3
                [&::-webkit-slider-thumb]:h-3
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-blue-500
                [&::-webkit-slider-thumb]:cursor-pointer"
            />
          </div>
        </div>
      </div>
    );

    if (!mediaType) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-gray-500 p-4">
          <FileVideo size={48} className="mb-2 opacity-50" />
          <p className="text-sm text-center">Load a media file to display here</p>
        </div>
      );
    }

    if (mediaType === 'audio') {
      return (
        <div className="h-full flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-4">
            <FileAudio size={48} className="mb-3 opacity-70" />
            <p className="text-sm font-medium truncate max-w-full px-2">{fileName || 'Audio file'}</p>
          </div>
          <PlaybackControls />
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col bg-black relative">
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <video
            ref={ref}
            className="max-w-full max-h-full object-contain"
            playsInline
          />
        </div>
        <PlaybackControls />
      </div>
    );
  }
);
