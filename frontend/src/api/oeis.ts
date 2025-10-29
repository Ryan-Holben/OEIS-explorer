/**
 * OEIS API client
 * Connects to the Sequential backend API
 */

import type { OEISRawData } from '../models/OEISTypes';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
}

export interface SearchResponse {
  success: boolean;
  query: string;
  count: number;
  data: OEISRawData[];
}

/**
 * Fetch a specific sequence by A-number
 */
export async function fetchSequence(aNumber: string): Promise<OEISRawData | null> {
  const response = await fetch(`${API_BASE_URL}/api/sequence/${aNumber}`);

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(`Failed to fetch sequence: ${response.statusText}`);
  }

  const result: APIResponse<OEISRawData> = await response.json();
  return result.data || null;
}

/**
 * Generic search
 */
export async function search(
  query: string,
  options?: {
    limit?: number;
    start?: number;
    sort?: 'relevance' | 'number' | 'modified' | 'created';
  }
): Promise<SearchResponse> {
  const params = new URLSearchParams({ q: query });

  if (options?.limit) params.append('limit', options.limit.toString());
  if (options?.start) params.append('start', options.start.toString());
  if (options?.sort) params.append('sort', options.sort);

  const response = await fetch(`${API_BASE_URL}/api/search?${params}`);

  if (!response.ok) {
    throw new Error(`Search failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Search by sequence values
 */
export async function searchBySequence(
  values: string | number[],
  options?: { limit?: number }
): Promise<SearchResponse> {
  const valuesStr = Array.isArray(values) ? values.join(',') : values;
  const params = new URLSearchParams({ values: valuesStr });

  if (options?.limit) params.append('limit', options.limit.toString());

  const response = await fetch(`${API_BASE_URL}/api/search/sequence?${params}`);

  if (!response.ok) {
    throw new Error(`Search failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get recent sequences
 */
export async function fetchRecentSequences(limit: number = 10): Promise<OEISRawData[]> {
  const response = await fetch(`${API_BASE_URL}/api/recent?limit=${limit}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch recent sequences: ${response.statusText}`);
  }

  const result: APIResponse<OEISRawData[]> = await response.json();
  return result.data || [];
}

/**
 * Get random sequence
 */
export async function fetchRandomSequence(): Promise<OEISRawData | null> {
  const response = await fetch(`${API_BASE_URL}/api/random`);

  if (!response.ok) {
    throw new Error(`Failed to fetch random sequence: ${response.statusText}`);
  }

  const result: APIResponse<OEISRawData> = await response.json();
  return result.data || null;
}

/**
 * Batch fetch multiple sequences
 */
export async function fetchBatch(aNumbers: string[]): Promise<OEISRawData[]> {
  const response = await fetch(`${API_BASE_URL}/api/batch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ids: aNumbers }),
  });

  if (!response.ok) {
    throw new Error(`Batch fetch failed: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data
    .filter((item: any) => item.success)
    .map((item: any) => item.data);
}
