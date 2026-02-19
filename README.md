# Audio Transcript Player (Web Version)

A web-based audio player for analyzing conversations with synchronized transcript viewing and annotation capabilities. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Audio Playback**: Play, pause, stop with keyboard shortcuts (Space to play/pause)
- **Volume Control**: Adjustable volume slider with mute toggle
- **Progress Bar**: Click to seek to any position
- **CSV Transcript Loading**: Upload timestamped conversation transcripts
- **Real-time Sync**: Current utterance highlights automatically during playback
- **Turn-Based Navigation**: Jump to specific utterances by turn ID
- **Interactive Annotations**: Click-to-edit annotation fields with Tab navigation
- **Custom Column Names**: Rename annotation columns
- **Export Annotations**: Download annotated data as CSV
- **Resizable Panels**: Drag divider between transcript and annotation panels
- **Drag & Drop**: Drop audio/CSV files directly onto the window

## Recommended File Formats & Sizes

### Audio/Video Formats (Recommended)

- **MP3 (.mp3)** - Best for audio files, highly compressed, fast processing
- **MP4 (.mp4)** - Best for video files, widely supported, efficient compression
- Also supported: WAV, OGG, WebM, M4A, AAC, MOV, AVI, MKV

### File Size Recommendations

- **For optimal performance**: Keep files under 500 MB
- **Maximum recommended**: 1 GB
- **Note**: Large files (over 1 GB) may cause slow processing or browser performance issues as all data is processed in-browser memory

### CSV Transcript Files

- Keep CSV files under 10 MB for best performance
- Large transcripts with thousands of rows may cause UI lag
## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Audio**: HTML5 Audio API
