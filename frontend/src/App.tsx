import { Panel } from './components/ui/Panel';
import { ThemeToggle } from './components/ui/ThemeToggle';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <h1>Sequential UI Components</h1>
            <ThemeToggle />
          </div>
          <p className="subtitle">
            Design system demo - Clean, modern panels with light/dark mode support
          </p>
        </div>
      </header>

      <main className="container">
        <section className="section">
          <h2>Panel Sizes</h2>
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
            Elegant, readable, professional fonts with subtle design personality
          </p>
          <div className="grid-wide">
            <Panel>
              <div className="font-sample" style={{ fontFamily: 'Inter, sans-serif' }}>
                <h3>Inter</h3>
                <p className="header-sample">Sequential Explorer</p>
                <p className="body-sample">The quick brown fox jumps over the lazy dog. 0123456789</p>
              </div>
            </Panel>

            <Panel>
              <div className="font-sample" style={{ fontFamily: 'Poppins, sans-serif' }}>
                <h3>Poppins</h3>
                <p className="header-sample">Sequential Explorer</p>
                <p className="body-sample">The quick brown fox jumps over the lazy dog. 0123456789</p>
              </div>
            </Panel>

            <Panel>
              <div className="font-sample" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                <h3>Space Grotesk</h3>
                <p className="header-sample">Sequential Explorer</p>
                <p className="body-sample">The quick brown fox jumps over the lazy dog. 0123456789</p>
              </div>
            </Panel>

            <Panel>
              <div className="font-sample" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <h3>DM Sans</h3>
                <p className="header-sample">Sequential Explorer</p>
                <p className="body-sample">The quick brown fox jumps over the lazy dog. 0123456789</p>
              </div>
            </Panel>

            <Panel>
              <div className="font-sample" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                <h3>IBM Plex Sans</h3>
                <p className="header-sample">Sequential Explorer</p>
                <p className="body-sample">The quick brown fox jumps over the lazy dog. 0123456789</p>
              </div>
            </Panel>

            <Panel>
              <div className="font-sample" style={{ fontFamily: "'Merriweather', serif" }}>
                <h3>Merriweather (Serif)</h3>
                <p className="header-sample">Sequential Explorer</p>
                <p className="body-sample">The quick brown fox jumps over the lazy dog. 0123456789</p>
              </div>
            </Panel>

            <Panel>
              <div className="font-sample" style={{ fontFamily: "'Lora', serif" }}>
                <h3>Lora (Serif)</h3>
                <p className="header-sample">Sequential Explorer</p>
                <p className="body-sample">The quick brown fox jumps over the lazy dog. 0123456789</p>
              </div>
            </Panel>

            <Panel>
              <div className="font-sample" style={{ fontFamily: "'Crimson Pro', serif" }}>
                <h3>Crimson Pro (Serif)</h3>
                <p className="header-sample">Sequential Explorer</p>
                <p className="body-sample">The quick brown fox jumps over the lazy dog. 0123456789</p>
              </div>
            </Panel>
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
