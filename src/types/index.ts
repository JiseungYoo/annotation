// Required columns that must exist in CSV
export const REQUIRED_COLUMNS = ['turn_id', 'speaker', 'start', 'end', 'utterance'] as const;

// Optional base columns that are preserved if present
export const OPTIONAL_BASE_COLUMNS = [
  'clean_utterance',
  'start_ts',
  'end_ts',
  'words',
  'n_utterances',
  'length_seconds',
  'backchannel',
  'prev_turn_gap',
] as const;

// Schema column definition
export interface SchemaColumn {
  id: string;    // unique id like "col_1", "col_2"
  name: string;  // display name like "general praise"
}

// Array of 1-6 schema columns
export type AnnotationSchema = SchemaColumn[];

// Transcript row with dynamic annotations
export interface TranscriptRow {
  // Required columns
  turn_id: number;
  speaker: string;
  start: number;
  end: number;
  utterance: string;
  // Optional base columns
  clean_utterance?: string;
  start_ts?: string;
  end_ts?: string;
  words?: number;
  n_utterances?: number;
  length_seconds?: number;
  backchannel?: string;
  prev_turn_gap?: number;
  // Dynamic annotations: { "col_1": "value", "col_2": "value", ... }
  annotations: Record<string, string>;
}

export interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLoaded: boolean;
}

// Default schema with 3 columns
export const DEFAULT_SCHEMA: AnnotationSchema = [
  { id: 'col_1', name: 'Ann1' },
  { id: 'col_2', name: 'Ann2' },
  { id: 'col_3', name: 'Ann3' },
];

export const MAX_SCHEMA_COLUMNS = 6;
export const MIN_SCHEMA_COLUMNS = 1;
