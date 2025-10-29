/**
 * TypeScript interfaces for OEIS JSON API responses
 * Based on: https://oeis.org/wiki/JSON_Format,_Compressed_Files
 */

/**
 * Raw OEIS sequence data as returned by the JSON API
 * Example: https://oeis.org/search?q=id:A000045&fmt=json
 */
export interface OEISRawData {
  /** Sequence number (e.g., 45 for A000045) */
  number: number;

  /** Old ID format (e.g., "M0692 N0256") */
  id?: string;

  /** Comma-separated sequence values */
  data: string;

  /** Sequence name/description */
  name: string;

  /** Array of comment lines */
  comment?: string[];

  /** Array of reference lines */
  reference?: string[];

  /** Array of link lines */
  link?: string[];

  /** Array of formula lines */
  formula?: string[];

  /** Array of example lines */
  example?: string[];

  /** Maple code */
  maple?: string[];

  /** Mathematica code */
  mathematica?: string[];

  /** Other program code (Python, etc.) */
  program?: string[];

  /** Cross-references to other sequences */
  xref?: string[];

  /** Keywords (e.g., "nonn", "easy", "core") */
  keyword?: string[];

  /** Offset information */
  offset?: string;

  /** Author information */
  author?: string;

  /** Extension information */
  ext?: string[];

  /** Time when the sequence was created/updated */
  time?: string;

  /** Date when the sequence was created */
  created?: string;
}

/**
 * OEIS API response format
 */
export interface OEISResponse {
  /** Greeting message */
  greeting?: string;

  /** Query that was executed */
  query?: string;

  /** Number of results returned */
  count?: number;

  /** Starting index */
  start?: number;

  /** Array of sequences (empty array if no results) */
  results?: OEISRawData[];
}

/**
 * Computed metadata about a sequence
 */
export interface SequenceMetadata {
  /** Formatted A-number (e.g., "A000045") */
  aNumber: string;

  /** Number of data points */
  dataPoints: number;

  /** Minimum value in the sequence */
  minValue: number;

  /** Maximum value in the sequence */
  maxValue: number;

  /** Parsed keywords */
  keywords: string[];

  /** Whether the sequence is signed (contains negative numbers) */
  isSigned: boolean;

  /** Whether all values are non-negative */
  isNonNegative: boolean;

  /** Offset values [first index, first value > 1] */
  offset: [number, number] | null;

  /** Date when the sequence was created (from OEIS) */
  created?: string;

  /** Mean/average value of the sequence */
  mean?: number;

  /** Number of values in sequence */
  count: number;
}
