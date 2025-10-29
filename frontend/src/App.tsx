import { useState } from 'react';
import { Panel } from './components/ui/Panel';
import { ThemeToggle } from './components/ui/ThemeToggle';
import './App.css';

const fonts = [
  { name: 'Inter', value: 'Inter, sans-serif' },
  { name: 'Poppins', value: 'Poppins, sans-serif' },
  { name: 'Space Grotesk', value: "'Space Grotesk', sans-serif" },
  { name: 'DM Sans', value: "'DM Sans', sans-serif" },
  { name: 'IBM Plex Sans', value: "'IBM Plex Sans', sans-serif" },
  { name: 'Merriweather (Serif)', value: "'Merriweather', serif" },
  { name: 'Lora (Serif)', value: "'Lora', serif" },
  { name: 'Crimson Pro (Serif)', value: "'Crimson Pro', serif" },
];

const colorPalettes = [
  { name: 'Purple', primary: '#667eea', hover: '#5a67d8' },
  { name: 'Blue', primary: '#3b82f6', hover: '#2563eb' },
  { name: 'Teal', primary: '#14b8a6', hover: '#0d9488' },
  { name: 'Green', primary: '#10b981', hover: '#059669' },
  { name: 'Orange', primary: '#f59e0b', hover: '#d97706' },
  { name: 'Pink', primary: '#ec4899', hover: '#db2777' },
  { name: 'Indigo', primary: '#6366f1', hover: '#4f46e5' },
  { name: 'Red', primary: '#ef4444', hover: '#dc2626' },
];

