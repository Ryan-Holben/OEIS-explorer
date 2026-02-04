/**
 * Backend API Server
 * Provides CORS-enabled proxy to OEIS with comprehensive search capabilities
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import * as oeis from './oeis.js';
import appConfig from '../../app.config.json';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Configure CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ?.split(',')
  .map(o => o.trim()) || ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Parse JSON bodies
app.use(express.json());

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

/**
 * Health check endpoint
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    version: '1.0.0',
  });
});

/**
 * GET /api/sequence/:id
 * Retrieve a specific sequence by A-number
 *
 * Example: /api/sequence/A000045
 */
app.get('/api/sequence/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const options = extractSearchOptions(req.query);

    const sequence = await oeis.getSequenceById(id, options);

    if (!sequence) {
      return res.status(404).json({
        error: 'Sequence not found',
        aNumber: id,
      });
    }

    res.json({
      success: true,
      data: sequence,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/search
 * Generic search endpoint that auto-detects search type
 *
 * Query params:
 * - q: Search query (A-number, sequence, or keywords)
 * - limit: Max results (default: 10)
 * - start: Starting index for pagination (default: 0)
 * - sort: Sort order (relevance, number, modified, created)
 *
 * Examples:
 * - /api/search?q=A000045
 * - /api/search?q=1,1,2,3,5,8,13
 * - /api/search?q=fibonacci&limit=5
 */
app.get('/api/search', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({
        error: 'Missing required parameter: q',
      });
    }

    const options = extractSearchOptions(req.query);
    const results = await oeis.search(q, options);

    res.json({
      success: true,
      query: q,
      count: results.count || 0,
      data: results.results || [],
      ...results,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/search/sequence
 * Search by numerical sequence values
 *
 * Query params:
 * - values: Comma-separated sequence values
 *
 * Example: /api/search/sequence?values=1,1,2,3,5,8,13
 */
app.get('/api/search/sequence', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { values } = req.query;

    if (!values || typeof values !== 'string') {
      return res.status(400).json({
        error: 'Missing required parameter: values',
      });
    }

    const options = extractSearchOptions(req.query);
    const results = await oeis.searchBySequence(values, options);

    res.json({
      success: true,
      query: values,
      count: results.count || 0,
      data: results.results || [],
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/search/keyword
 * Search by keywords or text
 *
 * Query params:
 * - q: Search keywords
 *
 * Example: /api/search/keyword?q=fibonacci
 */
app.get('/api/search/keyword', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({
        error: 'Missing required parameter: q',
      });
    }

    const options = extractSearchOptions(req.query);
    const results = await oeis.searchByKeyword(q, options);

    res.json({
      success: true,
      query: q,
      count: results.count || 0,
      data: results.results || [],
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/search/reference
 * Find sequences that reference a specific A-number
 *
 * Query params:
 * - aNumber: The A-number to search for
 *
 * Example: /api/search/reference?aNumber=A000045
 */
app.get('/api/search/reference', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { aNumber } = req.query;

    if (!aNumber || typeof aNumber !== 'string') {
      return res.status(400).json({
        error: 'Missing required parameter: aNumber',
      });
    }

    const options = extractSearchOptions(req.query);
    const results = await oeis.searchByReference(aNumber, options);

    res.json({
      success: true,
      query: aNumber,
      count: results.count || 0,
      data: results.results || [],
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/recent
 * Get recently added sequences
 *
 * Query params:
 * - limit: Number of sequences to return (default: 10)
 */
app.get('/api/recent', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const results = await oeis.getRecentSequences(limit);

    res.json({
      success: true,
      count: results.count || 0,
      data: results.results || [],
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/random
 * Get a random sequence
 */
app.get('/api/random', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sequence = await oeis.getRandomSequence();

    if (!sequence) {
      return res.status(404).json({
        error: 'Failed to find a random sequence',
      });
    }

    res.json({
      success: true,
      data: sequence,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/batch
 * Fetch multiple sequences at once
 *
 * Body: { ids: ['A000045', 'A000040', ...] }
 */
app.post('/api/batch', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        error: 'Body must contain an array of sequence IDs',
      });
    }

    if (ids.length > 50) {
      return res.status(400).json({
        error: 'Maximum 50 sequences per batch request',
      });
    }

    // Fetch all sequences in parallel
    const promises = ids.map(id =>
      oeis.getSequenceById(id)
        .then(data => ({ id, data, success: true }))
        .catch(error => ({ id, error: error.message, success: false }))
    );

    const results = await Promise.all(promises);

    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    res.json({
      success: true,
      total: ids.length,
      successful: successful.length,
      failed: failed.length,
      data: results,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Extract search options from query parameters
 */
function extractSearchOptions(query: any): oeis.SearchOptions {
  const options: oeis.SearchOptions = {};

  if (query.limit) {
    const limit = parseInt(query.limit);
    if (!isNaN(limit) && limit > 0) {
      options.limit = Math.min(limit, 100); // Cap at 100
    }
  }

  if (query.start) {
    const start = parseInt(query.start);
    if (!isNaN(start) && start >= 0) {
      options.start = start;
    }
  }

  if (query.sort && ['relevance', 'number', 'modified', 'created'].includes(query.sort)) {
    options.sort = query.sort as any;
  }

  return options;
}

/**
 * Error handling middleware
 */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  if (err instanceof oeis.OEISError) {
    return res.status(err.statusCode || 500).json({
      error: err.message,
      details: err.oeisResponse,
    });
  }

  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: 'CORS policy violation',
    });
  }

  res.status(500).json({
    error: 'Internal server error',
    message: NODE_ENV === 'development' ? err.message : undefined,
  });
});

/**
 * 404 handler
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
  });
});

/**
 * Start the server
 */
app.listen(PORT, () => {
  console.log('');
  console.log('='.repeat(60));
  console.log(`  ${appConfig.name} Backend API`);
  console.log('='.repeat(60));
  console.log(`  Environment: ${NODE_ENV}`);
  console.log(`  Server:      http://localhost:${PORT}`);
  console.log(`  Health:      http://localhost:${PORT}/health`);
  console.log('');
  console.log('  Endpoints:');
  console.log(`    GET  /api/sequence/:id`);
  console.log(`    GET  /api/search?q=...`);
  console.log(`    GET  /api/search/sequence?values=...`);
  console.log(`    GET  /api/search/keyword?q=...`);
  console.log(`    GET  /api/search/reference?aNumber=...`);
  console.log(`    GET  /api/recent?limit=...`);
  console.log(`    GET  /api/random`);
  console.log(`    POST /api/batch`);
  console.log('='.repeat(60));
  console.log('');
});

export default app;
