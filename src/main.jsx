import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Organized styles - all CSS now lives inside src/styles/
import './styles/index.css'
import './styles/global.css'
import './styles/auth.css'
import './styles/dashboard.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
