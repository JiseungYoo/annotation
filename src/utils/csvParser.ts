import { TranscriptRow, AnnotationSchema, REQUIRED_COLUMNS } from '@/types';

export interface ParseResult {
  data: TranscriptRow[];
  matchedColumns: string[];  // Schema columns that were found in CSV
  newColumns: string[];      // Schema columns that were not found (created as empty)
}

export function parseCSV(csvText: string, schema: AnnotationSchema): ParseResult {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) {
    return { data: [], matchedColumns: [], newColumns: [] };
  }

  // Parse header
  const header = parseCSVLine(lines[0]);
  const headerMap: Record<string, number> = {};
  const headerNamesLower: Record<string, string> = {}; // lowercase -> original case

  header.forEach((col, index) => {
    const lowerCol = col.toLowerCase().trim();
    headerMap[lowerCol] = index;
    headerNamesLower[lowerCol] = col.trim();
  });

  // Required columns check
  for (const col of REQUIRED_COLUMNS) {
    if (!(col in headerMap)) {
      throw new Error(`Missing required column: ${col}`);
    }
  }

  // Match schema columns to CSV headers (case-insensitive)
  const matchedColumns: string[] = [];
  const newColumns: string[] = [];
  const schemaColumnMap: Record<string, number | null> = {}; // schema col id -> csv column index

  for (const col of schema) {
    const lowerName = col.name.toLowerCase();
    if (lowerName in headerMap) {
      schemaColumnMap[col.id] = headerMap[lowerName];
      matchedColumns.push(col.name);
    } else {
      schemaColumnMap[col.id] = null;
      newColumns.push(col.name);
    }
  }

  // Parse data rows
  const data: TranscriptRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCSVLine(line);

    // Build annotations object
    const annotations: Record<string, string> = {};
    for (const col of schema) {
      const csvIndex = schemaColumnMap[col.id];
      if (csvIndex !== null && values[csvIndex] !== undefined) {
        annotations[col.id] = values[csvIndex] || '';
      } else {
        annotations[col.id] = '';
      }
    }

    const row: TranscriptRow = {
      turn_id: parseInt(values[headerMap['turn_id']] || '0', 10),
      speaker: values[headerMap['speaker']] || '',
      start: parseFloat(values[headerMap['start']] || '0'),
      end: parseFloat(values[headerMap['end']] || '0'),
      utterance: values[headerMap['utterance']] || '',
      clean_utterance: headerMap['clean_utterance'] !== undefined ? values[headerMap['clean_utterance']] : undefined,
      start_ts: headerMap['start_ts'] !== undefined ? values[headerMap['start_ts']] : undefined,
      end_ts: headerMap['end_ts'] !== undefined ? values[headerMap['end_ts']] : undefined,
      words: headerMap['words'] !== undefined ? parseInt(values[headerMap['words']] || '0', 10) : undefined,
      n_utterances: headerMap['n_utterances'] !== undefined ? parseInt(values[headerMap['n_utterances']] || '0', 10) : undefined,
      length_seconds: headerMap['length_seconds'] !== undefined ? parseFloat(values[headerMap['length_seconds']] || '0') : undefined,
      backchannel: headerMap['backchannel'] !== undefined ? values[headerMap['backchannel']] : undefined,
      prev_turn_gap: headerMap['prev_turn_gap'] !== undefined ? parseFloat(values[headerMap['prev_turn_gap']] || '0') : undefined,
      annotations,
    };

    data.push(row);
  }

  return {
    data: data.sort((a, b) => a.turn_id - b.turn_id),
    matchedColumns,
    newColumns,
  };
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        current += '"';
        i++; // Skip next quote
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
  }

  result.push(current.trim());
  return result;
}

export function exportToCSV(data: TranscriptRow[], schema: AnnotationSchema): string {
  if (data.length === 0) return '';

  // Build header
  const baseHeaders = [
    'turn_id', 'speaker', 'start', 'end', 'utterance', 'clean_utterance',
    'start_ts', 'end_ts', 'words', 'n_utterances', 'length_seconds',
    'backchannel', 'prev_turn_gap'
  ];

  const annotationHeaders = schema.map(col => col.name);
  const headers = [...baseHeaders, ...annotationHeaders];

  // Build rows
  const rows = data.map(row => {
    const baseValues = [
      row.turn_id.toString(),
      escapeCSV(row.speaker),
      row.start.toString(),
      row.end.toString(),
      escapeCSV(row.utterance),
      escapeCSV(row.clean_utterance || ''),
      escapeCSV(row.start_ts || ''),
      escapeCSV(row.end_ts || ''),
      row.words?.toString() || '',
      row.n_utterances?.toString() || '',
      row.length_seconds?.toString() || '',
      escapeCSV(row.backchannel || ''),
      row.prev_turn_gap?.toString() || '',
    ];

    const annotationValues = schema.map(col => escapeCSV(row.annotations[col.id] || ''));

    return [...baseValues, ...annotationValues].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
