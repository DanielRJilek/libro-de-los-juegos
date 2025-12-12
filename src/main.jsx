import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './views/Home/Home.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Home></Home>
  </StrictMode>,
)
