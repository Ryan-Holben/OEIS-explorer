import { useState, useRef, useEffect } from 'react';
import { useAccentColor, ACCENT_COLORS, type AccentColor } from '../../hooks/useAccentColor';
import styles from './AccentColorPicker.module.css';

export const AccentColorPicker = () => {
  const { accentColor, setAccentColor } = useAccentColor();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const colors: AccentColor[] = ['red', 'blue', 'green', 'purple', 'orange'];

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        title="Change accent color"
        aria-label="Accent color picker"
      >
        <div
          className={styles.colorCircle}
          style={{ backgroundColor: ACCENT_COLORS[accentColor].primary }}
        />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {colors.map((color) => (
            <button
              key={color}
              className={`${styles.colorOption} ${color === accentColor ? styles.selected : ''}`}
              onClick={() => {
                setAccentColor(color);
                setIsOpen(false);
              }}
              title={color.charAt(0).toUpperCase() + color.slice(1)}
            >
              <div
                className={styles.colorCircle}
                style={{ backgroundColor: ACCENT_COLORS[color].primary }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
