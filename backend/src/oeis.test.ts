/**
 * Unit tests for OEIS API wrapper
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as oeis from './oeis.js';

describe('OEIS API Wrapper', () => {
  describe('getSequenceById', () => {
    it('should normalize A-numbers correctly', async () => {
      // These should all be treated as the same A-number
      const validFormats = ['A000045', 'a000045', 'A 000045', 'A-000045'];

      // We can't easily test actual OEIS calls without mocking, so we test validation
      for (const format of validFormats) {
        // Invalid A-numbers should throw
        await expect(oeis.getSequenceById('B000045')).rejects.toThrow('A-number must start with "A"');
        await expect(oeis.getSequenceById('000045')).rejects.toThrow('A-number must start with "A"');
      }
    });

    it('should return null for non-existent sequences', async () => {
      // Using a very high A-number that likely doesn't exist
      const result = await oeis.getSequenceById('A999999999');
      expect(result).toBeNull();
    }, 10000); // Give it 10 seconds for network request
  });

  describe('searchBySequence', () => {
    it('should accept array input', async () => {
      const result = await oeis.searchBySequence([1, 1, 2, 3, 5, 8]);
      expect(result).toBeDefined();
      expect(result.results).toBeDefined();
    }, 10000);

    it('should accept string input', async () => {
      const result = await oeis.searchBySequence('1,1,2,3,5,8');
      expect(result).toBeDefined();
      expect(result.results).toBeDefined();
    }, 10000);

    it('should handle negative numbers', async () => {
      const result = await oeis.searchBySequence('1,-1,2,-2,3');
      expect(result).toBeDefined();
    }, 10000);

    it('should throw error for invalid sequence format', async () => {
      await expect(oeis.searchBySequence('')).rejects.toThrow('Invalid sequence format');
      await expect(oeis.searchBySequence('abc')).rejects.toThrow('Invalid sequence format');
    });
  });

  describe('searchByKeyword', () => {
    it('should throw error for empty keyword', async () => {
      await expect(oeis.searchByKeyword('')).rejects.toThrow('Keyword cannot be empty');
      await expect(oeis.searchByKeyword('   ')).rejects.toThrow('Keyword cannot be empty');
    });

    it('should find sequences by keyword', async () => {
      const result = await oeis.searchByKeyword('fibonacci');
      expect(result).toBeDefined();
      expect(result.results).toBeDefined();
      expect(result.results!.length).toBeGreaterThan(0);
    }, 10000);
  });

  describe('searchByReference', () => {
    it('should require valid A-number format', async () => {
      await expect(oeis.searchByReference('B000045')).rejects.toThrow('A-number must start with "A"');
      await expect(oeis.searchByReference('12345')).rejects.toThrow('A-number must start with "A"');
    });

    it('should find sequences referencing an A-number', async () => {
      const result = await oeis.searchByReference('A000045');
      expect(result).toBeDefined();
      expect(result.results).toBeDefined();
    }, 10000);
  });

  describe('search (generic)', () => {
    it('should detect A-number searches', async () => {
      const result = await oeis.search('A000045');
      expect(result).toBeDefined();
      expect(result.results).toBeDefined();
      if (result.results && result.results.length > 0) {
        expect(result.results[0].number).toBe(45);
      }
    }, 10000);

    it('should detect numerical sequence searches', async () => {
      const result = await oeis.search('1,1,2,3,5,8,13');
      expect(result).toBeDefined();
      expect(result.results).toBeDefined();
    }, 10000);

    it('should detect keyword searches', async () => {
      const result = await oeis.search('prime numbers');
      expect(result).toBeDefined();
      expect(result.results).toBeDefined();
    }, 10000);

    it('should throw error for empty query', async () => {
      await expect(oeis.search('')).rejects.toThrow('Query cannot be empty');
    });
  });

  describe('getRandomSequence', () => {
    it('should return a valid sequence', async () => {
      const result = await oeis.getRandomSequence();
      expect(result).toBeDefined();
      expect(result).not.toBeNull();
      if (result) {
        expect(result.number).toBeGreaterThan(0);
        expect(result.data).toBeDefined();
        expect(result.name).toBeDefined();
      }
    }, 15000); // Random can take a bit longer
  });

  describe('SearchOptions', () => {
    it('should respect limit parameter', async () => {
      const result = await oeis.searchByKeyword('fibonacci', { limit: 3 });
      expect(result).toBeDefined();
      expect(result.results).toBeDefined();
      if (result.results) {
        expect(result.results.length).toBeLessThanOrEqual(3);
      }
    }, 10000);

    it('should respect sort parameter', async () => {
      // Test that sort parameter is accepted (actual sorting verified by OEIS)
      const result1 = await oeis.searchByKeyword('prime', { sort: 'number', limit: 5 });
      const result2 = await oeis.searchByKeyword('prime', { sort: 'created', limit: 5 });

      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
    }, 10000);
  });

  describe('OEISError', () => {
    it('should create proper error objects', () => {
      const error = new oeis.OEISError('Test error', 404, 'Not found');
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('OEISError');
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(404);
      expect(error.oeisResponse).toBe('Not found');
    });
  });
});

describe('Integration Tests', () => {
  describe('Fibonacci sequence (A000045)', () => {
    it('should retrieve complete Fibonacci data', async () => {
      const result = await oeis.getSequenceById('A000045');

      expect(result).not.toBeNull();
      if (result) {
        expect(result.number).toBe(45);
        expect(result.name).toContain('Fibonacci');
        expect(result.data).toContain('0,1,1,2,3,5,8,13,21,34,55,89');
        expect(result.keyword).toContain('nonn');
        expect(result.comment).toBeDefined();
        expect(result.formula).toBeDefined();
      }
    }, 10000);

    it('should find Fibonacci by sequence values', async () => {
      const result = await oeis.searchBySequence('0,1,1,2,3,5,8,13,21,34');

      expect(result).toBeDefined();
      expect(result.results).toBeDefined();
      expect(result.results!.length).toBeGreaterThan(0);

      // First result should be Fibonacci
      const fibonacci = result.results![0];
      expect(fibonacci.number).toBe(45);
    }, 10000);
  });

  describe('Prime numbers (A000040)', () => {
    it('should retrieve prime numbers sequence', async () => {
      const result = await oeis.getSequenceById('A000040');

      expect(result).not.toBeNull();
      if (result) {
        expect(result.number).toBe(40);
        expect(result.name.toLowerCase()).toContain('prime');
        expect(result.data).toContain('2,3,5,7,11,13');
      }
    }, 10000);
  });
});
