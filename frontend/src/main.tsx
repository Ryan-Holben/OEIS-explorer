import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './hooks/useTheme.tsx'
import { AccentColorProvider } from './hooks/useAccentColor.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { APP_NAME } from './config/app'

// Set document title from config
document.title = `${APP_NAME} - OEIS Explorer`;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AccentColorProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </AccentColorProvider>
    </ThemeProvider>
  </StrictMode>,
)
