/**
 * Example usage of the Sequence class
 * These examples demonstrate how to work with OEIS and computed sequences
 */

import { Sequence, forwardDifference, accumulation, ratios, nthDifference } from './index';
import type { OEISRawData } from './index';

/**
 * Example 1: Create a Sequence from OEIS data (Fibonacci numbers)
 */
export function exampleOEISSequence(): void {
  // This is what we'd get from the OEIS API
  const fibonacciData: OEISRawData = {
    number: 45,
    data: '0,1,1,2,3,5,8,13,21,34,55,89,144,233,377,610,987,1597,2584,4181',
    name: 'Fibonacci numbers: F(n) = F(n-1) + F(n-2) with F(0) = 0 and F(1) = 1.',
    comment: [
      'Also called Fibonacci sequence.',
      'F(n+2) = F(n+1) + F(n).',
    ],
    formula: [
      'F(n) = ((1+sqrt(5))^n - (1-sqrt(5))^n)/(2^n*sqrt(5)).',
      'G.f.: x/(1-x-x^2).',
    ],
    keyword: ['nonn', 'core', 'easy', 'nice'],
    offset: '0,3',
  };

  // Create the sequence
  const fibonacci = Sequence.fromOEIS(fibonacciData);

  console.log('=== Example 1: OEIS Sequence ===');
  console.log(fibonacci.toString());
  console.log('ID:', fibonacci.id);                  // "A000045"
  console.log('Name:', fibonacci.name);              // "Fibonacci numbers..."
  console.log('Length:', fibonacci.length);          // 20
  console.log('Values:', fibonacci.values.slice(0, 10)); // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
  console.log('OEIS URL:', fibonacci.oeisUrl);       // "https://oeis.org/A000045"
  console.log('Metadata:', fibonacci.metadata);
  console.log('Has keyword "core":', fibonacci.hasKeyword('core')); // true
  console.log('');
}

/**
 * Example 2: Compute forward differences (discrete derivatives)
 */
export function exampleForwardDifferences(): void {
  // Create Fibonacci sequence
  const fibonacci = Sequence.fromOEIS({
    number: 45,
    data: '0,1,1,2,3,5,8,13,21,34,55,89,144',
    name: 'Fibonacci numbers',
  });

  // Compute differences
  const differences = forwardDifference(fibonacci);

  console.log('=== Example 2: Forward Differences ===');
  console.log('Original:', fibonacci.values);
  console.log('Differences:', differences.values);
  // [1, 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55]
  console.log('');
  console.log('Computation type:', differences.computation?.type);
  console.log('Source sequence:', differences.computation?.sourceSequences);
  console.log('Description:', differences.computationDescription);
  console.log('');
}

/**
 * Example 3: Compute 2nd order differences
 */
export function exampleSecondDifferences(): void {
  const fibonacci = Sequence.fromOEIS({
    number: 45,
    data: '0,1,1,2,3,5,8,13,21,34,55,89,144',
    name: 'Fibonacci numbers',
  });

  // Compute 2nd order differences
  const diff2 = nthDifference(fibonacci, 2);

  console.log('=== Example 3: Second-Order Differences ===');
  console.log('Original:', fibonacci.values);
  console.log('2nd differences:', diff2.values);
  // Note: For Fibonacci, 2nd differences should be the sequence itself (offset)
  console.log('');
}

/**
 * Example 4: Compute partial sums (accumulation)
 */
export function exampleAccumulation(): void {
  // Start with simple sequence: 1,1,1,1,1,...
  const ones = Sequence.fromValues('Ones', [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);

  // Accumulate
  const naturalNumbers = accumulation(ones);

  console.log('=== Example 4: Accumulation (Partial Sums) ===');
  console.log('Original:', ones.values);
  console.log('Accumulated:', naturalNumbers.values);
  // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] - Natural numbers!
  console.log('');
}

/**
 * Example 5: Compute ratios to find growth rates
 */
export function exampleRatios(): void {
  const fibonacci = Sequence.fromOEIS({
    number: 45,
    data: '1,1,2,3,5,8,13,21,34,55,89,144,233,377,610,987,1597,2584',
    name: 'Fibonacci numbers',
  });

  // Compute ratios
  const fibRatios = ratios(fibonacci, 6);

  console.log('=== Example 5: Ratios (Growth Rate) ===');
  console.log('Fibonacci:', fibonacci.values);
  console.log('Ratios:', fibRatios.values);
  // Converges to golden ratio: ~1.618034
  console.log('Last ratio (≈ φ):', fibRatios.values[fibRatios.values.length - 1]);
  console.log('');
}

/**
 * Example 6: Chaining operations
 */
export function exampleChaining(): void {
  // Prime numbers
  const primes = Sequence.fromOEIS({
    number: 40,
    data: '2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53',
    name: 'The prime numbers',
  });

  // Compute prime gaps (differences between consecutive primes)
  const primeGaps = forwardDifference(primes);

  // Compute accumulation of prime gaps (should get back to primes, offset)
  const reconstructed = accumulation(primeGaps);

  console.log('=== Example 6: Chaining Operations ===');
  console.log('Primes:', primes.values);
  console.log('Prime gaps:', primeGaps.values);
  console.log('Reconstructed:', reconstructed.values);
  // Note: Reconstructed will be offset by first prime
  console.log('');
}

/**
 * Example 7: Working with custom sequences
 */
export function exampleCustomSequence(): void {
  // Create a custom sequence (powers of 2)
  const powersOf2 = Sequence.fromValues(
    'Powers of 2',
    [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024],
    'CUSTOM_POWERS_2'
  );

  // Compute ratios (should all be 2)
  const ratiosOf2 = ratios(powersOf2, 2);

  console.log('=== Example 7: Custom Sequence ===');
  console.log('Powers of 2:', powersOf2.values);
  console.log('Ratios:', ratiosOf2.values);
  // All 2.00
  console.log('');
  console.log('Metadata:', powersOf2.metadata);
  console.log('Is OEIS?:', powersOf2.isOEIS);        // false
  console.log('Is computed?:', powersOf2.isComputed); // true
  console.log('');
}

/**
 * Example 8: Export and serialization
 */
export function exampleSerialization(): void {
  const fibonacci = Sequence.fromOEIS({
    number: 45,
    data: '0,1,1,2,3,5,8,13,21,34',
    name: 'Fibonacci numbers',
  });

  console.log('=== Example 8: Export & Serialization ===');
  console.log('CSV export:', fibonacci.toCSV());
  console.log('');
  console.log('JSON export:', JSON.stringify(fibonacci.toJSON(), null, 2));
  console.log('');
}

/**
 * Run all examples
 */
export function runAllExamples(): void {
  console.log('\n📊 SEQUENCE CLASS EXAMPLES\n');
  console.log('='.repeat(60));
  console.log('');

  exampleOEISSequence();
  exampleForwardDifferences();
  exampleSecondDifferences();
  exampleAccumulation();
  exampleRatios();
  exampleChaining();
  exampleCustomSequence();
  exampleSerialization();

  console.log('='.repeat(60));
  console.log('\n✅ All examples completed!\n');
}

// Uncomment to run examples when importing this module
// runAllExamples();
