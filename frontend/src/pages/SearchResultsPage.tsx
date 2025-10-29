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
import { SearchBar } from '../components/ui/SearchBar';
import { SequenceCard } from '../components/sequence/SequenceCard';
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
  const [limit] = useState(20);

  const { sequences, loading, error, count } = useSearch(query, {
    start: 0,
    limit,
    sort,
  });

  // Update query when initialQuery prop changes
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSearch = (newQuery: string) => {
    router.toSearch(newQuery);
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button onClick={router.toHome} className={styles.backButton}>
            ← Home
          </button>

          <div className={styles.searchContainer}>
            <SearchBar
              initialValue={query}
              onSearch={handleSearch}
              loading={loading}
              showHints={false}
            />
          </div>
        </div>
      </header>

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
                Found <strong>{count}</strong> {count === 1 ? 'sequence' : 'sequences'}
                {query && ` for "${query}"`}
              </span>
            )}
          </div>

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

        {/* Show message if results are limited */}
        {!loading && sequences.length === limit && count > limit && (
          <div className={styles.limitMessage}>
            Showing first {limit} of {count} results
          </div>
        )}
      </main>
    </div>
  );
}