function App() {
  const [selectedFont, setSelectedFont] = useState("'Space Grotesk', sans-serif");
  const [selectedColor, setSelectedColor] = useState(colorPalettes[0]);

  // Apply accent color to CSS variables
  const styleWithColor = {
    fontFamily: selectedFont,
    '--color-accent-primary': selectedColor.primary,
    '--color-accent-primary-hover': selectedColor.hover,
  } as React.CSSProperties;

  return (
    <div className="app" style={styleWithColor}>
      <header className="app-header-simple">
        <div className="container">
          <div className="header-content">
            <h1>Sequential - Color Accent Exploration</h1>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container">
        {/* Color Palette Selector */}
        <section className="section">
          <h2>Choose Your Accent Color</h2>
          <div className="color-palette">
            {colorPalettes.map((palette) => (
              <button
                key={palette.name}
                className={`color-swatch ${selectedColor.name === palette.name ? 'selected' : ''}`}
                style={{ backgroundColor: palette.primary }}
                onClick={() => setSelectedColor(palette)}
                title={palette.name}
              >
                {selectedColor.name === palette.name && '✓'}
              </button>
            ))}
          </div>
        </section>

        {/* Demo 1: Minimal - Interactive Elements Only */}
        <section className="section">
          <h2>Concept 1: Pure Minimal (Functional Color Only)</h2>
          <p className="demo-description">
            Accent color only on links, buttons, and selected items. Cleanest option.
          </p>
          <div className="grid-wide">
            <Panel>
              <h3>Sequence A000045</h3>
              <p>Fibonacci numbers: F(n) = F(n-1) + F(n-2)</p>
              <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-sm)' }}>
                <a href="#">View details</a> • <a href="#">Related sequences</a>
              </p>
            </Panel>
            <Panel>
              <h3>Sequence A000040</h3>
              <p>The prime numbers</p>
              <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-sm)' }}>
                <a href="#">View details</a> • <a href="#">Related sequences</a>
              </p>
            </Panel>
          </div>
        </section>

        {/* Demo 2: Thin Left Border */}
        <section className="section">
          <h2>Concept 2: Left Accent Border</h2>
          <p className="demo-description">
            3px colored left border on panels, like a bookmark edge
          </p>
          <div className="grid-wide">
            <Panel style={{ borderLeft: '3px solid var(--color-accent-primary)' }}>
              <h3>Sequence A000045</h3>
              <p>Fibonacci numbers: F(n) = F(n-1) + F(n-2)</p>
              <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-sm)' }}>
                0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89...
              </p>
            </Panel>
            <Panel style={{ borderLeft: '3px solid var(--color-accent-primary)' }}>
              <h3>Sequence A000040</h3>
              <p>The prime numbers</p>
              <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-sm)' }}>
                2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31...
              </p>
            </Panel>
          </div>
        </section>

        {/* Demo 3: Underline Headers */}
        <section className="section">
          <h2 style={{ borderBottom: '2px solid var(--color-accent-primary)', paddingBottom: 'var(--space-sm)' }}>
            Concept 3: Underlined Section Headers
          </h2>
          <p className="demo-description">
            Thin colored line under section headings
          </p>
          <div className="grid-wide">
            <Panel>
              <h3>Sequence A000045</h3>
              <p>Fibonacci numbers: F(n) = F(n-1) + F(n-2)</p>
              <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-sm)' }}>
                0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89...
              </p>
            </Panel>
            <Panel>
              <h3>Sequence A000040</h3>
              <p>The prime numbers</p>
              <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-sm)' }}>
                2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31...
              </p>
            </Panel>
          </div>
        </section>

        {/* Demo 4: Top Border Stripe */}
        <section className="section" style={{ paddingTop: 'var(--space-md)', borderTop: '3px solid var(--color-accent-primary)' }}>
          <h2>Concept 4: Thin Top Border Stripe</h2>
          <p className="demo-description">
            3px colored stripe at top of sections or app
          </p>
          <div className="grid-wide">
            <Panel>
              <h3>Sequence A000045</h3>
              <p>Fibonacci numbers: F(n) = F(n-1) + F(n-2)</p>
              <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-sm)' }}>
                0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89...
              </p>
            </Panel>
            <Panel>
              <h3>Sequence A000040</h3>
              <p>The prime numbers</p>
              <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-sm)' }}>
                2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31...
              </p>
            </Panel>
          </div>
        </section>

        {/* Demo 5: Accent Dot */}
        <section className="section">
          <h2>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-accent-primary)' }}></span>
              Concept 5: Accent Dots
            </span>
          </h2>
          <p className="demo-description">
            Small colored dots next to headers or A-numbers
          </p>
          <div className="grid-wide">
            <Panel>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-accent-primary)', flexShrink: 0 }}></span>
                Sequence A000045
              </h3>
              <p>Fibonacci numbers: F(n) = F(n-1) + F(n-2)</p>
              <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-sm)' }}>
                0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89...
              </p>
            </Panel>
            <Panel>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-accent-primary)', flexShrink: 0 }}></span>
                Sequence A000040
              </h3>
              <p>The prime numbers</p>
              <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-sm)' }}>
                2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31...
              </p>
            </Panel>
          </div>
        </section>

        {/* Demo 6: Combination */}
        <section className="section">
          <h2 style={{ borderBottom: '2px solid var(--color-accent-primary)', paddingBottom: 'var(--space-sm)' }}>
            Concept 6: Subtle Combination
          </h2>
          <p className="demo-description">
            Left border on panels + underlined headers (restrained)
          </p>
          <div className="grid-wide">
            <Panel style={{ borderLeft: '2px solid var(--color-accent-primary)' }}>
              <h3>Sequence A000045</h3>
              <p>Fibonacci numbers: F(n) = F(n-1) + F(n-2)</p>
              <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-sm)' }}>
                <a href="#">View details</a>
              </p>
            </Panel>
            <Panel style={{ borderLeft: '2px solid var(--color-accent-primary)' }}>
              <h3>Sequence A000040</h3>
              <p>The prime numbers</p>
              <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-sm)' }}>
                <a href="#">View details</a>
              </p>
            </Panel>
          </div>
        </section>

        <section className="section">
          <h2>Original Font Showcase (for reference)</h2>
          <div className="grid">
            <Panel size="small">
              <strong>Small Panel</strong>
              <p>Compact padding for dense layouts</p>
            </Panel>

            <Panel size="medium">
              <strong>Medium Panel (Default)</strong>
              <p>Standard padding for most use cases</p>
            </Panel>

            <Panel size="large">
              <strong>Large Panel</strong>
              <p>Generous padding for important content</p>
            </Panel>

            <Panel size="xlarge">
              <strong>Extra Large Panel</strong>
              <p>Maximum padding for prominent sections</p>
            </Panel>
          </div>
        </section>

        <section className="section">
          <h2>Panel Elevations</h2>
          <div className="grid">
            <Panel elevation="flat">
              <strong>Flat</strong>
              <p>No shadow, just a subtle border</p>
            </Panel>

            <Panel elevation="elevated">
              <strong>Elevated (Default)</strong>
              <p>Standard shadow for depth</p>
            </Panel>

            <Panel elevation="floating">
              <strong>Floating</strong>
              <p>Prominent shadow for emphasis</p>
            </Panel>
          </div>
        </section>

        <section className="section">
          <h2>Interactive Panels</h2>
          <div className="grid">
            <Panel clickable onClick={() => alert('Clicked!')}>
              <strong>Clickable Panel</strong>
              <p>Hover to see lift effect, click me!</p>
            </Panel>

            <Panel clickable elevation="floating" onClick={() => alert('Clicked!')}>
              <strong>Clickable + Floating</strong>
              <p>Combined hover and shadow effects</p>
            </Panel>
          </div>
        </section>

        <section className="section">
          <h2>Font Showcase</h2>
          <p style={{ marginBottom: 'var(--space-lg)', color: 'var(--color-text-secondary)' }}>
            Click any font to preview it across the entire page
          </p>
          <div className="grid-wide">
            {fonts.map((font) => (
              <Panel
                key={font.value}
                clickable
                elevation={selectedFont === font.value ? 'floating' : 'elevated'}
                onClick={() => setSelectedFont(font.value)}
                style={{
                  borderColor: selectedFont === font.value ? 'var(--color-accent-primary)' : undefined,
                  borderWidth: selectedFont === font.value ? '2px' : undefined
                }}
              >
                <div className="font-sample" style={{ fontFamily: font.value }}>
                  <h3>{font.name} {selectedFont === font.value && '✓'}</h3>
                  <p className="header-sample">Sequential Explorer</p>
                  <p className="body-sample">The quick brown fox jumps over the lazy dog. 0123456789</p>
                </div>
              </Panel>
            ))}
          </div>
        </section>

        <section className="section">
          <h2>Content Examples</h2>
          <div className="grid-wide">
            <Panel>
              <h3>Typography Showcase</h3>
              <h4>Heading 4</h4>
              <h5>Heading 5</h5>
              <h6>Heading 6</h6>
              <p>
                This is a paragraph with <a href="#">a link</a>. The design system provides
                consistent typography across light and dark modes.
              </p>
              <code>const code = "inline code example";</code>
            </Panel>

            <Panel elevation="floating">
              <h3>Color Palette</h3>
              <div className="color-row">
                <div className="color-box accent">Accent</div>
                <div className="color-box success">Success</div>
                <div className="color-box warning">Warning</div>
                <div className="color-box error">Error</div>
                <div className="color-box info">Info</div>
              </div>
            </Panel>
          </div>
        </section>

        <section className="section">
          <h2>Layout Options</h2>

          <Panel fullWidth size="large">
            <strong>Full Width Panel</strong>
            <p>Stretches to fill available space</p>
          </Panel>

          <div style={{ height: '200px', marginTop: '1rem' }}>
            <Panel centered style={{ height: '100%' }}>
              <div style={{ textAlign: 'center' }}>
                <strong>Centered Content</strong>
                <p>Vertically and horizontally centered</p>
              </div>
            </Panel>
          </div>
        </section>

        <section className="section">
          <h2>Sequence Preview (Mockup)</h2>
          <div className="grid-wide">
            <Panel clickable>
              <div className="sequence-preview">
                <div className="sequence-header">
                  <strong className="a-number">A000045</strong>
                  <span className="sequence-name">Fibonacci numbers</span>
                </div>
                <p className="sequence-data">0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89...</p>
                <div className="mini-chart">📈 Chart preview would go here</div>
              </div>
            </Panel>

            <Panel clickable elevation="flat">
              <div className="sequence-preview">
                <div className="sequence-header">
                  <strong className="a-number">A000040</strong>
                  <span className="sequence-name">Prime numbers</span>
                </div>
                <p className="sequence-data">2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31...</p>
                <div className="mini-chart">📊 Chart preview would go here</div>
              </div>
            </Panel>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>Sequential Design System • Built with React + TypeScript</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
