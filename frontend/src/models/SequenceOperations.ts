/**
 * Operations for computing derived sequences
 * These will be used in the discrete calculus tab and other analysis features
 */

import { Sequence } from './Sequence';
import type { ComputationMetadata } from './Sequence';

/**
 * Compute forward differences (discrete derivative)
 * Result: a(n) = s(n+1) - s(n)
 *
 * Example: [1, 1, 2, 3, 5, 8] → [0, 1, 1, 2, 3]
 */
export function forwardDifference(sequence: Sequence): Sequence {
  const values = sequence.values;
  const differences: number[] = [];

  for (let i = 0; i < values.length - 1; i++) {
    differences.push(values[i + 1] - values[i]);
  }

  const metadata: ComputationMetadata = {
    type: 'forward_difference',
    sourceSequences: [sequence.id],
    description: `Forward differences of ${sequence.id}`,
    computedAt: new Date(),
  };

  return Sequence.fromComputation(
    `Forward differences of ${sequence.name}`,
    differences,
    metadata
  );
}

/**
 * Compute backward differences
 * Result: a(n) = s(n) - s(n-1)
 *
 * Example: [1, 1, 2, 3, 5, 8] → [0, 1, 1, 2, 3]
 */
export function backwardDifference(sequence: Sequence): Sequence {
  const values = sequence.values;
  const differences: number[] = [];

  for (let i = 1; i < values.length; i++) {
    differences.push(values[i] - values[i - 1]);
  }

  const metadata: ComputationMetadata = {
    type: 'backward_difference',
    sourceSequences: [sequence.id],
    description: `Backward differences of ${sequence.id}`,
    computedAt: new Date(),
  };

  return Sequence.fromComputation(
    `Backward differences of ${sequence.name}`,
    differences,
    metadata
  );
}

/**
 * Compute nth-order forward differences
 * Order 1 is the same as forwardDifference
 * Order 2 is differences of differences, etc.
 */
export function nthDifference(sequence: Sequence, order: number): Sequence {
  if (order < 1) {
    throw new Error('Order must be at least 1');
  }

  let current = sequence;
  for (let i = 0; i < order; i++) {
    current = forwardDifference(current);
  }

  // Update metadata to reflect the order
  const metadata: ComputationMetadata = {
    type: 'forward_difference',
    sourceSequences: [sequence.id],
    description: `${order}${getOrdinalSuffix(order)}-order forward differences of ${sequence.id}`,
    parameters: { order },
    computedAt: new Date(),
  };

  return Sequence.fromComputation(
    `${order}${getOrdinalSuffix(order)}-order forward differences of ${sequence.name}`,
    current.values,
    metadata
  );
}

/**
 * Compute accumulation (discrete integral / partial sums)
 * Result: a(n) = sum(s(0) + s(1) + ... + s(n))
 *
 * Example: [1, 1, 2, 3, 5] → [1, 2, 4, 7, 12]
 */
export function accumulation(sequence: Sequence): Sequence {
  const values = sequence.values;
  const sums: number[] = [];
  let sum = 0;

  for (const value of values) {
    sum += value;
    sums.push(sum);
  }

  const metadata: ComputationMetadata = {
    type: 'accumulation',
    sourceSequences: [sequence.id],
    description: `Partial sums of ${sequence.id}`,
    computedAt: new Date(),
  };

  return Sequence.fromComputation(
    `Partial sums of ${sequence.name}`,
    sums,
    metadata
  );
}

/**
 * Compute ratios of consecutive terms
 * Result: a(n) = s(n+1) / s(n)
 *
 * Useful for finding growth rates, convergence, etc.
 * Returns floating point values, rounded to specified precision
 */
export function ratios(
  sequence: Sequence,
  precision: number = 6
): Sequence {
  const values = sequence.values;
  const ratioValues: number[] = [];

  for (let i = 0; i < values.length - 1; i++) {
    if (values[i] === 0) {
      ratioValues.push(Infinity);
    } else {
      const ratio = values[i + 1] / values[i];
      ratioValues.push(Number(ratio.toFixed(precision)));
    }
  }

  const metadata: ComputationMetadata = {
    type: 'ratio',
    sourceSequences: [sequence.id],
    description: `Ratios a(n+1)/a(n) of ${sequence.id}`,
    parameters: { precision },
    computedAt: new Date(),
  };

  return Sequence.fromComputation(
    `Ratios of consecutive terms of ${sequence.name}`,
    ratioValues,
    metadata
  );
}

/**
 * Compute absolute values
 * Result: a(n) = |s(n)|
 */
