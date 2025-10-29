/**
 * Sequence class - Represents integer sequences from OEIS or computed locally
 *
 * Data sources:
 * 1. OEIS - Fetched from the Online Encyclopedia of Integer Sequences
 * 2. Computed - Derived from other sequences (e.g., differences, accumulation, ratios)
 */

import type { OEISRawData, SequenceMetadata } from './OEISTypes';

/**
 * Types of computations that can generate sequences
 */
export type ComputationType =
  | 'forward_difference'    // Discrete derivative: a(n) = b(n+1) - b(n)
  | 'backward_difference'   // a(n) = b(n) - b(n-1)
  | 'accumulation'          // Discrete integral: a(n) = sum(b(0)...b(n))
  | 'ratio'                 // a(n) = b(n+1) / b(n)
  | 'absolute'              // a(n) = |b(n)|
  | 'scale'                 // a(n) = k * b(n)
  | 'offset'                // a(n) = b(n + k)
  | 'custom';               // User-defined computation

/**
 * Metadata about how a sequence was computed
 */
export interface ComputationMetadata {
  /** Type of computation */
  type: ComputationType;

  /** Source sequence(s) this was derived from */
  sourceSequences: string[];  // A-numbers or IDs

  /** Description of the computation */
  description: string;

  /** Additional parameters (e.g., scale factor, offset amount) */
  parameters?: Record<string, number | string>;

  /** Timestamp when computed */
  computedAt: Date;
}

/**
 * Source of sequence data
 */
export type SequenceSource = 'oeis' | 'computed';

/**
 * Main Sequence class
 */
export class Sequence {
  /** Unique identifier (A-number for OEIS, generated ID for computed) */
  readonly id: string;

  /** Data source type */
  readonly source: SequenceSource;

  /** Name/description of the sequence */
  readonly name: string;

  /** Numeric sequence values */
  readonly values: number[];

  /** Raw OEIS data (if from OEIS) */
  readonly oeisData?: OEISRawData;

  /** Computation metadata (if computed) */
  readonly computation?: ComputationMetadata;

  /** Cached metadata */
  private _metadata?: SequenceMetadata;

  /**
   * Private constructor - use static factory methods instead
   */
  private constructor(
    id: string,
    source: SequenceSource,
    name: string,
    values: number[],
    oeisData?: OEISRawData,
    computation?: ComputationMetadata
  ) {
    this.id = id;
    this.source = source;
    this.name = name;
    this.values = values;
    this.oeisData = oeisData;
    this.computation = computation;
  }

  /**
   * Create a Sequence from OEIS JSON data
   */
  static fromOEIS(data: OEISRawData): Sequence {
    const aNumber = `A${String(data.number).padStart(6, '0')}`;
    const values = Sequence.parseDataString(data.data);

    return new Sequence(
      aNumber,
      'oeis',
      data.name,
      values,
      data,
      undefined
    );
  }

  /**
   * Create a computed sequence
   */
  static fromComputation(
    name: string,
    values: number[],
    computation: ComputationMetadata
  ): Sequence {
    // Generate a unique ID for computed sequences
    const id = `COMP_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

    return new Sequence(
      id,
      'computed',
      name,
      values,
      undefined,
      computation
    );
  }

  /**
   * Create a custom sequence with explicit values
   */
  static fromValues(
    name: string,
    values: number[],
    id?: string
  ): Sequence {
    const sequenceId = id || `CUSTOM_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

    return new Sequence(
      sequenceId,
      'computed',
      name,
      values,
      undefined,
      {
        type: 'custom',
        sourceSequences: [],
        description: 'Custom sequence',
        computedAt: new Date(),
      }
    );
  }

  /**
   * Parse OEIS data string into numeric array
   * Format: "1,1,2,3,5,8,13,21,34"
   */
  private static parseDataString(dataStr: string): number[] {
    return dataStr
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .map(s => {
        // Handle negative numbers
        const num = parseInt(s, 10);
        if (isNaN(num)) {
          console.warn(`Failed to parse value: "${s}"`);
          return 0;
        }
        return num;
      });
  }

