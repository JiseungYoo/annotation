'use client';

import { AudioState } from '@/types';
import { formatTime } from '@/utils/formatTime';
import { Play, Pause, Square, Volume2, VolumeX } from 'lucide-react';

interface AudioControlsProps {
  audioState: AudioState;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
}

export function AudioControls({
  audioState,
  onPlay,
  onPause,
  onStop,
  onSeek,
  onVolumeChange,
}: AudioControlsProps) {
  const { isPlaying, currentTime, duration, volume, isLoaded } = audioState;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isLoaded) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    onSeek(percentage * duration);
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-4">
      {/* Progress Bar */}
      <div
        className={`h-2 bg-gray-700 rounded-full overflow-hidden ${isLoaded ? 'cursor-pointer' : 'cursor-not-allowed'}`}
        onClick={handleProgressClick}
      >
        <div
          className="h-full bg-blue-500 transition-all duration-100"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Time Display */}
      <div className="flex justify-between text-sm text-gray-400">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Play/Pause Button */}
          <button
            onClick={isPlaying ? onPause : onPlay}
            disabled={!isLoaded}
            className={`p-3 rounded-full ${
              isLoaded
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            } transition-colors`}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>

          {/* Stop Button */}
          <button
            onClick={onStop}
            disabled={!isLoaded}
            className={`p-2 rounded-full ${
              isLoaded
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            } transition-colors`}
          >
            <Square size={20} />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onVolumeChange(volume > 0 ? 0 : 0.7)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-24 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-blue-500
              [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <span className="text-sm text-gray-400 w-12 text-right">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
