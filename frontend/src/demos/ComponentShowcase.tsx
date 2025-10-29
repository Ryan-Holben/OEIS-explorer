/**
 * Component Showcase Demo Page
 *
 * Demonstrates all Phase 2 components:
 * - SearchBar with auto-detection
 * - ANumber inline component with hover previews
 * - SequenceCard in all size variants
 * - SequencePlot (Preview and Full variants)
 */

import { useState } from 'react';
import { SearchBar } from '../components/ui/SearchBar';
import { ANumber } from '../components/sequence/ANumber';
import { SequenceCard } from '../components/sequence/SequenceCard';
import { PreviewPlot, FullPlot } from '../components/sequence/SequencePlot';
import { useSequence, useSearch } from '../hooks/useSequenceData';
import styles from './ComponentShowcase.module.css';

export function ComponentShowcase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedANumber, setSelectedANumber] = useState<string>('A000045');

  // Fetch the selected sequence
  const { sequence, loading, error } = useSequence(selectedANumber);

  // Search results
  const { sequences: searchResults, loading: searchLoading } = useSearch(
    searchQuery.trim() ? searchQuery : null,
    { start: 0, limit: 5 }
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleANumberClick = (id: string) => {
    setSelectedANumber(id);
    setSearchQuery('');
  };

  return (
    <div className={styles.showcase}>
      <header className={styles.header}>
        <h1>Phase 2 Component Showcase</h1>
        <p className={styles.subtitle}>
          Testing all frontend components from Phase 2 Track 1
        </p>
      </header>

      {/* Section 1: Search Bar */}
      <section className={styles.section}>
        <h2>1. Search Bar Component</h2>
        <p>
          Auto-detecting search with hints. Try entering:
          <ul>
            <li>A-number: <code>A000045</code> or <code>45</code></li>
            <li>Sequence: <code>1,1,2,3,5,8</code></li>
            <li>Keywords: <code>fibonacci</code></li>
          </ul>
        </p>
        <div className={styles.demo}>
          <SearchBar
            onSearch={handleSearch}
            loading={searchLoading}
            showHints={true}
          />
        </div>

        {searchResults.length > 0 && (
          <div className={styles.searchResults}>
            <h3>Search Results ({searchResults.length})</h3>
            <div className={styles.cardGrid}>
              {searchResults.map((seq) => (
                <SequenceCard
                  key={seq.id}
                  sequence={seq}
                  size="compact"
                  onClick={() => handleANumberClick(seq.id)}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Section 2: Inline A-number Component */}
      <section className={styles.section}>
        <h2>2. Inline A-number Component</h2>
        <p>
          Clickable A-numbers with hover previews (500ms delay).
          Try hovering over these sequences:
        </p>
        <div className={styles.demo}>
          <div className={styles.inlineExample}>
            <p>
              The <ANumber id="A000045" onClick={handleANumberClick}>Fibonacci sequence</ANumber>{' '}
              is closely related to the <ANumber id="A000032" onClick={handleANumberClick}>Lucas numbers</ANumber>.
              The <ANumber id="A000040" onClick={handleANumberClick}>prime numbers</ANumber>{' '}
              are fundamental to number theory.
            </p>
            <p>
              Other interesting sequences include{' '}
              <ANumber id="A000041" onClick={handleANumberClick}>partitions</ANumber>,{' '}
              <ANumber id="A000108" onClick={handleANumberClick}>Catalan numbers</ANumber>, and{' '}
              <ANumber id="A000110" onClick={handleANumberClick}>Bell numbers</ANumber>.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Sequence Cards */}
      <section className={styles.section}>
        <h2>3. Sequence Card Component</h2>
        <p>
          Preview cards in three size variants: default, compact, and wide.
        </p>

        {sequence && (
          <>
            <div className={styles.demo}>
              <h3>Compact Size</h3>
              <SequenceCard
                sequence={sequence}
                loading={loading}
                error={error}
                size="compact"
                valueCount={8}
              />
            </div>

            <div className={styles.demo}>
              <h3>Default Size</h3>
              <SequenceCard
                sequence={sequence}
                loading={loading}
                error={error}
                size="default"
                valueCount={10}
              />
            </div>

            <div className={styles.demo}>
              <h3>Wide Size</h3>
              <SequenceCard
                sequence={sequence}
                loading={loading}
                error={error}
                size="wide"
                valueCount={15}
              />
            </div>
          </>
        )}

        <div className={styles.demo}>
          <h3>Loading State</h3>
          <SequenceCard
            sequence={null}
            loading={true}
            size="default"
          />
        </div>

        <div className={styles.demo}>
          <h3>Error State</h3>
          <SequenceCard
            sequence={null}
            loading={false}
            error={new Error('Sequence not found')}
            size="default"
          />
        </div>
      </section>

      {/* Section 4: Plot Components */}
      <section className={styles.section}>
        <h2>4. Plot Components</h2>
        <p>
          Two plot variants: minimal PreviewPlot and interactive FullPlot.
        </p>

        {sequence && (
          <>
            <div className={styles.demo}>
              <h3>Preview Plot (Minimal)</h3>
              <div className={styles.plotContainer}>
                <PreviewPlot sequence={sequence} height={120} />
              </div>
            </div>

            <div className={styles.demo}>
              <h3>Full Plot (Interactive)</h3>
              <div className={styles.plotContainer}>
                <FullPlot
                  sequence={sequence}
                  height={300}
                  showGrid={true}
                  showTooltip={true}
                  logScale={false}
                />
              </div>
            </div>

            <div className={styles.demo}>
              <h3>Full Plot (Logarithmic Scale)</h3>
              <div className={styles.plotContainer}>
                <FullPlot
                  sequence={sequence}
                  height={300}
                  showGrid={true}
                  showTooltip={true}
                  logScale={true}
                />
              </div>
            </div>
          </>
        )}
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>
          Phase 2 Complete - All frontend components tested and working
        </p>
      </footer>
    </div>
  );
}
