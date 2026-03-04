import { TranscriptRow, AnnotationSchema, REQUIRED_COLUMNS } from '@/types';

export interface ParseResult {
  data: TranscriptRow[];
  matchedColumns: string[];  // Schema columns that were found in CSV
  newColumns: string[];      // Schema columns that were not found (created as empty)
  originalColumnNames: string[];  // All column names from original CSV (for export)
}

/**
 * Parse timestamp string to seconds.
 * Supports formats:
 * - M:SS:ms (e.g., "0:02:00" = 2.0 seconds, "1:30:50" = 90.5 seconds)
 * - Numeric seconds (e.g., "120.5")
 */
function parseTimestamp(value: string): number {
  if (!value || value.trim() === '') return 0;

  const trimmed = value.trim();

  // Check if it's a timestamp format (contains colons)
  if (trimmed.includes(':')) {
    const parts = trimmed.split(':');
    if (parts.length === 3) {
      // M:SS:ms format
      const minutes = parseInt(parts[0], 10) || 0;
      const seconds = parseInt(parts[1], 10) || 0;
      const milliseconds = parseInt(parts[2], 10) || 0;
      return minutes * 60 + seconds + milliseconds / 100;
    } else if (parts.length === 2) {
      // M:SS format (no milliseconds)
      const minutes = parseInt(parts[0], 10) || 0;
      const seconds = parseInt(parts[1], 10) || 0;
      return minutes * 60 + seconds;
    }
  }

  // Fallback: try to parse as numeric seconds
  return parseFloat(trimmed) || 0;
}

export function parseCSV(csvText: string, schema: AnnotationSchema): ParseResult {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) {
    return { data: [], matchedColumns: [], newColumns: [], originalColumnNames: [] };
  }

  // Parse header - preserve original column names and order
  const header = parseCSVLine(lines[0]);
  const originalColumnNames = header.map(col => col.trim());
  const headerMap: Record<string, number> = {};

  header.forEach((col, index) => {
    const lowerCol = col.toLowerCase().trim();
    headerMap[lowerCol] = index;
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
  const schemaColumnNames = new Set(schema.map(col => col.name.toLowerCase()));

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

    // Build annotations object from schema columns
    const annotations: Record<string, string> = {};
    for (const col of schema) {
      const csvIndex = schemaColumnMap[col.id];
      if (csvIndex !== null && values[csvIndex] !== undefined) {
        annotations[col.id] = values[csvIndex] || '';
      } else {
        annotations[col.id] = '';
      }
    }

    // Build originalColumns object - all columns except required and schema columns
    const originalColumns: Record<string, string> = {};
    for (let j = 0; j < originalColumnNames.length; j++) {
      const colName = originalColumnNames[j];
      const lowerColName = colName.toLowerCase();
      // Skip required columns (they're stored as typed fields)
      // Skip schema columns (they're stored in annotations)
      if (!REQUIRED_COLUMNS.includes(lowerColName as typeof REQUIRED_COLUMNS[number]) &&
          !schemaColumnNames.has(lowerColName)) {
        originalColumns[colName] = values[j] || '';
      }
    }

    const row: TranscriptRow = {
      turn_id: parseInt(values[headerMap['turn_id']] || '0', 10),
      speaker: values[headerMap['speaker']] || '',
      start: parseTimestamp(values[headerMap['start']] || '0'),
      end: parseTimestamp(values[headerMap['end']] || '0'),
      utterance: values[headerMap['utterance']] || '',
      originalColumns,
      annotations,
    };

    data.push(row);
  }

  return {
    data: data.sort((a, b) => a.turn_id - b.turn_id),
    matchedColumns,
    newColumns,
    originalColumnNames,
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

export function exportToCSV(
  data: TranscriptRow[],
  schema: AnnotationSchema,
  originalColumnNames?: string[]
): string {
  if (data.length === 0) return '';

  // Required columns always come first
  const requiredHeaders = ['turn_id', 'speaker', 'start', 'end', 'utterance'];

  // Get all original column names (excluding required and schema columns)
  const schemaColumnNamesLower = new Set(schema.map(col => col.name.toLowerCase()));
  const requiredLower = new Set(requiredHeaders.map(h => h.toLowerCase()));

  // Determine extra columns to include (from originalColumns in data)
  // Use originalColumnNames order if provided, otherwise collect from data
  let extraColumnNames: string[] = [];
  if (originalColumnNames && originalColumnNames.length > 0) {
    extraColumnNames = originalColumnNames.filter(col => {
      const lower = col.toLowerCase();
      return !requiredLower.has(lower) && !schemaColumnNamesLower.has(lower);
    });
  } else if (data.length > 0 && data[0].originalColumns) {
    extraColumnNames = Object.keys(data[0].originalColumns);
  }

  // Annotation headers from schema
  const annotationHeaders = schema.map(col => col.name);

  // Final header order: required + extra original columns + annotation columns
  const headers = [...requiredHeaders, ...extraColumnNames, ...annotationHeaders];

  // Build rows
  const rows = data.map(row => {
    // Required values
    const requiredValues = [
      row.turn_id.toString(),
      escapeCSV(row.speaker),
      row.start.toString(),
      row.end.toString(),
      escapeCSV(row.utterance),
    ];

    // Extra original column values
    const extraValues = extraColumnNames.map(colName =>
      escapeCSV(row.originalColumns?.[colName] || '')
    );

    // Annotation values
    const annotationValues = schema.map(col => escapeCSV(row.annotations[col.id] || ''));

    return [...requiredValues, ...extraValues, ...annotationValues].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
