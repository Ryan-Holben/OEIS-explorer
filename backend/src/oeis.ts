/**
 * OEIS API Wrapper
 * Handles all interactions with the Online Encyclopedia of Integer Sequences
 */

import https from 'https';

/**
 * OEIS API response structure
 */
export interface OEISSequence {
  number: number;
  id?: string;
  data: string;
  name: string;
  comment?: string[];
  reference?: string[];
  link?: string[];
  formula?: string[];
  example?: string[];
  maple?: string[];
  mathematica?: string[];
  program?: string[];
  xref?: string[];
  keyword?: string[];
  offset?: string;
  author?: string;
  ext?: string[];
  time?: string;
  created?: string;
}

export interface OEISResponse {
  greeting?: string;
  query?: string;
  count?: number;
  start?: number;
  results?: OEISSequence[];
}

/**
 * Search options for OEIS queries
 */
export interface SearchOptions {
  /** Maximum number of results to return */
  limit?: number;

  /** Starting index for results (for pagination) */
  start?: number;

  /** Sort order: 'relevance', 'number', 'modified', 'created' */
  sort?: 'relevance' | 'number' | 'modified' | 'created';
}

/**
 * Error class for OEIS API errors
 */
export class OEISError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public oeisResponse?: string
  ) {
    super(message);
    this.name = 'OEISError';
  }
}

/**
 * Make an HTTPS request to OEIS
 */
function makeOEISRequest(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';

      if (res.statusCode !== 200) {
        reject(new OEISError(
          `OEIS API returned status ${res.statusCode}`,
          res.statusCode
        ));
        return;
      }

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(new OEISError(
        `Failed to connect to OEIS: ${err.message}`,
        undefined,
        err.message
      ));
    });
  });
}

/**
 * Parse OEIS JSON response
 */
function parseOEISResponse(data: string): OEISResponse {
  try {
    const parsed = JSON.parse(data);

    // Handle null or undefined responses
    if (parsed === null || parsed === undefined) {
      return {
        results: [],
        count: 0,
      };
    }

    // OEIS returns either an array directly or a wrapped object
    if (Array.isArray(parsed)) {
      return {
        results: parsed,
        count: parsed.length,
      };
    }

    // Ensure results field is defined
    const response = parsed as OEISResponse;
    if (!response.results) {
      response.results = [];
      response.count = 0;
    }

    return response;
  } catch (err) {
    throw new OEISError('Failed to parse OEIS response', undefined, data);
  }
}

/**
 * Build query URL with options
 */
function buildQueryURL(
  baseQuery: string,
  options: SearchOptions = {}
): string {
  const params = new URLSearchParams();
  params.append('q', baseQuery);
  params.append('fmt', 'json');

  if (options.limit) {
    params.append('n', options.limit.toString());
  }

  if (options.start) {
    params.append('start', options.start.toString());
  }

  if (options.sort) {
    // Map our sort options to OEIS sort parameters
    const sortMap: Record<string, string> = {
      'relevance': 'default',
      'number': 'number',
      'modified': 'modified',
      'created': 'created',
    };
    params.append('sort', sortMap[options.sort]);
  }

  const oeisBaseUrl = process.env.OEIS_API_URL || 'https://oeis.org/search';
  return `${oeisBaseUrl}?${params.toString()}`;
}

/**
 * Retrieve a specific sequence by A-number
 *
 * @example
 * const fib = await getSequenceById('A000045');
 */
export async function getSequenceById(
  aNumber: string,
  options: SearchOptions = {}
): Promise<OEISSequence | null> {
  // Normalize A-number format
  const normalized = aNumber.toUpperCase().replace(/[^A0-9]/g, '');
  if (!normalized.startsWith('A')) {
    throw new OEISError('A-number must start with "A"');
  }

  // Use 'id:' prefix to get exact match
  const query = `id:${normalized}`;
  const url = buildQueryURL(query, options);

  const data = await makeOEISRequest(url);
  const response = parseOEISResponse(data);

  if (!response.results || response.results.length === 0) {
    return null;
  }

  return response.results[0];
}

