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
import { FullPlot, PreviewPlot } from '../components/sequence/SequencePlot';
import { ANumber } from '../components/sequence/ANumber';
import { SequenceValuesTable } from '../components/sequence/SequenceValuesTable';
import { PageHeader } from '../components/layout/PageHeader';
import { Tabs, type Tab } from '../components/ui/Tabs';
import type { Sequence } from '../models/Sequence';
import {
  forwardDifference,
  nthForwardDifference,
  accumulation,
  consecutiveRatios,
  isArithmetic,
  isGeometric,
} from '../utils/sequenceAnalysis';
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

  const handleSearch = (query: string) => {
    router.toSearch(query);
  };

  // Helper to create a minimal sequence object for plotting
  const createSequenceFromValues = (values: number[], id: string = 'derived'): Sequence => ({
    id,
    name: 'Derived Sequence',
    values,
    source: 'local',
    metadata: {
      count: values.length,
      minValue: Math.min(...values),
      maxValue: Math.max(...values),
      mean: values.reduce((a, b) => a + b, 0) / values.length,
    },
  });

  const getTabs = (sequence: typeof sequence): Tab[] => {
    const tabs: Tab[] = [];

    // Details Tab
    tabs.push({
      id: 'details',
      label: 'Details',
      content: (
        <>
          {/* Sequence values */}
          <section className={styles.valuesSection}>
            <h2>Sequence Values</h2>
            <SequenceValuesTable values={sequence.values} />
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
        </>
      ),
    });

    // Discrete Calculus Tab
    const diff1 = forwardDifference(sequence.values);
    const diff2 = diff1.length > 0 ? forwardDifference(diff1) : [];
    const diff3 = diff2.length > 0 ? forwardDifference(diff2) : [];
    const accum = accumulation(sequence.values);

    tabs.push({
      id: 'calculus',
      label: 'Discrete Calculus',
      content: (
        <>
          <section className={styles.calculusSection}>
            <div className={styles.calculusIntro}>
              <p>
                Discrete calculus explores the behavior of sequences through differences and accumulation.
              </p>
            </div>

            {/* Forward Differences */}
            <div className={styles.calculusGroup}>
              <h3>Forward Differences (Discrete Derivatives)</h3>
              {diff1.length > 0 && (
                <>
                  <h4>First Difference: Δa(n) = a(n+1) - a(n)</h4>
                  <div className={styles.analysisRow}>
                    <SequenceValuesTable values={diff1} />
                    <div className={styles.plotPreview}>
                      <PreviewPlot sequence={createSequenceFromValues(diff1)} height={150} showZeroAxis={true} />
                    </div>
                  </div>
                </>
              )}
              {diff2.length > 0 && (
                <>
                  <h4>Second Difference: Δ²a(n)</h4>
                  <div className={styles.analysisRow}>
                    <SequenceValuesTable values={diff2} />
                    <div className={styles.plotPreview}>
                      <PreviewPlot sequence={createSequenceFromValues(diff2)} height={150} showZeroAxis={true} />
                    </div>
                  </div>
                </>
              )}
              {diff3.length > 0 && (
                <>
                  <h4>Third Difference: Δ³a(n)</h4>
                  <div className={styles.analysisRow}>
                    <SequenceValuesTable values={diff3} />
                    <div className={styles.plotPreview}>
                      <PreviewPlot sequence={createSequenceFromValues(diff3)} height={150} showZeroAxis={true} />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Accumulation */}
            {accum.length > 0 && (
              <div className={styles.calculusGroup}>
                <h3>Accumulation (Discrete Integral)</h3>
                <p>Cumulative sum of sequence values</p>
                <div className={styles.analysisRow}>
                  <SequenceValuesTable values={accum} />
                  <div className={styles.plotPreview}>
                    <PreviewPlot sequence={createSequenceFromValues(accum)} height={150} showZeroAxis={true} />
                  </div>
                </div>
              </div>
            )}
          </section>
        </>
      ),
    });

    // Analysis Tab
    const ratios = consecutiveRatios(sequence.values);
    const arithmetic = isArithmetic(sequence.values);
    const geometric = isGeometric(sequence.values);

    tabs.push({
      id: 'analysis',
      label: 'Analysis',
      content: (
        <>
          <section className={styles.analysisSection}>
            <div className={styles.analysisIntro}>
              <p>
                Various mathematical analyses of the sequence's properties and patterns.
              </p>
            </div>

            {/* Properties */}
            <div className={styles.analysisGroup}>
              <h3>Sequence Properties</h3>
              <div className={styles.propertiesList}>
                <div className={styles.propertyItem}>
                  <span className={styles.propertyLabel}>Arithmetic:</span>
                  <span className={styles.propertyValue}>
                    {arithmetic ? 'Yes (constant differences)' : 'No'}
                  </span>
                </div>
                <div className={styles.propertyItem}>
                  <span className={styles.propertyLabel}>Geometric:</span>
                  <span className={styles.propertyValue}>
                    {geometric ? 'Yes (constant ratios)' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Consecutive Ratios */}
            {ratios.length > 0 && (
              <div className={styles.analysisGroup}>
                <h3>Consecutive Ratios: a(n+1) / a(n)</h3>
                <div className={styles.analysisRow}>
                  <SequenceValuesTable
                    values={ratios.map(r => Math.round(r * 1000) / 1000)}
                  />
                  <div className={styles.plotPreview}>
                    <PreviewPlot
                      sequence={createSequenceFromValues(ratios.map(r => Math.round(r * 1000) / 1000))}
                      height={150}
                      showZeroAxis={true}
                    />
                  </div>
                </div>
              </div>
            )}
          </section>
        </>
      ),
    });

    return tabs;
  };

  return (
    <div className={styles.page}>
      <PageHeader
        onBackClick={router.toHome}
        onSearch={handleSearch}
        showSearchHints={false}
      />

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

        {/* Tabs for organizing data */}
        <section className={styles.tabsSection}>
          <Tabs
            tabs={getTabs(sequence)}
            defaultTab="details"
          />
        </section>
      </main>
    </div>
  );
}
