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

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Deploying to Vercel

### Option 1: Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd web
vercel
```

### Option 2: Deploy via GitHub

1. Push this `web` folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js and configure the build
6. Click "Deploy"

### Option 3: Deploy from this folder

1. Go to [vercel.com/new](https://vercel.com/new)
2. Drag and drop the `web` folder
3. Vercel will handle the rest

## CSV Format

Your transcript CSV should include these required columns:

| Column | Type | Description |
|--------|------|-------------|
| turn_id | integer | Unique identifier for each utterance |
| username | string | Speaker identifier (e.g., "S1", "S2") |
| start | float | Start time in seconds |
| end | float | End time in seconds |
| utterance | string | The spoken text |

### Example CSV

```csv
turn_id,username,start,end,utterance
1,S1,0.0,2.5,"Hello, how are you?"
2,S2,3.0,5.2,"I'm doing well, thanks!"
3,S1,6.1,8.9,"That's great to hear."
```

## Supported Audio Formats

- WAV
- MP3
- OGG
- WebM
- M4A
- AAC

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Audio**: HTML5 Audio API
