# Sequence Models

Core data models for representing integer sequences in Sequential.

## Overview

The Sequence class is the fundamental building block for working with integer sequences. It supports two data sources:

1. **OEIS Sequences** - Fetched from the Online Encyclopedia of Integer Sequences
2. **Computed Sequences** - Derived locally from other sequences (differences, sums, ratios, etc.)

## Files

### OEISTypes.ts
TypeScript interfaces matching the OEIS JSON API format:
- `OEISRawData` - Raw sequence data from OEIS
- `OEISResponse` - API response wrapper
- `SequenceMetadata` - Computed metadata (min, max, keywords, etc.)

### Sequence.ts
Main Sequence class with factory methods:
- `Sequence.fromOEIS(data)` - Create from OEIS JSON
- `Sequence.fromComputation(name, values, metadata)` - Create computed sequence
- `Sequence.fromValues(name, values)` - Create custom sequence

### SequenceOperations.ts
Utilities for computing derived sequences:
- `forwardDifference()` - Discrete derivative
- `backwardDifference()` - Alternative derivative
- `nthDifference(n)` - Higher-order differences
- `accumulation()` - Discrete integral (partial sums)
- `ratios()` - Growth rates
- `absolute()`, `scale()`, `offset()` - Transformations
- `add()`, `subtract()`, `multiply()` - Element-wise operations

### index.ts
Clean exports for importing from `models/`

### examples.ts
Comprehensive usage examples demonstrating all features

---

## Usage

### Creating Sequences

```typescript
import { Sequence } from '@/models';
import type { OEISRawData } from '@/models';

// From OEIS data
const oeisData: OEISRawData = {
  number: 45,
  data: '0,1,1,2,3,5,8,13,21,34,55',
  name: 'Fibonacci numbers',
  keyword: ['nonn', 'core'],
};
const fibonacci = Sequence.fromOEIS(oeisData);

// Custom sequence
const powersOf2 = Sequence.fromValues('Powers of 2', [1, 2, 4, 8, 16, 32]);
```

### Accessing Data

```typescript
fibonacci.id;              // "A000045"
fibonacci.name;            // "Fibonacci numbers..."
fibonacci.values;          // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55]
fibonacci.length;          // 11
fibonacci.at(5);           // 5
fibonacci.slice(0, 5);     // [0, 1, 1, 2, 3]

fibonacci.metadata;        // { aNumber, dataPoints, minValue, maxValue, ... }
fibonacci.oeisUrl;         // "https://oeis.org/A000045"
fibonacci.isOEIS;          // true
fibonacci.hasKeyword('core'); // true
```

### Computing Derived Sequences

```typescript
import { forwardDifference, accumulation, ratios } from '@/models';

// Discrete derivatives
const differences = forwardDifference(fibonacci);
console.log(differences.values);
// [1, 0, 1, 1, 2, 3, 5, 8, 13, 21]

// Partial sums
const sums = accumulation(fibonacci);
console.log(sums.values);
// [0, 1, 2, 4, 7, 12, 20, 33, 54, 88, 143]

// Growth rates (converges to golden ratio)
const fibRatios = ratios(fibonacci);
console.log(fibRatios.values);
// [Infinity, 1, 2, 1.5, 1.666667, 1.6, 1.625, 1.615385, ...]
```

### Chaining Operations

```typescript
import { forwardDifference, nthDifference } from '@/models';

// First derivative
const diff1 = forwardDifference(sequence);

// Second derivative (differences of differences)
const diff2 = forwardDifference(diff1);

// Or use the shorthand
const diff2 = nthDifference(sequence, 2);
```

### Computation Metadata

Computed sequences track their lineage:

```typescript
const differences = forwardDifference(fibonacci);

differences.source;                    // "computed"
differences.computation?.type;          // "forward_difference"
differences.computation?.sourceSequences; // ["A000045"]
differences.computationDescription;     // "Forward differences of A000045"
```

### Export and Serialization

```typescript
// CSV export
fibonacci.toCSV();
// "0,1,1,2,3,5,8,13,21,34,55"

// JSON export
fibonacci.toJSON();
// { id, source, name, values, oeisData, metadata, ... }
```

---

## Design Decisions

### Immutability
All Sequence instances are immutable. Operations return new Sequence objects rather than modifying existing ones.

### Factory Pattern
Use static factory methods (`fromOEIS`, `fromComputation`, `fromValues`) instead of direct constructor calls. This provides clear intent and type safety.

### Type Safety
Full TypeScript support with strict types for OEIS data structures and computation metadata.

### Computation Tracking
Computed sequences remember their origin, enabling features like:
- Automatic OEIS matching for derived sequences
- Dependency graphs
- Reproducible analysis pipelines

---

## Future Enhancements

- Lazy evaluation for expensive computations
- Caching layer for OEIS lookups
- Pattern detection and matching
- Sequence generator functions (infinite sequences)
- Advanced operations (convolution, GCD, LCM)
- Statistical analysis (mean, variance, autocorrelation)

---

## Examples

See `examples.ts` for comprehensive usage demonstrations, including:
- Working with OEIS sequences
- Computing derivatives and integrals
- Finding growth rates and convergence
- Chaining multiple operations
- Custom sequences

Run examples:
```typescript
import { runAllExamples } from '@/models/examples';
runAllExamples();
```

---

Last Updated: October 28, 2025
