# OEIS Explorer - Design Document

## Project Overview

A modern, interactive web application for exploring integer sequences from the Online Encyclopedia of Integer Sequences (OEIS). Built with React + TypeScript frontend and Node.js backend, designed for fast, shareable access to mathematical sequences with rich visualizations.

---

## Architecture

### Tech Stack

**Frontend**
- React 18+ with TypeScript
- Vite (build tool and dev server)
- React Router (hash-based routing for GitHub Pages)
- Chart.js for sequence visualization
- CSS Modules or Tailwind CSS for styling

**Backend**
- Node.js with Express
- TypeScript
- OEIS API proxy with CORS handling
- Extensible REST API design

**Deployment**
- Frontend: GitHub Pages (static hosting)
- Backend: Vercel / Railway / Render (free tier)

---

## Routing Strategy

### Hash-Based Routing
Using `/#/path` format for GitHub Pages compatibility.

**Route Structure:**
```
/#/                          → Home/Landing page
/#/sequence/:id              → Sequence detail (e.g., /#/sequence/A000045)
/#/search?q=...              → Search results
/#/browse/:category          → Browse by category
/#/compare?ids=A001,A002     → Compare sequences
/#/favorites                 → User's saved favorites
/#/about                     → About/Documentation
```

---

## Data Flow

```
User Browser
    ↓
React App (GitHub Pages)
    ↓
Backend API (Vercel/Railway)
    ↓
OEIS.org JSON API
```

### API Endpoints (Backend)

```
GET  /api/sequence/:id       → Get sequence by A-number
GET  /api/search?q=...       → Search sequences
GET  /api/browse/:category   → Browse sequences (future)
POST /api/batch              → Batch fetch multiple sequences (future)
```

---

## Component Architecture

### Page Components
```
/pages
  HomePage.tsx               → Landing page with search
  SequenceDetailPage.tsx     → Individual sequence view
  SearchResultsPage.tsx      → Search results listing
  BrowsePage.tsx             → Browse by category
  ComparePage.tsx            → Compare multiple sequences
  FavoritesPage.tsx          → User's saved sequences
  AboutPage.tsx              → Documentation & info
```

### Shared Components
```
/components
  /layout
    Header.tsx               → App header with navigation
    Footer.tsx               → Footer with links
    Layout.tsx               → Page wrapper

  /sequence
    SequenceChart.tsx        → Chart.js visualization
    SequenceMetadata.tsx     → ID, name, stats
    SequenceData.tsx         → Raw data display
    SequenceComments.tsx     → Comments/formulas section

  /ui
    SearchBar.tsx            → Reusable search input
    SequenceCard.tsx         → Sequence preview card
    LoadingSpinner.tsx       → Loading states
    ErrorBoundary.tsx        → Error handling
```

---

## Data Models

### TypeScript Interfaces

```typescript
interface OEISSequence {
  number: number;           // Sequence number (e.g., 45 for A000045)
  id: string;               // Old ID format (e.g., "M0692 N0256")
  data: string;             // Comma-separated values
  name: string;             // Sequence description
  comment?: string[];       // Array of comments
  reference?: string[];     // Array of references
  link?: string[];          // Array of links
  formula?: string[];       // Array of formulas
  example?: string[];       // Array of examples
  maple?: string[];         // Maple code
  mathematica?: string[];   // Mathematica code
  program?: string[];       // Other programs
  xref?: string[];          // Cross-references
  keyword?: string[];       // Keywords
  offset?: string;          // Offset information
  author?: string;          // Author info
  ext?: string[];           // Extensions
}

interface SequenceMetadata {
  aNumber: string;          // Formatted A-number (e.g., "A000045")
  dataPoints: number;       // Number of terms
  minValue: number;         // Minimum value
  maxValue: number;         // Maximum value
  keywords: string[];       // Parsed keywords
}

interface SearchResult {
  sequence: OEISSequence;
  relevance?: number;       // Search relevance score (future)
}
```

---

## State Management

### Approach: React Context + Custom Hooks

**Global State:**
- `SequenceContext` - Currently viewed/loaded sequences
- `FavoritesContext` - User's saved favorites (localStorage)
- `SearchContext` - Search history and state

**Custom Hooks:**
```typescript
useSequence(id: string)      // Fetch and cache sequence
useSearch(query: string)     // Search sequences
useFavorites()               // Manage favorites
useLocalStorage(key, initial) // Persist data
```

---

## Roadmap

### 1. Build design language and GUI

Design should be:
- Clean, modern
- Consists of flat looking panels via React component, with rounded edges, subtle outer shadow
- Consistency between UI elements
- Light and darkmode

Produce a demo page of the UI components, and iterate with the user, before proceeding with the main project.

### 1.5 Define a sequence class

- Its data source is either OEIS, or computed locally
- Include fields to have the API fill out if we query from OEIS
- Or if it's computed, have some basic fields to describe how it was computed, and what other sequence(s) it was computed from

### 2. OEIS-specific reusable components

We define several different-sized reusable components to represent previews of sequences.

