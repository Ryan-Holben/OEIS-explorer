import { useTheme } from '../../hooks/useTheme.tsx';
import styles from './ThemeToggle.module.css';

export const ThemeToggle = () => {
  const { theme, setTheme, effectiveTheme } = useTheme();

  const cycleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getIcon = () => {
    if (theme === 'system') return '🌓';
    return effectiveTheme === 'dark' ? '🌙' : '☀️';
  };

  const getLabel = () => {
    if (theme === 'system') return 'System';
    return effectiveTheme === 'dark' ? 'Dark' : 'Light';
  };

  return (
    <button className={styles.themeToggle} onClick={cycleTheme} title="Toggle theme">
      <span className={styles.icon}>{getIcon()}</span>
      <span className={styles.label}>{getLabel()}</span>
    </button>
  );
};
