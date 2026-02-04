/**
 * Sequence Preview Card Component
 *
 * Displays a preview of a sequence with:
 * - A-number and name
 * - First values of the sequence
 * - Preview plot
 *
 * Clickable card that navigates to the sequence detail page
 */

import type { Sequence } from '../../models/Sequence';
import { PreviewPlot } from './SequencePlot';
import styles from './SequenceCard.module.css';

export interface SequenceCardProps {
  /** Sequence to display */
  sequence: Sequence | null;

  /** Loading state */
  loading?: boolean;

  /** Error state */
  error?: Error | null;

  /** Size variant */
  size?: 'default' | 'compact' | 'wide';

  /** Number of values to show */
  valueCount?: number;

  /** Optional click handler (if not provided, navigates to sequence page) */
  onClick?: () => void;

  /** Additional CSS class */
  className?: string;
}

export function SequenceCard({
  sequence,
  loading = false,
  error = null,
  size = 'default',
  valueCount = 10,
  onClick,
  className,
}: SequenceCardProps) {
  // Loading state
  if (loading) {
    return (
      <div className={`${styles.card} ${styles.loading} ${styles[size]} ${className || ''}`}>
        <div className={styles.header}>
          <div className={styles.aNumber}>A??????</div>
          <div className={styles.name}>Loading...</div>
        </div>
        <div className={styles.data}>...</div>
        <div className={styles.plot}></div>
      </div>
    );
  }

  // Error state
  if (error || !sequence) {
    return (
      <div className={`${styles.card} ${styles.error} ${styles[size]} ${className || ''}`}>
        <div className={styles.header}>
          <div className={styles.aNumber}>Error</div>
        </div>
        <div className={styles.errorMessage}>
          {error?.message || 'Sequence not found'}
        </div>
      </div>
    );
  }

  // Normal state with data
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
    // Otherwise default link behavior navigates to sequence page
  };

  const href = `/#/sequence/${sequence.id}`;

  const previewValues = sequence.values.slice(0, valueCount);
  const hasMore = sequence.values.length > valueCount;

  const Content = () => (
    <>
      <div className={styles.header}>
        <div className={styles.aNumber}>{sequence.id}</div>
        <div className={styles.name}>{sequence.name}</div>
      </div>
      <div className={styles.data}>
        {previewValues.join(', ')}
        {hasMore && ', ...'}
      </div>
      <div className={styles.plot}>
        <PreviewPlot sequence={sequence} height={size === 'compact' ? 80 : 120} showYAxis={false} />
      </div>
    </>
  );

  // Wide variant has different structure
  if (size === 'wide') {
    return (
      <a
        href={href}
        className={`${styles.card} ${styles[size]} ${className || ''}`}
        onClick={handleClick}
      >
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.aNumber}>{sequence.id}</div>
            <div className={styles.name}>{sequence.name}</div>
          </div>
          <div className={styles.data}>
            {previewValues.join(', ')}
            {hasMore && ', ...'}
          </div>
        </div>
        <div className={styles.plot}>
          <PreviewPlot sequence={sequence} height={150} showYAxis={false} />
        </div>
      </a>
    );
  }

  return (
    <a
      href={href}
      className={`${styles.card} ${styles[size]} ${className || ''}`}
      onClick={handleClick}
    >
      <Content />
    </a>
  );
}
