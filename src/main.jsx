import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { enableReveal } from './lib/motion'

// Opts the document into scroll-reveal before the first paint, so revealed
// elements are never briefly visible and then hidden again.
enableReveal()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
