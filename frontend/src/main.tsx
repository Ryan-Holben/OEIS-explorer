import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './hooks/useTheme.tsx'
import { AccentColorProvider } from './hooks/useAccentColor.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AccentColorProvider>
        <App />
      </AccentColorProvider>
    </ThemeProvider>
  </StrictMode>,
)
