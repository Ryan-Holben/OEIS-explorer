/**
 * Inline A-number component
 *
 * Usage: <ANumber id="A000045" /> or <ANumber id="A000045">Fibonacci</ANumber>
 *
 * - Inline pill-style display
 * - Clickable link to sequence page
 * - Hover shows preview after delay
 */

import { useState, useRef, useEffect, type ReactNode } from 'react';
import { useSequence } from '../../hooks/useSequenceData';
import styles from './ANumber.module.css';

export interface ANumberProps {
  /** A-number (e.g., "A000045" or just "000045") */
  id: string;

  /** Optional children to display instead of A-number */
  children?: ReactNode;

  /** Delay before showing preview on hover (milliseconds) */
  hoverDelay?: number;

  /** Whether to show preview on hover */
  showPreview?: boolean;

  /** Optional click handler (if not provided, navigates to sequence page) */
  onClick?: () => void;

  /** Additional CSS class */
  className?: string;
}

/**
 * Normalize A-number format
 */
function normalizeANumber(id: string): string {
  // Remove any non-alphanumeric characters and ensure A prefix
  const cleaned = id.toUpperCase().replace(/[^A0-9]/g, '');
  return cleaned.startsWith('A') ? cleaned : `A${cleaned}`;
}

export function ANumber({
  id,
  children,
  hoverDelay = 500,
  showPreview = true,
  onClick,
  className,
}: ANumberProps) {
  const normalized = normalizeANumber(id);
  const [showingPreview, setShowingPreview] = useState(false);
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });
  const hoverTimeoutRef = useRef<number>();
  const elementRef = useRef<HTMLAnchorElement>(null);

  // Only fetch sequence data if we might show preview
  const { sequence, loading, error } = useSequence(showPreview && showingPreview ? normalized : null);

  const handleMouseEnter = () => {
    if (!showPreview) return;

    hoverTimeoutRef.current = window.setTimeout(() => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        setPreviewPosition({
          x: rect.left + rect.width / 2,
          y: rect.bottom + 8,
        });
        setShowingPreview(true);
      }
    }, hoverDelay);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Delay hiding to allow moving to preview
    setTimeout(() => {
      setShowingPreview(false);
    }, 100);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
    // Otherwise, default link behavior navigates to the sequence page
  };

  const classNames = [
    styles.anumber,
    loading && styles.loading,
    error && styles.error,
    className,
  ].filter(Boolean).join(' ');

  const displayText = children || normalized;
  const href = `/#/sequence/${normalized}`;

  return (
    <>
      <a
        ref={elementRef}
        href={href}
        className={classNames}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        title={`View ${normalized}`}
      >
        {displayText}
      </a>

      {/* Preview popup (rendered later to avoid being cut off by parent) */}
      {showingPreview && showPreview && sequence && (
        <PreviewPopup
          sequence={sequence}
          position={previewPosition}
          onClose={() => setShowingPreview(false)}
        />
      )}
    </>
  );
}

/**
 * Preview popup component
 */
interface PreviewPopupProps {
  sequence: any; // Will be Sequence type
  position: { x: number; y: number };
  onClose: () => void;
}

function PreviewPopup({ sequence, position, onClose }: PreviewPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Adjust position if popup would go off-screen
    if (popupRef.current) {
      const rect = popupRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let x = position.x - rect.width / 2;
      let y = position.y;

      // Keep within viewport horizontally
      if (x < 10) x = 10;
      if (x + rect.width > viewportWidth - 10) {
        x = viewportWidth - rect.width - 10;
      }

      // Keep within viewport vertically
      if (y + rect.height > viewportHeight - 10) {
        y = position.y - rect.height - 40; // Show above instead
      }

      popupRef.current.style.left = `${x}px`;
      popupRef.current.style.top = `${y}px`;
    }
  }, [position]);

  return (
    <div
      ref={popupRef}
      className={`${styles.previewContainer} ${styles.visible}`}
      style={{ left: position.x, top: position.y }}
      onMouseEnter={() => {/* Keep preview open */}}
      onMouseLeave={onClose}
    >
      {/* Preview card will go here - for now just a simple preview */}
      <div style={{
        backgroundColor: 'var(--color-panel-bg)',
        border: '1px solid var(--color-panel-border)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-md)',
        maxWidth: '400px',
        boxShadow: 'var(--shadow-xl)',
        pointerEvents: 'auto',
      }}>
        <div style={{ fontWeight: 600, marginBottom: 'var(--space-xs)', color: 'var(--color-accent-primary)' }}>
          {sequence.id}
        </div>
        <div style={{ fontSize: '0.9rem', marginBottom: 'var(--space-sm)', color: 'var(--color-text-primary)' }}>
          {sequence.name}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
          {sequence.values.slice(0, 10).join(', ')}
          {sequence.values.length > 10 && ', ...'}
        </div>
      </div>
    </div>
  );
}