  /**
   * Get computed metadata about the sequence
   */
  get metadata(): SequenceMetadata {
    if (this._metadata) {
      return this._metadata;
    }

    const values = this.values;
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const isSigned = values.some(v => v < 0);
    const isNonNegative = values.every(v => v >= 0);

    // Parse offset if available
    let offset: [number, number] | null = null;
    if (this.oeisData?.offset) {
      const parts = this.oeisData.offset.split(',').map(s => parseInt(s.trim(), 10));
      if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        offset = [parts[0], parts[1]];
      }
    }

    // Calculate mean
    const sum = values.reduce((acc, val) => acc + val, 0);
    const mean = values.length > 0 ? sum / values.length : undefined;

    this._metadata = {
      aNumber: this.id,
      dataPoints: values.length,
      minValue,
      maxValue,
      keywords: this.oeisData?.keyword || [],
      isSigned,
      isNonNegative,
      offset,
      created: this.oeisData?.created,
      mean,
      count: values.length,
    };

    return this._metadata;
  }

  /**
   * Get formatted A-number (for display)
   */
  get displayId(): string {
    if (this.source === 'oeis') {
      return this.id;
    }
    return `[${this.computation?.type || 'computed'}]`;
  }

  /**
   * Get a slice of the sequence values
   */
  slice(start: number, end?: number): number[] {
    return this.values.slice(start, end);
  }

  /**
   * Get value at specific index (0-based)
   */
  at(index: number): number | undefined {
    return this.values[index];
  }

  /**
   * Get the length of the sequence
   */
  get length(): number {
    return this.values.length;
  }

  /**
   * Check if this is an OEIS sequence
   */
  get isOEIS(): boolean {
    return this.source === 'oeis';
  }

  /**
   * Check if this is a computed sequence
   */
  get isComputed(): boolean {
    return this.source === 'computed';
  }

  /**
   * Export sequence to JSON
   */
  toJSON(): object {
    return {
      id: this.id,
      source: this.source,
      name: this.name,
      values: this.values,
      oeisData: this.oeisData,
      computation: this.computation,
      metadata: this.metadata,
    };
  }

  /**
   * Export values as CSV string
   */
  toCSV(): string {
    return this.values.join(',');
  }

  /**
   * Get OEIS URL (if applicable)
   */
  get oeisUrl(): string | null {
    if (this.source !== 'oeis') {
      return null;
    }
    return `https://oeis.org/${this.id}`;
  }

  /**
   * Get specific OEIS field
   */
  getOEISField(field: keyof OEISRawData): any {
    return this.oeisData?.[field];
  }

  /**
   * Check if sequence has a specific keyword
   */
  hasKeyword(keyword: string): boolean {
    return this.metadata.keywords.includes(keyword);
  }

  /**
   * Get a human-readable description of the computation (if computed)
   */
  get computationDescription(): string | null {
    if (!this.computation) {
      return null;
    }

    const { type, sourceSequences, description, parameters } = this.computation;

    switch (type) {
      case 'forward_difference':
        return `Forward differences of ${sourceSequences.join(', ')}`;
      case 'backward_difference':
        return `Backward differences of ${sourceSequences.join(', ')}`;
      case 'accumulation':
        return `Accumulation of ${sourceSequences.join(', ')}`;
      case 'ratio':
        return `Ratios of consecutive terms of ${sourceSequences.join(', ')}`;
      case 'absolute':
        return `Absolute values of ${sourceSequences.join(', ')}`;
      case 'scale':
        return `${sourceSequences.join(', ')} scaled by ${parameters?.factor || 1}`;
      case 'offset':
        return `${sourceSequences.join(', ')} offset by ${parameters?.offset || 0}`;
      case 'custom':
      default:
        return description;
    }
  }

  /**
   * Create a string representation for debugging
   */
  toString(): string {
    const preview = this.values.slice(0, 10).join(', ');
    const more = this.values.length > 10 ? '...' : '';
    return `Sequence(${this.displayId}: ${this.name}) [${preview}${more}]`;
  }
}
