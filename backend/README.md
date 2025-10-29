# Sequential Backend API

CORS-enabled Express API proxy for the Online Encyclopedia of Integer Sequences (OEIS).

## Features

- **Complete OEIS Coverage**: All search methods supported (ID, sequence, keywords, references)
- **CORS Handling**: Properly configured CORS proxy to avoid browser restrictions
- **TypeScript**: Full type safety with strict typing
- **Error Handling**: Comprehensive error handling and validation
- **Search Options**: Pagination, sorting, and result limiting
- **Batch Operations**: Fetch multiple sequences in parallel
- **Random & Recent**: Get random or recently added sequences

---

## Quick Start

### Installation

```bash
cd backend
npm install
```

### Configuration

Copy `.env.example` to `.env` and configure:

```bash
PORT=3001
NODE_ENV=development
OEIS_API_URL=https://oeis.org/search
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Development

```bash
npm run dev        # Start with hot reload
npm run build      # Build TypeScript
npm start          # Start production server
npm run type-check # Check types without building
```

Server runs on `http://localhost:3001` by default.

---

## API Endpoints

### Health Check

```
GET /health
```

Returns server status and version.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-29T04:00:00.000Z",
  "environment": "development",
  "version": "1.0.0"
}
```

---

### Get Sequence by ID

```
GET /api/sequence/:id
```

Retrieve a specific sequence by A-number.

**Parameters:**
- `id` (path): A-number (e.g., `A000045`)

**Query Options:**
- `limit`: Max number of results (default: 10, max: 100)
- `start`: Starting index for pagination
- `sort`: Sort order (`relevance`, `number`, `modified`, `created`)

**Example:**
```bash
curl "http://localhost:3001/api/sequence/A000045"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "number": 45,
    "id": "M0692 N0256",
    "data": "0,1,1,2,3,5,8,13,21,34,55,89,144,...",
    "name": "Fibonacci numbers: F(n) = F(n-1) + F(n-2) with F(0) = 0 and F(1) = 1.",
    "comment": [...],
    "formula": [...],
    "keyword": ["nonn", "core", "easy"],
    ...
  }
}
```

---

### Generic Search

```
GET /api/search?q=...
```

Auto-detects search type (A-number, sequence values, or keywords).

**Query Parameters:**
- `q` (required): Search query
- `limit`: Max results (default: 10, max: 100)
- `start`: Pagination offset
- `sort`: Sort order

**Examples:**
```bash
# Search by A-number
curl "http://localhost:3001/api/search?q=A000045"

# Search by sequence values
curl "http://localhost:3001/api/search?q=1,1,2,3,5,8,13"

# Search by keywords
curl "http://localhost:3001/api/search?q=fibonacci&limit=5"
```

**Response:**
```json
{
  "success": true,
  "query": "fibonacci",
  "count": 5,
  "data": [...]
}
```

---

### Search by Sequence Values

```
GET /api/search/sequence?values=...
```

Search for sequences matching given values.

**Query Parameters:**
- `values` (required): Comma-separated sequence values
- `limit`, `start`, `sort`: Same as above

**Example:**
```bash
curl "http://localhost:3001/api/search/sequence?values=1,1,2,3,5,8"
```

---

### Search by Keyword

```
GET /api/search/keyword?q=...
```

Search by keywords or text.

**Query Parameters:**
- `q` (required): Search keywords
- `limit`, `start`, `sort`: Same as above

**Example:**
```bash
curl "http://localhost:3001/api/search/keyword?q=prime%20numbers"
```

---

### Search by Reference

```
GET /api/search/reference?aNumber=...
```

Find sequences that reference a specific A-number.

**Query Parameters:**
- `aNumber` (required): A-number to search for
- `limit`, `start`, `sort`: Same as above

**Example:**
```bash
curl "http://localhost:3001/api/search/reference?aNumber=A000045"
```

**Response:**
Returns all sequences that reference A000045 in their cross-references, formulas, comments, etc.

---

### Get Recent Sequences

```
GET /api/recent?limit=...
```

Get recently added sequences.

**Query Parameters:**
- `limit`: Number of sequences (default: 10)

**Example:**
```bash
curl "http://localhost:3001/api/recent?limit=20"
```

---

### Get Random Sequence

```
GET /api/random
```

Get a random sequence from OEIS.

**Example:**
```bash
curl "http://localhost:3001/api/random"
```

**Response:**
```json
{
  "success": true,
  "data": {...}
}
```

---

### Batch Fetch

```
POST /api/batch
```

Fetch multiple sequences in parallel (max 50).

**Request Body:**
```json
{
  "ids": ["A000045", "A000040", "A000010"]
}
```

**Example:**
```bash
curl -X POST http://localhost:3001/api/batch \
  -H "Content-Type: application/json" \
  -d '{"ids":["A000045","A000040"]}'
