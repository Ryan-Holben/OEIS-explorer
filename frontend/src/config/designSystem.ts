/**
 * Sequential Design System Configuration
 *
 * Central configuration for the app's visual design system.
 * Defines colors, typography, spacing, and other design tokens.
 */

export const designSystem = {
  // Typography
  fonts: {
    primary: "'Space Grotesk', sans-serif",
    mono: "'JetBrains Mono', 'SF Mono', 'Monaco', monospace",
  },

  // Accent Color Palettes
  // Default: Red
  // Additional options available for future user customization
  accentColors: {
    red: {
      name: 'Red',
      light: {
        primary: '#ef4444',
        hover: '#dc2626',
        secondary: '#f87171',
      },
      dark: {
        primary: '#f87171',
        hover: '#fca5a5',
        secondary: '#fecaca',
      },
    },
    purple: {
      name: 'Purple',
      light: {
        primary: '#667eea',
        hover: '#5a67d8',
        secondary: '#764ba2',
      },
      dark: {
        primary: '#7c8aff',
        hover: '#9198ff',
        secondary: '#9d6ec8',
      },
    },
    blue: {
      name: 'Blue',
      light: {
        primary: '#3b82f6',
        hover: '#2563eb',
        secondary: '#60a5fa',
      },
      dark: {
        primary: '#60a5fa',
        hover: '#93c5fd',
        secondary: '#bfdbfe',
      },
    },
    teal: {
      name: 'Teal',
      light: {
        primary: '#14b8a6',
        hover: '#0d9488',
        secondary: '#2dd4bf',
      },
      dark: {
        primary: '#2dd4bf',
        hover: '#5eead4',
        secondary: '#99f6e4',
      },
    },
    green: {
      name: 'Green',
      light: {
        primary: '#10b981',
        hover: '#059669',
        secondary: '#34d399',
      },
      dark: {
        primary: '#34d399',
        hover: '#6ee7b7',
        secondary: '#a7f3d0',
      },
    },
    orange: {
      name: 'Orange',
      light: {
        primary: '#f59e0b',
        hover: '#d97706',
        secondary: '#fbbf24',
      },
      dark: {
        primary: '#fbbf24',
        hover: '#fcd34d',
        secondary: '#fde68a',
      },
    },
    pink: {
      name: 'Pink',
      light: {
        primary: '#ec4899',
        hover: '#db2777',
        secondary: '#f472b6',
      },
      dark: {
        primary: '#f472b6',
        hover: '#f9a8d4',
        secondary: '#fbcfe8',
      },
    },
    indigo: {
      name: 'Indigo',
      light: {
        primary: '#6366f1',
        hover: '#4f46e5',
        secondary: '#818cf8',
      },
      dark: {
        primary: '#818cf8',
        hover: '#a5b4fc',
        secondary: '#c7d2fe',
      },
    },
  },

  // Default accent
  defaultAccent: 'red' as const,

  // Design Language Choices
  colorUsage: {
    // Where accent colors are applied:
    links: true,
    aNumbers: true,
    tabs: true,
    sectionHeaderUnderlines: true,

    // Where accent colors are NOT used:
    panelBorders: false,
    headerBackground: false,
  },

  // UI Preferences
  ui: {
    // Panels
    panelStyle: 'clean', // Clean, flat panels with subtle shadows
    panelElevation: 'elevated', // Default elevation level

    // Headers
    headerStyle: 'minimal', // No gradient, simple border

    // Theme
    lightModeStyle: 'warm', // Warm-toned backgrounds (#fdfbf7)
  },
} as const;

export type AccentColorKey = keyof typeof designSystem.accentColors;
