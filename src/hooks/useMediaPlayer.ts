'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { AudioState } from '@/types';

export type MediaType = 'audio' | 'video' | null;

export interface MediaState extends AudioState {
  mediaType: MediaType;
}

export function useMediaPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mediaState, setMediaState] = useState<MediaState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.7,
    isLoaded: false,
    mediaType: null,
  });

  const getActiveMedia = useCallback((): HTMLMediaElement | null => {
    return mediaState.mediaType === 'video' ? videoRef.current : audioRef.current;
  }, [mediaState.mediaType]);

  const setupMediaEvents = useCallback((media: HTMLMediaElement, type: MediaType) => {
    media.addEventListener('loadedmetadata', () => {
      setMediaState(prev => ({
        ...prev,
        duration: media.duration,
        isLoaded: true,
        currentTime: 0,
        mediaType: type,
      }));
    });

    media.addEventListener('timeupdate', () => {
      setMediaState(prev => ({
        ...prev,
        currentTime: media.currentTime,
      }));
    });

    media.addEventListener('ended', () => {
      setMediaState(prev => ({
        ...prev,
        isPlaying: false,
        currentTime: 0,
      }));
    });

    media.addEventListener('play', () => {
      setMediaState(prev => ({ ...prev, isPlaying: true }));
    });

    media.addEventListener('pause', () => {
      setMediaState(prev => ({ ...prev, isPlaying: false }));
    });
  }, []);

  const loadAudio = useCallback((file: File) => {
    // Cleanup previous
    if (audioRef.current) {
      URL.revokeObjectURL(audioRef.current.src);
    }
    if (videoRef.current) {
      URL.revokeObjectURL(videoRef.current.src);
      videoRef.current = null;
    }

    const audio = new Audio();
    const url = URL.createObjectURL(file);
    audio.src = url;
    audio.volume = mediaState.volume;

    setupMediaEvents(audio, 'audio');
    audioRef.current = audio;
  }, [mediaState.volume, setupMediaEvents]);

  const loadVideo = useCallback((file: File, videoElement: HTMLVideoElement) => {
    // Cleanup previous
    if (audioRef.current) {
      URL.revokeObjectURL(audioRef.current.src);
      audioRef.current = null;
    }
    if (videoRef.current) {
      URL.revokeObjectURL(videoRef.current.src);
    }

    const url = URL.createObjectURL(file);
    videoElement.src = url;
    videoElement.volume = mediaState.volume;

    setupMediaEvents(videoElement, 'video');
    videoRef.current = videoElement;
  }, [mediaState.volume, setupMediaEvents]);

  const play = useCallback(() => {
    const media = getActiveMedia();
    if (media) {
      media.play();
    }
  }, [getActiveMedia]);

  const pause = useCallback(() => {
    const media = getActiveMedia();
    if (media) {
      media.pause();
    }
  }, [getActiveMedia]);

  const togglePlayPause = useCallback(() => {
    const media = getActiveMedia();
    if (media) {
      if (media.paused) {
        media.play();
      } else {
        media.pause();
      }
    }
  }, [getActiveMedia]);

  const stop = useCallback(() => {
    const media = getActiveMedia();
    if (media) {
      media.pause();
      media.currentTime = 0;
      setMediaState(prev => ({
        ...prev,
        isPlaying: false,
        currentTime: 0,
      }));
    }
  }, [getActiveMedia]);

  const seek = useCallback((time: number) => {
    const media = getActiveMedia();
    if (media) {
      media.currentTime = Math.max(0, Math.min(time, media.duration));
    }
  }, [getActiveMedia]);

  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    const media = getActiveMedia();
    if (media) {
      media.volume = clampedVolume;
    }
    setMediaState(prev => ({ ...prev, volume: clampedVolume }));
  }, [getActiveMedia]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }
      if (videoRef.current) {
        videoRef.current.pause();
        URL.revokeObjectURL(videoRef.current.src);
      }
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
    mediaState,
    loadAudio,
    loadVideo,
    play,
    pause,
    togglePlayPause,
    stop,
    seek,
    setVolume,
  };
}