/**
 * Search by numerical sequence values
 *
 * @example
 * const results = await searchBySequence('1,1,2,3,5,8,13');
 * const results = await searchBySequence([1, 1, 2, 3, 5, 8, 13]);
 */
export async function searchBySequence(
  sequence: string | number[],
  options: SearchOptions = {}
): Promise<OEISResponse> {
  // Convert array to comma-separated string if needed
  const sequenceStr = Array.isArray(sequence)
    ? sequence.join(',')
    : sequence;

  // Clean up the sequence string
  const cleaned = sequenceStr.replace(/[^0-9,\-]/g, '');

  if (!cleaned) {
    throw new OEISError('Invalid sequence format');
  }

  const url = buildQueryURL(cleaned, options);
  const data = await makeOEISRequest(url);

  return parseOEISResponse(data);
}

/**
 * Search by keywords or text
 *
 * @example
 * const results = await searchByKeyword('fibonacci');
 * const results = await searchByKeyword('prime numbers');
 */
export async function searchByKeyword(
  keyword: string,
  options: SearchOptions = {}
): Promise<OEISResponse> {
  if (!keyword.trim()) {
    throw new OEISError('Keyword cannot be empty');
  }

  const url = buildQueryURL(keyword, options);
  const data = await makeOEISRequest(url);

  return parseOEISResponse(data);
}

/**
 * Search for sequences that reference a specific A-number
 *
 * @example
 * const results = await searchByReference('A000045');
 */
export async function searchByReference(
  aNumber: string,
  options: SearchOptions = {}
): Promise<OEISResponse> {
  // Normalize A-number
  const normalized = aNumber.toUpperCase().replace(/[^A0-9]/g, '');
  if (!normalized.startsWith('A')) {
    throw new OEISError('A-number must start with "A"');
  }

  // Search without 'id:' prefix to find all references
  const url = buildQueryURL(normalized, options);
  const data = await makeOEISRequest(url);

  return parseOEISResponse(data);
}

/**
 * Generic search that attempts to determine search type
 *
 * @example
 * const results = await search('A000045');  // By ID
 * const results = await search('1,1,2,3,5,8');  // By sequence
 * const results = await search('fibonacci');  // By keyword
 */
export async function search(
  query: string,
  options: SearchOptions = {}
): Promise<OEISResponse> {
  if (!query.trim()) {
    throw new OEISError('Query cannot be empty');
  }

  // Detect search type
  const trimmed = query.trim();

  // Check if it's an A-number search
  if (/^A\d{6}$/i.test(trimmed.replace(/[^A0-9]/g, ''))) {
    const result = await getSequenceById(trimmed, options);
    return {
      results: result ? [result] : [],
      count: result ? 1 : 0,
      query: trimmed,
    };
  }

  // Check if it's a numerical sequence
  if (/^[\d,\s\-]+$/.test(trimmed)) {
    return searchBySequence(trimmed, options);
  }

  // Otherwise treat as keyword search
  return searchByKeyword(trimmed, options);
}

/**
 * Get recently added sequences
 * Note: This uses OEIS's sort by 'created' date
 */
export async function getRecentSequences(
  limit: number = 10
): Promise<OEISResponse> {
  return searchByKeyword('core', {
    limit,
    sort: 'created',
  });
}

/**
 * Get a random sequence
 * Note: This is a simple implementation that gets a random A-number
 * OEIS has sequences A000001 through A375000+ (as of 2024)
 */
export async function getRandomSequence(): Promise<OEISSequence | null> {
  // Generate random A-number between A000001 and A370000
  const randomNum = Math.floor(Math.random() * 370000) + 1;
  const aNumber = `A${String(randomNum).padStart(6, '0')}`;

  try {
    return await getSequenceById(aNumber);
  } catch (err) {
    // If sequence doesn't exist, try again (recursion with limit would be better)
    console.warn(`Random sequence ${aNumber} not found, trying another...`);
    return getRandomSequence();
  }
}
