/**
 * Homepage Component
 *
 * Features:
 * - Search bar at top
 * - Left column: Recent sequences feed
 * - Right column: Random sequence showcase
 */

import { useState } from 'react';
import { SearchBar } from '../components/ui/SearchBar';
import { SequenceCard } from '../components/sequence/SequenceCard';
import { useRecentSequences, useRandomSequence } from '../hooks/useSequenceData';
import { router } from '../hooks/useRouter';
import styles from './HomePage.module.css';

const RECENT_SEQUENCES_COUNT = 8;

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [randomTrigger, setRandomTrigger] = useState(0);

  // Fetch recent sequences
  const { sequences: recentSequences, loading: recentLoading } = useRecentSequences(RECENT_SEQUENCES_COUNT);

  // Fetch random sequence
  const { sequence: randomSequence, loading: randomLoading } = useRandomSequence(randomTrigger);

  const handleSearch = (query: string) => {
    router.toSearch(query);
  };

  const handleRefreshRandom = () => {
    setRandomTrigger(prev => prev + 1);
  };

  return (
    <div className={styles.homePage}>
      {/* Header with branding and search */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Sequential</h1>
          <p className={styles.subtitle}>
            Explore the Online Encyclopedia of Integer Sequences
          </p>
        </div>

        <div className={styles.searchContainer}>
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search by A-number, sequence values, or keywords..."
            showHints={true}
          />
        </div>
      </header>

      {/* Main content: Two columns */}
      <main className={styles.mainContent}>
        {/* Left column: Recent sequences */}
        <section className={styles.recentColumn}>
          <div className={styles.sectionHeader}>
            <h2>Recently Added</h2>
          </div>

          <div className={styles.recentFeed}>
            {recentLoading ? (
              // Loading skeletons
              Array.from({ length: RECENT_SEQUENCES_COUNT }).map((_, i) => (
                <div key={i} className={styles.recentItem}>
                  <SequenceCard
                    sequence={null}
                    loading={true}
                    size="wide"
                    valueCount={12}
                  />
                </div>
              ))
            ) : (
              recentSequences.map((seq) => (
                <div key={seq.id} className={styles.recentItem}>
                  <div className={styles.dateLabel}>
                    {formatDate(seq.metadata.created)}
                  </div>
                  <SequenceCard
                    sequence={seq}
                    size="wide"
                    valueCount={12}
                  />
                </div>
              ))
            )}
          </div>
        </section>

        {/* Right column: Random sequence */}
        <aside className={styles.randomColumn}>
          <div className={styles.sectionHeader}>
            <h2>Random Sequence</h2>
            <button
              className={styles.refreshButton}
              onClick={handleRefreshRandom}
              disabled={randomLoading}
              title="Get another random sequence"
            >
              {randomLoading ? '⟳' : '🎲'}
            </button>
          </div>

          <div className={styles.randomShowcase}>
            {randomLoading || !randomSequence ? (
              <SequenceCard
                sequence={null}
                loading={randomLoading}
                size="default"
                valueCount={15}
              />
            ) : (
              <SequenceCard
                sequence={randomSequence}
                size="default"
                valueCount={15}
              />
            )}
          </div>

          <div className={styles.randomDescription}>
            <p>
              Discover sequences from across the OEIS database.
              Click the dice to explore another!
            </p>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>
          Data from{' '}
          <a href="https://oeis.org" target="_blank" rel="noopener noreferrer">
            The On-Line Encyclopedia of Integer Sequences
          </a>
        </p>
      </footer>
    </div>
  );
}

/**
 * Format date for display
 */
function formatDate(dateString: string | undefined): string {
  if (!dateString) return 'Recently added';

  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Recently added';
  }
}
