import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type AccentColor = 'red' | 'blue' | 'green' | 'purple' | 'orange';

interface AccentColorContextType {
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
}

const AccentColorContext = createContext<AccentColorContextType | undefined>(undefined);

const ACCENT_COLORS = {
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

const STORAGE_KEY = 'sequential-accent-color';

function getInitialAccentColor(): AccentColor {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && stored in ACCENT_COLORS) {
    return stored as AccentColor;
  }
  return 'red';
}

function applyAccentColor(color: AccentColor) {
  const root = document.documentElement;
  const colors = ACCENT_COLORS[color];

  root.style.setProperty('--color-accent-primary', colors.primary);
  root.style.setProperty('--color-accent-primary-hover', colors.primaryHover);
  root.style.setProperty('--color-accent-secondary', colors.secondary);
}

export const AccentColorProvider = ({ children }: { children: ReactNode }) => {
  const [accentColor, setAccentColorState] = useState<AccentColor>(() => getInitialAccentColor());

  useEffect(() => {
    applyAccentColor(accentColor);
    localStorage.setItem(STORAGE_KEY, accentColor);
  }, [accentColor]);

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
