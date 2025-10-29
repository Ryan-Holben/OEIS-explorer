/**
 * Search Bar Component
 *
 * Reusable search input with:
 * - Auto-detecting search type (A-number, sequence, keywords)
 * - Clear button
 * - Loading state
 * - Search hints
 */

import { useState, type FormEvent, type ChangeEvent } from 'react';
import styles from './SearchBar.module.css';

export interface SearchBarProps {
  /** Initial search value */
  initialValue?: string;

  /** Placeholder text */
  placeholder?: string;

  /** Callback when search is submitted */
  onSearch: (query: string) => void;

  /** Loading state */
  loading?: boolean;

  /** Whether to show search type hints */
  showHints?: boolean;

  /** Additional CSS class */
  className?: string;
}

/**
 * Detect the type of search query
 */
function detectSearchType(query: string): string {
  const trimmed = query.trim();

  if (!trimmed) return 'empty';

  // A-number pattern
  if (/^A?\d{6}$/i.test(trimmed.replace(/[^A0-9]/g, ''))) {
    return 'A-number';
  }

  // Numerical sequence pattern
  if (/^[\d,\s\-]+$/.test(trimmed)) {
    return 'sequence';
  }

  // Otherwise keywords
  return 'keywords';
}

export function SearchBar({
  initialValue = '',
  placeholder = 'Search by A-number, sequence values, or keywords...',
  onSearch,
  loading = false,
  showHints = true,
  className,
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const [searchType, setSearchType] = useState<string>('empty');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSearchType(detectSearchType(value));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim() && !loading) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    setSearchType('empty');
  };

  const getHintText = (): string => {
    switch (searchType) {
      case 'A-number':
        return 'Searching for sequence: <strong>A-number</strong>';
      case 'sequence':
        return 'Searching by: <strong>sequence values</strong>';
      case 'keywords':
        return 'Searching by: <strong>keywords</strong>';
      default:
        return 'Enter an A-number, sequence values (1,1,2,3,5,8), or keywords';
    }
  };

  return (
    <div className={`${styles.searchContainer} ${className || ''}`}>
      <form onSubmit={handleSubmit}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>
            {loading ? (
              <span className={styles.loading}>⟳</span>
            ) : (
              '🔍'
            )}
          </span>

          <input
            type="text"
            className={styles.input}
            value={query}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={loading}
            autoComplete="off"
            spellCheck={false}
          />

          {query && !loading && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={handleClear}
              aria-label="Clear search"
            >
              ×
            </button>
          )}

          <button
            type="submit"
            className={styles.searchButton}
            disabled={!query.trim() || loading}
          >
            Search
          </button>
        </div>

        {showHints && (
          <div
            className={styles.hint}
            dangerouslySetInnerHTML={{ __html: getHintText() }}
          />
        )}
      </form>
    </div>
  );
}
