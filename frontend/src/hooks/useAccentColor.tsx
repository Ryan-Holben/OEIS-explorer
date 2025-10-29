import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useTheme } from './useTheme.tsx';

export type AccentColor = 'red' | 'blue' | 'green' | 'purple' | 'orange';

interface AccentColorContextType {
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
}

const AccentColorContext = createContext<AccentColorContextType | undefined>(undefined);

// Light mode colors - brighter, more saturated
const LIGHT_MODE_COLORS = {
  red: {
    primary: '#ef4444',
    primaryHover: '#dc2626',
    secondary: '#f87171',
  },
  blue: {
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    secondary: '#60a5fa',
  },
  green: {
    primary: '#10b981',
    primaryHover: '#059669',
    secondary: '#34d399',
  },
  purple: {
    primary: '#a855f7',
    primaryHover: '#9333ea',
    secondary: '#c084fc',
  },
  orange: {
    primary: '#f97316',
    primaryHover: '#ea580c',
    secondary: '#fb923c',
  },
};

// Dark mode colors - softer, lighter tones
const DARK_MODE_COLORS = {
  red: {
    primary: '#f87171',
    primaryHover: '#fca5a5',
    secondary: '#fecaca',
  },
  blue: {
    primary: '#60a5fa',
    primaryHover: '#93c5fd',
    secondary: '#bfdbfe',
  },
  green: {
    primary: '#34d399',
    primaryHover: '#6ee7b7',
    secondary: '#a7f3d0',
  },
  purple: {
    primary: '#c084fc',
    primaryHover: '#d8b4fe',
    secondary: '#e9d5ff',
  },
  orange: {
    primary: '#fb923c',
    primaryHover: '#fdba74',
    secondary: '#fed7aa',
  },
};

// Export for use in AccentColorPicker (always use light mode colors for preview circles)
export const ACCENT_COLORS = LIGHT_MODE_COLORS;

const STORAGE_KEY = 'sequential-accent-color';

function getInitialAccentColor(): AccentColor {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && stored in ACCENT_COLORS) {
    return stored as AccentColor;
  }
  return 'red';
}

function applyAccentColor(color: AccentColor, isDark: boolean) {
  const root = document.documentElement;
  const colorPalette = isDark ? DARK_MODE_COLORS : LIGHT_MODE_COLORS;
  const colors = colorPalette[color];

  root.style.setProperty('--color-accent-primary', colors.primary);
  root.style.setProperty('--color-accent-primary-hover', colors.primaryHover);
  root.style.setProperty('--color-accent-secondary', colors.secondary);
}

export const AccentColorProvider = ({ children }: { children: ReactNode }) => {
  const [accentColor, setAccentColorState] = useState<AccentColor>(() => getInitialAccentColor());
  const { effectiveTheme } = useTheme();

  useEffect(() => {
    applyAccentColor(accentColor, effectiveTheme === 'dark');
    localStorage.setItem(STORAGE_KEY, accentColor);
  }, [accentColor, effectiveTheme]);

  const setAccentColor = (color: AccentColor) => {
    setAccentColorState(color);
  };

  return (
    <AccentColorContext.Provider value={{ accentColor, setAccentColor }}>
      {children}
    </AccentColorContext.Provider>
  );
};

export const useAccentColor = () => {
  const context = useContext(AccentColorContext);
  if (!context) {
    throw new Error('useAccentColor must be used within AccentColorProvider');
  }
  return context;
};

export { ACCENT_COLORS };
