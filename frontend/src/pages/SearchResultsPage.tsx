/**
 * Search Results Page
 *
 * Displays search results with:
 * - Search bar at top
 * - Sort options
 * - Grid of sequence preview cards
 * - Pagination support
 */

import { useState, useEffect } from 'react';
import { SequenceCard } from '../components/sequence/SequenceCard';
import { PageHeader } from '../components/layout/PageHeader';
import { useSearch } from '../hooks/useSequenceData';
import { router } from '../hooks/useRouter';
import styles from './SearchResultsPage.module.css';

export interface SearchResultsPageProps {
  initialQuery: string;
}

type SortOption = 'relevance' | 'number' | 'modified' | 'created';

export function SearchResultsPage({ initialQuery }: SearchResultsPageProps) {
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<SortOption>('relevance');
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const start = (page - 1) * limit;

  const { sequences, loading, error, count } = useSearch(query, {
    start,
    limit,
    sort,
  });

  // Update query when initialQuery prop changes and reset to page 1
  useEffect(() => {
    setQuery(initialQuery);
    setPage(1);
  }, [initialQuery]);

  // Reset to page 1 when sort changes
  useEffect(() => {
    setPage(1);
  }, [sort]);

  const handleSearch = (newQuery: string) => {
    router.toSearch(newQuery);
  };

  return (
    <div className={styles.page}>
      <PageHeader
        onBackClick={router.toHome}
        onSearch={handleSearch}
        searchValue={query}
        searchLoading={loading}
        showSearchHints={false}
      />

      {/* Main content */}
      <main className={styles.content}>
        {/* Results header with count and sort */}
        <div className={styles.resultsHeader}>
          <div className={styles.resultsInfo}>
            {loading ? (
              <span>Searching...</span>
            ) : error ? (
              <span className={styles.error}>Error: {error.message}</span>
            ) : (
              <span>
                Displaying <strong>{sequences.length}</strong> {sequences.length === 1 ? 'sequence' : 'sequences'}
                {query && ` for "${query}"`}
              </span>
            )}
          </div>

          {/* Top pagination controls */}
          {!loading && !error && (page > 1 || sequences.length === limit) && (
            <div className={styles.paginationTop}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className={styles.paginationButton}
              >
                ← Previous
              </button>

              <div className={styles.paginationInfo}>
                Page {page}
              </div>

              <button
                onClick={() => setPage(p => p + 1)}
                disabled={sequences.length < limit}
                className={styles.paginationButton}
              >
                Next →
              </button>
            </div>
          )}

          <div className={styles.sortControls}>
            <label htmlFor="sort">Sort by:</label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className={styles.sortSelect}
            >
              <option value="relevance">Relevance</option>
              <option value="number">A-number</option>
              <option value="modified">Recently Modified</option>
              <option value="created">Recently Created</option>
            </select>
          </div>
        </div>

        {/* Results grid */}
        {loading ? (
          <div className={styles.resultsGrid}>
            {Array.from({ length: limit }).map((_, i) => (
              <SequenceCard
                key={i}
                sequence={null}
                loading={true}
                size="default"
              />
            ))}
          </div>
        ) : error ? (
          <div className={styles.emptyState}>
            <p>Could not load search results. Please try again.</p>
          </div>
        ) : sequences.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No sequences found matching your search.</p>
            <p className={styles.emptyHint}>Try different keywords or sequence values.</p>
          </div>
        ) : (
          <div className={styles.resultsGrid}>
            {sequences.map((seq) => (
              <SequenceCard
                key={seq.id}
                sequence={seq}
                size="default"
                valueCount={10}
              />
            ))}
          </div>
        )}

        {/* Pagination controls */}
        {!loading && !error && (page > 1 || sequences.length === limit) && (
          <div className={styles.pagination}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className={styles.paginationButton}
            >
              ← Previous
            </button>

            <div className={styles.paginationInfo}>
              Page {page}
            </div>

            <button
              onClick={() => setPage(p => p + 1)}
              disabled={sequences.length < limit}
              className={styles.paginationButton}
            >
              Next →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
