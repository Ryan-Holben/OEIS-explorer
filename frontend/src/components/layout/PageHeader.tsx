/**
 * Page Header Component
 *
 * Reusable header with back button, search bar, and theme controls
 */

import { SearchBar } from '../ui/SearchBar';
import { ThemeToggle } from '../ui/ThemeToggle';
import { AccentColorPicker } from '../ui/AccentColorPicker';
import styles from './PageHeader.module.css';

export interface PageHeaderProps {
  /** Back button text */
  backButtonText?: string;

  /** Back button href */
  backButtonHref?: string;

  /** Back button click handler */
  onBackClick: () => void;

  /** Search handler */
  onSearch: (query: string) => void;

  /** Initial search value */
  searchValue?: string;

  /** Whether search is loading */
  searchLoading?: boolean;

  /** Show search hints */
  showSearchHints?: boolean;
}

export function PageHeader({
  backButtonText = '← Home',
  backButtonHref = '/',
  onBackClick,
  onSearch,
  searchValue,
  searchLoading = false,
  showSearchHints = false,
}: PageHeaderProps) {
  const handleBackClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Only prevent default for regular clicks (not Ctrl/Cmd/Shift clicks)
    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault();
      onBackClick();
    }
  };

  return (
    <header className={styles.header}>
      <a
        href={backButtonHref}
        onClick={handleBackClick}
        className={styles.backButton}
      >
        {backButtonText}
      </a>
      <div className={styles.headerSearchContainer}>
        <SearchBar
          initialValue={searchValue}
          onSearch={onSearch}
          placeholder="Search by A-number, sequence values, or keywords..."
          showHints={showSearchHints}
          loading={searchLoading}
        />
      </div>
      <div className={styles.themeToggleContainer}>
        <AccentColorPicker />
        <ThemeToggle />
      </div>
    </header>
  );
}
