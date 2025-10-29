# Sequential - Design System Choices

**Date:** October 28, 2025
**Status:** Finalized

---

## Design Philosophy

**Core Principle:** *Let the sequences be the stars of the show.*

The UI should be clean, cohesive, and unobtrusive. Mathematical sequences and their visualizations should command attention, while the interface provides an elegant, minimal framework.

---

## Typography

### Primary Font: **Space Grotesk**
- Modern, geometric sans-serif
- Excellent readability at all sizes
- Subtle design personality without being distracting
- Professional yet approachable

### Monospace Font: **JetBrains Mono**
- Used for sequence data display
- Clear distinction between digits (0 vs O)
- Optimized for numbers

**Alternatives considered:**
- Inter (too neutral)
- Poppins (slightly too playful)
- DM Sans (good but less character)
- Serif options (too traditional for a modern data app)

---

## Color System

### Accent Color: **Red** (`#ef4444`)

**Light Mode:**
- Primary: `#ef4444` (red-500)
- Hover: `#dc2626` (red-600)
- Secondary: `#f87171` (red-400)

**Dark Mode:**
- Primary: `#f87171` (red-400) - Softer for dark backgrounds
- Hover: `#fca5a5` (red-300)
- Secondary: `#fecaca` (red-200)

**Why Red:**
- Bold and confident
- High contrast for visibility
- Energetic but not overwhelming
- Works well as functional UI accent

**Additional Color Options:**
Configured but not exposed to users (yet):
- Purple, Blue, Teal, Green, Orange, Pink, Indigo
- Available for future customization feature

### Accent Color Usage

**Where accent color IS used:**
- ✅ Links
- ✅ A-numbers (sequence identifiers)
- ✅ Tabs (future feature)
- ✅ Section header underlines
- ✅ Selected/active states
- ✅ Interactive element hover states

**Where accent color is NOT used:**
- ❌ Panel borders (keep neutral)
- ❌ Header backgrounds (avoid visual weight)
- ❌ Body text (maintain hierarchy)
- ❌ Decorative elements (minimal approach)

### Background Colors

**Light Mode - Warm Toned:**
- Primary: `#fdfbf7` (warm cream)
- Secondary: `#f7f4ef` (soft off-white)
- Tertiary: `#f0ede8` (warm gray)
- Panels: `#ffffff` (pure white for contrast)

**Dark Mode - Cool Neutral:**
- Primary: `#1a1a1a`
- Secondary: `#242424`
- Tertiary: `#2d2d2d`
- Panels: `#242424`

**Rationale:** Warm light mode creates a sophisticated, paper-like feel. Pure white panels pop against the warm background.

---

## Visual Elements

### Panels
- **Style:** Flat with rounded edges (`10px` border-radius)
- **Elevation:** Subtle shadow for depth without heaviness
- **Border:** Light, neutral border (no accent colors)
- **Hover:** Gentle lift effect on interactive panels

### Section Headers
- **Underline:** 2px accent-colored line below H2 elements
- **Spacing:** Adequate padding below underline
- **Typography:** Bold, clear hierarchy

### Layout
- **Grid-based:** Responsive grid for consistent alignment
- **Spacing:** Consistent spacing scale (4px, 8px, 16px, 24px, 32px, 48px, 64px)
- **Max Width:** 1200px container for readability

---

## Interactive Elements

### Links
- Accent color (red)
- Underline on hover
- Smooth transitions (150ms)

### Buttons
- Minimal style with accent color
- Border-based (not filled backgrounds)
- Hover lift effect

### Sequence Cards
- **A-number:** Bold, accent colored, 1.3rem
- **Description:** Same line as A-number, same size/weight
- **Data:** Monospace font, minimal padding
- **Chart:** Larger vertical space for prominence

---

## Theme System

### Light/Dark Mode
- Automatic system preference detection
- Manual toggle available
- Persistent localStorage
- Smooth transitions between modes

### Implementation
- CSS custom properties (CSS variables)
- `[data-theme='light']` and `[data-theme='dark']` selectors
- Explicit theme setting overrides system preferences

---

## Future Considerations

### User Customization (Not Yet Implemented)
- Accent color selection from preset palette
- Font size preferences
- Density options (compact vs comfortable)
- Chart color schemes

### Accessibility
- Maintain WCAG AA contrast ratios
- Focus states clearly visible
- Keyboard navigation support
- Screen reader friendly markup

---

## Reference Files

- **Design System Config:** `/frontend/src/config/designSystem.ts`
- **CSS Variables:** `/frontend/src/index.css`
- **Demo Page:** `/frontend/src/demos/DesignExploration.tsx`

---

## Design Decisions Log

### October 28, 2025

**Typography:**
- ✅ Chose Space Grotesk over 7 other candidates
- Reasoning: Best balance of personality and professionalism

**Color Accents:**
- ✅ Selected red as primary accent
- ✅ Defined restrained usage (links, A-numbers, headers)
- ✅ Rejected decorative color applications

**Header:**
- ✅ Removed gradient background
- ✅ Switched to minimal style with simple border
- Reasoning: Gradient was "overdone" and distracted from content

**Light Mode:**
- ✅ Added warm tone to backgrounds
- Reasoning: More sophisticated than stark white, paper-like quality

---

*This document captures the deliberate design choices made for Sequential. It serves as a reference for maintaining consistency and can be updated as the design evolves.*
