/**
 * Sequence Analysis Utilities
 *
 * Functions for computing discrete calculus and sequence analyses
 */

/**
 * Compute forward differences (discrete derivative)
 * Returns array of differences: [a(1)-a(0), a(2)-a(1), ...]
 */
export function forwardDifference(values: number[]): number[] {
  if (values.length <= 1) return [];

  const differences: number[] = [];
  for (let i = 1; i < values.length; i++) {
    differences.push(values[i] - values[i - 1]);
  }
  return differences;
}

/**
 * Compute nth order forward differences
 */
export function nthForwardDifference(values: number[], n: number): number[] {
  if (n === 0) return values;
  if (n === 1) return forwardDifference(values);

  let current = values;
  for (let i = 0; i < n; i++) {
    current = forwardDifference(current);
    if (current.length === 0) break;
  }
  return current;
}

/**
 * Compute accumulation (discrete integral)
 * Returns array of cumulative sums: [a(0), a(0)+a(1), a(0)+a(1)+a(2), ...]
 */
export function accumulation(values: number[]): number[] {
  if (values.length === 0) return [];

  const sums: number[] = [];
  let sum = 0;
  for (const value of values) {
    sum += value;
    sums.push(sum);
  }
  return sums;
}

/**
 * Compute ratios of consecutive terms: a(n+1) / a(n)
 */
export function consecutiveRatios(values: number[]): number[] {
  if (values.length <= 1) return [];

  const ratios: number[] = [];
  for (let i = 1; i < values.length; i++) {
    if (values[i - 1] !== 0) {
      ratios.push(values[i] / values[i - 1]);
    }
  }
  return ratios;
}

/**
 * Detect if sequence appears to be constant
 */
export function isConstant(values: number[]): boolean {
  if (values.length <= 1) return true;
  const first = values[0];
  return values.every(v => v === first);
}

/**
 * Detect if sequence appears to be arithmetic (constant differences)
 */
export function isArithmetic(values: number[]): boolean {
  const diffs = forwardDifference(values);
  return isConstant(diffs);
}

/**
 * Detect if sequence appears to be geometric (constant ratios)
 */
export function isGeometric(values: number[]): boolean {
  const ratios = consecutiveRatios(values);
  if (ratios.length === 0) return false;
  const first = ratios[0];
  return ratios.every(r => Math.abs(r - first) < 0.0001);
}