```

**Response:**
```json
{
  "success": true,
  "total": 2,
  "successful": 2,
  "failed": 0,
  "data": [
    {
      "id": "A000045",
      "success": true,
      "data": {...}
    },
    {
      "id": "A000040",
      "success": true,
      "data": {...}
    }
  ]
}
```

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "details": "Optional additional details"
}
```

**Common Status Codes:**
- `200`: Success
- `400`: Bad request (missing/invalid parameters)
- `404`: Resource not found
- `403`: CORS policy violation
- `500`: Internal server error

---

## OEIS Data Structure

### Sequence Object

```typescript
interface OEISSequence {
  number: number;           // Sequence number (e.g., 45 for A000045)
  id?: string;              // Old ID format (e.g., "M0692 N0256")
  data: string;             // Comma-separated values
  name: string;             // Sequence description
  comment?: string[];       // Comments
  reference?: string[];     // References
  link?: string[];          // Links
  formula?: string[];       // Formulas
  example?: string[];       // Examples
  maple?: string[];         // Maple code
  mathematica?: string[];   // Mathematica code
  program?: string[];       // Other programs
  xref?: string[];          // Cross-references
  keyword?: string[];       // Keywords
  offset?: string;          // Offset information
  author?: string;          // Author
  ext?: string[];           // Extensions
  time?: string;            // Modification time
  created?: string;         // Creation date
}
```

---

## Development

### Project Structure

```
backend/
├── src/
│   ├── server.ts    # Express server and routes
│   ├── oeis.ts      # OEIS API wrapper
│   └── ...
├── dist/            # Compiled JavaScript
├── .env             # Environment configuration
├── package.json
├── tsconfig.json
└── README.md
```

### Type Checking

```bash
npm run type-check
```

### Building

```bash
npm run build
```

Outputs to `dist/` directory.

---

## Deployment

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the backend directory
3. Configure environment variables in Vercel dashboard
4. Set build command: `npm run build`
5. Set start command: `npm start`

### Railway

1. Connect GitHub repository
2. Railway auto-detects Node.js
3. Configure environment variables
4. Deploy automatically on push

### Environment Variables (Production)

```
PORT=3001
NODE_ENV=production
OEIS_API_URL=https://oeis.org/search
ALLOWED_ORIGINS=https://yourusername.github.io
```

---

## API Usage Examples

### JavaScript / TypeScript

```typescript
// Fetch Fibonacci sequence
const response = await fetch('http://localhost:3001/api/sequence/A000045');
const { data } = await response.json();
console.log(data.name);  // "Fibonacci numbers..."
console.log(data.data);  // "0,1,1,2,3,5,8,13,..."

// Search by sequence values
const search = await fetch('http://localhost:3001/api/search?q=1,1,2,3,5,8');
const results = await search.json();
console.log(results.count);  // Number of matches

// Batch fetch
const batch = await fetch('http://localhost:3001/api/batch', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ids: ['A000045', 'A000040'] })
});
const batchResults = await batch.json();
```

### curl

```bash
# Get sequence
curl "http://localhost:3001/api/sequence/A000045"

# Search with pagination
curl "http://localhost:3001/api/search?q=prime&limit=10&start=0"

# Get recent sequences
curl "http://localhost:3001/api/recent?limit=5"

# Batch fetch
curl -X POST http://localhost:3001/api/batch \
  -H "Content-Type: application/json" \
  -d '{"ids":["A000045","A000040","A000010"]}'
```

---

## Testing

Manual testing examples:

```bash
# Health check
curl http://localhost:3001/health

# Get Fibonacci
curl "http://localhost:3001/api/sequence/A000045" | jq '.data.name'

# Search
curl "http://localhost:3001/api/search?q=fibonacci&limit=2" | jq '.count'

# Random sequence
curl "http://localhost:3001/api/random" | jq '.data.number'
```

---

## Rate Limiting

Currently no rate limiting is implemented. For production deployment, consider:
- Adding rate limiting middleware (e.g., `express-rate-limit`)
- Caching responses with Redis
- Implementing request throttling

---

## Contributing

1. Follow existing code structure
2. Use TypeScript with strict typing
3. Add error handling for all edge cases
4. Update documentation for new endpoints

---

## License

MIT

---

Last Updated: October 29, 2025
