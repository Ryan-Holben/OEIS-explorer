import { ReactNode, HTMLAttributes } from 'react';
import styles from './Panel.module.css';

export interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Content to display inside the panel */
  children: ReactNode;

  /** Padding size */
  size?: 'small' | 'medium' | 'large' | 'xlarge';

  /** Shadow elevation */
  elevation?: 'flat' | 'elevated' | 'floating';

  /** Make panel clickable with hover effects */
  clickable?: boolean;

  /** Full width panel */
  fullWidth?: boolean;

  /** Center content */
  centered?: boolean;

  /** Additional className */
  className?: string;
}

/**
 * Panel - A flat-looking container with rounded edges and subtle shadow.
 * Core building block for the Sequential UI design system.
 *
 * Supports light and dark mode automatically via CSS variables.
 */
export const Panel = ({
  children,
  size = 'medium',
  elevation = 'elevated',
  clickable = false,
  fullWidth = false,
  centered = false,
  className = '',
  ...rest
}: PanelProps) => {
  const classNames = [
    styles.panel,
    styles[size],
    styles[elevation],
    clickable && styles.clickable,
    fullWidth && styles.fullWidth,
    centered && styles.centered,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} {...rest}>
      {children}
    </div>
  );
};
