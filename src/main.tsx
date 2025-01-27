import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import { ResizableTerminalSSH } from './Terminal'
import { PageNotFound } from './not-found'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<ResizableTerminalSSH />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  </BrowserRouter>
)