export function absolute(sequence: Sequence): Sequence {
  const values = sequence.values.map(v => Math.abs(v));

  const metadata: ComputationMetadata = {
    type: 'absolute',
    sourceSequences: [sequence.id],
    description: `Absolute values of ${sequence.id}`,
    computedAt: new Date(),
  };

  return Sequence.fromComputation(
    `Absolute values of ${sequence.name}`,
    values,
    metadata
  );
}

/**
 * Scale sequence by a constant factor
 * Result: a(n) = k * s(n)
 */
export function scale(sequence: Sequence, factor: number): Sequence {
  const values = sequence.values.map(v => v * factor);

  const metadata: ComputationMetadata = {
    type: 'scale',
    sourceSequences: [sequence.id],
    description: `${sequence.id} scaled by ${factor}`,
    parameters: { factor },
    computedAt: new Date(),
  };

  return Sequence.fromComputation(
    `${sequence.name} × ${factor}`,
    values,
    metadata
  );
}

/**
 * Offset sequence by shifting indices
 * Result: a(n) = s(n + offset)
 *
 * Positive offset moves sequence left (earlier terms)
 * Negative offset moves sequence right (later terms, padded with initial value)
 */
export function offset(sequence: Sequence, offsetAmount: number): Sequence {
  let values: number[];

  if (offsetAmount > 0) {
    // Skip first offsetAmount terms
    values = sequence.values.slice(offsetAmount);
  } else if (offsetAmount < 0) {
    // Prepend offsetAmount copies of first term
    const padding = Array(-offsetAmount).fill(sequence.values[0] || 0);
    values = [...padding, ...sequence.values];
  } else {
    values = [...sequence.values];
  }

  const metadata: ComputationMetadata = {
    type: 'offset',
    sourceSequences: [sequence.id],
    description: `${sequence.id} offset by ${offsetAmount}`,
    parameters: { offset: offsetAmount },
    computedAt: new Date(),
  };

  return Sequence.fromComputation(
    `${sequence.name} (offset ${offsetAmount})`,
    values,
    metadata
  );
}

/**
 * Element-wise addition of two sequences
 * Result: a(n) = s1(n) + s2(n)
 *
 * Result length is minimum of both sequences
 */
export function add(seq1: Sequence, seq2: Sequence): Sequence {
  const length = Math.min(seq1.length, seq2.length);
  const values: number[] = [];

  for (let i = 0; i < length; i++) {
    values.push(seq1.values[i] + seq2.values[i]);
  }

  const metadata: ComputationMetadata = {
    type: 'custom',
    sourceSequences: [seq1.id, seq2.id],
    description: `${seq1.id} + ${seq2.id}`,
    computedAt: new Date(),
  };

  return Sequence.fromComputation(
    `${seq1.name} + ${seq2.name}`,
    values,
    metadata
  );
}

/**
 * Element-wise subtraction of two sequences
 * Result: a(n) = s1(n) - s2(n)
 */
export function subtract(seq1: Sequence, seq2: Sequence): Sequence {
  const length = Math.min(seq1.length, seq2.length);
  const values: number[] = [];

  for (let i = 0; i < length; i++) {
    values.push(seq1.values[i] - seq2.values[i]);
  }

  const metadata: ComputationMetadata = {
    type: 'custom',
    sourceSequences: [seq1.id, seq2.id],
    description: `${seq1.id} - ${seq2.id}`,
    computedAt: new Date(),
  };

  return Sequence.fromComputation(
    `${seq1.name} - ${seq2.name}`,
    values,
    metadata
  );
}

/**
 * Element-wise multiplication of two sequences
 * Result: a(n) = s1(n) * s2(n)
 */
export function multiply(seq1: Sequence, seq2: Sequence): Sequence {
  const length = Math.min(seq1.length, seq2.length);
  const values: number[] = [];

  for (let i = 0; i < length; i++) {
    values.push(seq1.values[i] * seq2.values[i]);
  }

  const metadata: ComputationMetadata = {
    type: 'custom',
    sourceSequences: [seq1.id, seq2.id],
    description: `${seq1.id} × ${seq2.id}`,
    computedAt: new Date(),
  };

  return Sequence.fromComputation(
    `${seq1.name} × ${seq2.name}`,
    values,
    metadata
  );
}

/**
 * Helper function to get ordinal suffix (1st, 2nd, 3rd, etc.)
 */
function getOrdinalSuffix(n: number): string {
  const j = n % 10;
  const k = n % 100;
  if (j === 1 && k !== 11) {
    return 'st';
  }
  if (j === 2 && k !== 12) {
    return 'nd';
  }
  if (j === 3 && k !== 13) {
    return 'rd';
  }
  return 'th';
}
