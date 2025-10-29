/**
 * React hooks for fetching OEIS sequence data
 */

import { useState, useEffect } from 'react';
import { Sequence } from '../models/Sequence';
import * as oeisAPI from '../api/oeis';
import type { OEISRawData } from '../models/OEISTypes';

export interface UseSequenceResult {
  sequence: Sequence | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Hook to fetch and manage a single sequence by A-number
 */
export function useSequence(aNumber: string | null): UseSequenceResult {
  const [sequence, setSequence] = useState<Sequence | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    if (!aNumber) {
      setSequence(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await oeisAPI.fetchSequence(aNumber);

      if (data) {
        const seq = Sequence.fromOEIS(data);
        setSequence(seq);
      } else {
        setSequence(null);
        setError(new Error(`Sequence ${aNumber} not found`));
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch sequence'));
      setSequence(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [aNumber]);

  return {
    sequence,
    loading,
    error,
    refetch: fetchData,
  };
}

export interface UseSearchResult {
  sequences: Sequence[];
  loading: boolean;
  error: Error | null;
  count: number;
}

/**
 * Hook to search for sequences
 */
export function useSearch(
  query: string | null,
  options?: {
    limit?: number;
    start?: number;
    sort?: 'relevance' | 'number' | 'modified' | 'created';
  }
): UseSearchResult {
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!query) {
      setSequences([]);
      setCount(0);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await oeisAPI.search(query, options);
        const seqs = response.data.map(data => Sequence.fromOEIS(data));
        setSequences(seqs);
        setCount(response.count);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Search failed'));
        setSequences([]);
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, options?.limit, options?.start, options?.sort]);

  return {
    sequences,
    loading,
    error,
    count,
  };
}

/**
 * Hook to fetch recent sequences
 */
export function useRecentSequences(limit: number = 10) {
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await oeisAPI.fetchRecentSequences(limit);
        const seqs = data.map(d => Sequence.fromOEIS(d));
        setSequences(seqs);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch recent sequences'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [limit]);

  return { sequences, loading, error };
}

/**
 * Hook to fetch a random sequence
 */
export function useRandomSequence(trigger: number = 0) {
  const [sequence, setSequence] = useState<Sequence | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await oeisAPI.fetchRandomSequence();
        if (data) {
          setSequence(Sequence.fromOEIS(data));
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch random sequence'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [trigger]);

  return { sequence, loading, error };
}
