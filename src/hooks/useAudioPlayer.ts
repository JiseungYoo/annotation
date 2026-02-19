'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { AudioState } from '@/types';

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.7,
    isLoaded: false,
  });

  const loadAudio = useCallback((file: File) => {
    if (audioRef.current) {
      URL.revokeObjectURL(audioRef.current.src);
    }

    const audio = new Audio();
    const url = URL.createObjectURL(file);
    audio.src = url;
    audio.volume = audioState.volume;

    audio.addEventListener('loadedmetadata', () => {
      setAudioState(prev => ({
        ...prev,
        duration: audio.duration,
        isLoaded: true,
        currentTime: 0,
      }));
    });

    audio.addEventListener('timeupdate', () => {
      setAudioState(prev => ({
        ...prev,
        currentTime: audio.currentTime,
      }));
    });

    audio.addEventListener('ended', () => {
      setAudioState(prev => ({
        ...prev,
        isPlaying: false,
        currentTime: 0,
      }));
    });

    audio.addEventListener('play', () => {
      setAudioState(prev => ({ ...prev, isPlaying: true }));
    });

    audio.addEventListener('pause', () => {
      setAudioState(prev => ({ ...prev, isPlaying: false }));
    });

    audioRef.current = audio;
  }, [audioState.volume]);

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setAudioState(prev => ({
        ...prev,
        isPlaying: false,
        currentTime: 0,
      }));
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(time, audioRef.current.duration));
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
    setAudioState(prev => ({ ...prev, volume: clampedVolume }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if not in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayPause]);

  return {
    audioState,
    loadAudio,
    play,
    pause,
    togglePlayPause,
    stop,
    seek,
    setVolume,
  };
}
