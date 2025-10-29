/**
 * Sequence Detail Page
 *
 * Displays comprehensive information about a single sequence:
 * - A-number and name at top
 * - Full interactive plot with controls
 * - Sequence values
 * - Metadata and additional info
 */

import { useState } from 'react';
import { useSequence } from '../hooks/useSequenceData';
import { router } from '../hooks/useRouter';
import { FullPlot } from '../components/sequence/SequencePlot';
import { ANumber } from '../components/sequence/ANumber';
import { SequenceValuesTable } from '../components/sequence/SequenceValuesTable';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import styles from './SequenceDetailPage.module.css';

export interface SequenceDetailPageProps {
  sequenceId: string;
}

export function SequenceDetailPage({ sequenceId }: SequenceDetailPageProps) {
  const { sequence, loading, error } = useSequence(sequenceId);
  const [logScale, setLogScale] = useState(false);
  const [showGrid, setShowGrid] = useState(true);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}>⟳</div>
          <p>Loading sequence {sequenceId}...</p>
        </div>
      </div>
    );
  }

  if (error || !sequence) {
    return (
      <div className={styles.page}>
        <div className={styles.errorContainer}>
          <h1>Sequence Not Found</h1>
          <p>{error?.message || `Could not find sequence ${sequenceId}`}</p>
          <button onClick={router.toHome} className={styles.homeButton}>
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Header with back button */}
      <header className={styles.header}>
        <button onClick={router.toHome} className={styles.backButton}>
          ← Home
        </button>
        <div className={styles.themeToggleContainer}>
          <ThemeToggle />
        </div>
      </header>

      {/* Main content */}
      <main className={styles.content}>
        {/* Title section */}
        <section className={styles.titleSection}>
          <h1 className={styles.title}>
            <span className={styles.aNumber}>{sequence.id}</span>
            <span className={styles.separator}>:</span>
            <span className={styles.name}>{sequence.name}</span>
          </h1>
        </section>

        {/* Plot section with controls */}
        <section className={styles.plotSection}>
          <div className={styles.plotControls}>
            <label className={styles.controlLabel}>
              <input
                type="checkbox"
                checked={logScale}
                onChange={(e) => setLogScale(e.target.checked)}
              />
              <span>Logarithmic scale</span>
            </label>
            <label className={styles.controlLabel}>
              <input
                type="checkbox"
                checked={showGrid}
                onChange={(e) => setShowGrid(e.target.checked)}
              />
              <span>Show grid</span>
            </label>
          </div>

          <div className={styles.plotContainer}>
            <FullPlot
              sequence={sequence}
              height={400}
              logScale={logScale}
              showGrid={showGrid}
              showTooltip={true}
            />
          </div>
        </section>

        {/* Sequence values */}
        <section className={styles.valuesSection}>
          <h2>Sequence Values</h2>
          <SequenceValuesTable values={sequence.values} maxCount={50} />
        </section>

        {/* Metadata section */}
        <section className={styles.metadataSection}>
          <h2>Metadata</h2>
          <div className={styles.metadataGrid}>
            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>A-number</span>
              <span className={styles.metadataValue}>{sequence.id}</span>
            </div>
            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>Count</span>
              <span className={styles.metadataValue}>{sequence.metadata.count}</span>
            </div>
            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>Min Value</span>
              <span className={styles.metadataValue}>{sequence.metadata.minValue}</span>
            </div>
            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>Max Value</span>
              <span className={styles.metadataValue}>{sequence.metadata.maxValue}</span>
            </div>
            {sequence.metadata.mean !== undefined && (
              <div className={styles.metadataItem}>
                <span className={styles.metadataLabel}>Mean</span>
                <span className={styles.metadataValue}>
                  {sequence.metadata.mean.toFixed(2)}
                </span>
              </div>
            )}
            {sequence.metadata.created && (
              <div className={styles.metadataItem}>
                <span className={styles.metadataLabel}>Created</span>
                <span className={styles.metadataValue}>
                  {new Date(sequence.metadata.created).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Raw data display (if available from OEIS) */}
        {sequence.source === 'oeis' && (
          <section className={styles.rawDataSection}>
            <h2>OEIS Data</h2>
            <div className={styles.rawDataBox}>
              <p>
                <strong>Name:</strong> {sequence.name}
              </p>
              <p>
                <strong>Values:</strong> {sequence.values.join(', ')}
              </p>
              <p className={styles.oeisLink}>
                <a
                  href={`https://oeis.org/${sequence.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on OEIS.org →
                </a>
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