For all versions of these, they should point to an instance of a sequence class for their data

#### Inline version

- To be used whenever in text we have an A-number.
- It should look like the A-number, sized to be in-line with other text without adding extra spacing on any sides or between lines.
- Wrapped in a lightweight rounded pill container
- Clicking it links to the sequence's full page
- Hovering it brings up the preview component after a software-configurable time, e.g. 0.5 seconds.  And un-hovering after the same time period removes it

#### Preview version
- Configurable size depending on context
- Top line has in bold the A-number
- Second line has the description
- Below it has a preview plot component
- The entire component is clickable to the sequence's full page.  Should have subtle hover effect to cue user to interactivity.

We next define several different-sized reusable plot components.

#### Full plot
- To be used in sequence's main page, and elsewhere.  Details TBD, make reasonable guesses and we can iterate
- Plot y axis limits are the min and max of the sequence values
- Plot x axis limits start at 0 and go to the length of the sequence data provided

#### Preview plot
- Intended to fill smaller spaces, where we don't need interactivity or details
- Intended to give the general shape and gist of the sequence
- No axis labels, but do provide hash marks
- No interactivity, including hover

Finally, define a reusable search bar component.  Its logic will be defined later in phase 3.

### 2. OEIS API

- Define a very solid and reusable API for interacting with OEIS
- This is where you implement the backend proxy, etc
- It should also implement every possible way to interact with OEIS.  Specifically:
  - Search by numerical sequence, i.e. 1,2,3,6,11,23,47,106,235 becomes https://oeis.org/search?q=1,2,3,6,11,23,47,106,235&fmt=json
  - Search by keywords, i.e. "fermat" yields
  - Search for all sequences containing an A-number, i.e. A001011 yields https://oeis.org/search?q=A001011&fmt=json
  - Retrieve a sequence by A-number, i.e. A001011 yields https://oeis.org/search?q=id:A001011&fmt=json
- Explore the HTML page for search results for other options. For example, I see there are sorting options you can add to the API.  Look here for example: https://oeis.org/search?q=A001011 (NOT the JSON version, you're just exploring)

### 2. Main homepage

- Search bar
- Below it, 2 columns
  - Left: Feed of N (configurable in software) recently added sequences, with the date added in lightweight grey just above each component.  Each one will be represented with its preview component, and that component will be rectangular, wider than it is high.
  - Right: One random sequence (changes on each reload).  It should have more space to breathe and to have a bigger plot.  Let's start with a square area.

### 3. Implement search and sequence pages

- Enable the search bar component on the homepage
- Build the sequence page.  It will give comprehensive results, and new features, for a single sequence
  - At the top, in bold, have the sequence A-number, a colon, and then its definition
  - Below that, center, large, use the full plot component
  - Include some simple buttons to control the plot, ie standard vs log scale, etc
- Below that, have multiple tabs to organize data.
  - A tab to organize most of the data returned by OEIS
  - A discrete calculus tab, where we compute the first N sequence forward differences, ie discrete derivatives.  For each, also either query OEIS to see if we have a match, and/or define our own sequence class
    - Also do accumulation, ie discrete integral
  - Another tab for other analyses, such as ratios of a(n+1) / a(n), and anything else useful you can think of

- Build the search results page.
  - Use preview components for each search result
  - Add sort options

# EVERYTHING BELOW THIS LINE IS BACKLOGGED, UNTIL YOU SEE THE KEYWORD END_OF_BACKLOG

## Features & Functionality

> **TODO: Fill in priorities and detailed requirements for each feature**

### 1. Sequence Detail Page (Core - POC Migration)
**Priority:** High
**Description:**
- [x] Display sequence metadata (A-number, name, stats)
- [x] Interactive chart visualization
- [x] Raw data display
- [ ] Comments and formulas
- [ ] Cross-references (clickable A-numbers)
- [ ] Copy/share functionality
- [ ] Export options (CSV, JSON)

**Additional Requirements:**
<!-- Add your requirements here -->

---

