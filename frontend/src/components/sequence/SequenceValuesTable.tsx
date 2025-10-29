/**
 * Sequence Values Table Component
 *
 * Displays sequence values in a 2-row table format:
 * - Top row: a(n) values in accent color
 * - Bottom row: n indices in grey
 * - Accent color separators
 */

import styles from './SequenceValuesTable.module.css';

export interface SequenceValuesTableProps {
  /** Array of sequence values */
  values: number[];

  /** Maximum number of values to display */
  maxCount?: number;

  /** Starting index (default 0) */
  startIndex?: number;
}

export function SequenceValuesTable({
  values,
  maxCount,
  startIndex = 0,
}: SequenceValuesTableProps) {
  const displayValues = maxCount ? values.slice(0, maxCount) : values;
  const hasMore = maxCount ? values.length > maxCount : false;

  return (
    <div className={styles.container}>
      <div className={styles.table}>
        {/* Header column */}
        <div className={styles.headerColumn}>
          <div className={styles.headerCell}>a(n)</div>
          <div className={styles.headerCell}>n</div>
        </div>

        {/* Accent separator */}
        <div className={styles.accentSeparator} />

        {/* Value columns */}
        <div className={styles.valuesContainer}>
          {displayValues.map((value, index) => (
            <div key={index} className={styles.valueColumn}>
              <div className={styles.valueCell}>{value}</div>
              <div className={styles.indexCell}>{startIndex + index}</div>
            </div>
          ))}
        </div>
      </div>

      {hasMore && (
        <div className={styles.moreIndicator}>
          ... and {values.length - maxCount} more values
        </div>
      )}
    </div>
  );
}
