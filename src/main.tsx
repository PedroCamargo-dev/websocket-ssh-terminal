import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import { ResizableTerminalSSH } from './Terminal'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<ResizableTerminalSSH />} />
    </Routes>
  </BrowserRouter>
)