### 2. Search & Discovery
**Priority:** ___
**Description:**
- [ ] Text search (sequence names, keywords) (If this isn't supported natively in OEIS, then deprioritize this until we can make a backend searchable copy)
- [ ] Search by sequence values (e.g., "1,1,2,3,5,8")
- [ ] Search by A-number
- [ ] Filter by keywords
- [ ] Sort options (relevance, A-number, etc.)

**Additional Requirements:**
<!-- Add your requirements here -->

---

### 3. Browse Interface
**Priority:** ___
**Description:**
- [ ] Browse by category (core, combinatorics, number theory, etc.)
- [ ] Popular/trending sequences
- [ ] Recently added sequences
- [ ] Random sequence generator

**Additional Requirements:**
<!-- Add your requirements here -->

---

### 4. Sequence Comparison
**Priority:** ___
**Description:**
- [ ] Side-by-side sequence display
- [ ] Overlaid chart visualization
- [ ] Difference/ratio calculations
- [ ] Export comparison data

**Additional Requirements:**
<!-- Add your requirements here -->

---

### 5. Favorites & Collections
**Priority:** ___
**Description:**
- [ ] Save favorite sequences (localStorage)
- [ ] Create named collections
- [ ] Notes on sequences
- [ ] Export/import favorites

**Additional Requirements:**
<!-- Add your requirements here -->

---

### 6. Advanced Visualizations
**Priority:** ___
**Description:**
- [ ] Multiple chart types (line, scatter, log scale)
- [ ] Term-to-term differences
- [ ] Growth rate analysis
- [ ] Pattern detection

**Additional Requirements:**
<!-- Add your requirements here -->

---

### 7. Educational Features
**Priority:** ___
**Description:**
- [ ] Sequence explanations/tutorials
- [ ] Example problems
- [ ] Interactive calculators
- [ ] Formula playground

**Additional Requirements:**
<!-- Add your requirements here -->

---

# END_OF_BACKLOG


## Development Workflow

### Local Development
```bash
# Terminal 1 - Backend
cd backend
npm run dev        # Runs on http://localhost:3000

# Terminal 2 - Frontend
cd frontend
npm run dev        # Runs on http://localhost:5173
```

### Environment Variables

**Backend (`.env`):**
```
PORT=3000
OEIS_API_URL=https://oeis.org/search
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173,https://yourusername.github.io
```

**Frontend (`.env`):**
```
VITE_API_URL=http://localhost:3000    # Dev
# VITE_API_URL=https://your-api.vercel.app  # Production
```

---

## Deployment Strategy

### Backend Deployment (Vercel/Railway)

**Vercel:**
1. Connect GitHub repository
2. Configure build: `npm run build`
3. Configure start: `npm start`
4. Set environment variables

**Railway:**
1. Connect GitHub repository
2. Auto-detects Node.js
3. Set environment variables
4. Deploy

### Frontend Deployment (GitHub Pages)

1. Build: `npm run build` (outputs to `/dist`)
2. Deploy: `npm run deploy` (uses `gh-pages` package)
3. Auto-deploy via GitHub Actions on push to `main`

**Vite Configuration for GitHub Pages:**
```typescript
// vite.config.ts
export default defineConfig({
  base: '/seq/',  // Repository name
  plugins: [react()],
})
```

---

## Code Standards

### TypeScript
- Strict mode enabled
- No implicit any
- Interfaces over types
- Explicit return types for exported functions

### React
- Functional components with hooks
- Props interfaces for all components
- Error boundaries for page-level components
- Lazy loading for routes

### Styling
- Component-scoped styles (CSS Modules or styled-components)
- Consistent spacing/sizing system
- Mobile-first responsive design
- Dark mode support

### Testing (Future)
- Unit tests: Vitest
- Component tests: React Testing Library
- E2E tests: Playwright

---

## Performance Considerations

### Frontend
- Code splitting by route
- Lazy load chart library
- Memoize expensive calculations
- Virtualize long lists
- Cache API responses

### Backend
- Response compression (gzip)
- Rate limiting
- Request caching (future: Redis)
- Batch endpoints for multiple sequences

---

## Security Considerations

- CORS properly configured
- Input validation on API
- Rate limiting to prevent abuse
- No sensitive data (no auth required initially)
- XSS prevention (React handles by default)

---

## Future Enhancements

- [ ] User accounts & cloud sync
- [ ] Collaborative collections
- [ ] Sequence submission/editing
- [ ] Advanced search (regex, formulas)
- [ ] Mobile app (React Native)
- [ ] Offline support (PWA)
- [ ] Sequence calculator/generator tools
- [ ] Social features (comments, sharing)

---

## Open Questions / Decisions Needed

1. **Styling Framework:**
   - Option A: Tailwind CSS (utility-first, fast development)
   - Option B: CSS Modules (more control, smaller bundle)
   - Option C: Styled Components (CSS-in-JS)

2. **Chart Library:**
   - Current: Chart.js (simple, lightweight)
   - Alternative: Recharts (React-native, more features)
   - Alternative: D3.js (maximum control, steeper learning curve)

3. **State Management:**
   - Current: React Context
   - Alternative: Zustand (if complexity grows)
   - Alternative: Redux Toolkit (if very complex state)

4. **Backend Framework:**
   - Current: Express (simple, familiar)
   - Alternative: Fastify (faster, modern)
   - Alternative: Next.js API routes (all-in-one)

---

## Timeline Estimate

**Phase 1: Setup & Foundation** (1-2 days)
- Project initialization
- Basic routing
- API proxy working

**Phase 2: Core Features** (2-3 days)
- Sequence detail page
- Home page
- Search functionality

**Phase 3: Polish & Deploy** (1-2 days)
- Styling
- Error handling
- Deployment setup

**Phase 4: Extended Features** (ongoing)
- Based on priority list above

---

## Getting Started

1. Review and fill in the "Features & Functionality" section with priorities
2. Make decisions on "Open Questions"
3. Initialize the project structure
4. Begin implementation following the architecture outlined above

---

Last Updated: 2025-10-28
