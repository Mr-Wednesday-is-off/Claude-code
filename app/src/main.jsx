import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, MemoryRouter } from 'react-router-dom'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import './index.css'
import App from './App.jsx'

// Hash routing needs a real page address. Sandboxed viewers (e.g. in-app file
// previews, srcdoc iframes) don't have one and would crash on startup, so fall
// back to in-memory routing there.
function canUseHashRouter() {
  try {
    if (!/^(https?|file):$/.test(window.location.protocol)) return false
    new URL(window.location.href)
    window.history.replaceState(window.history.state, '', window.location.href)
    return true
  } catch {
    return false
  }
}

const useHash = canUseHashRouter()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {useHash ? (
      <HashRouter>
        <App />
      </HashRouter>
    ) : (
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )}
  </StrictMode>,
)
