import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import '@components/PlaygroundApp/setup'
import { PlaygroundApp } from '@components/PlaygroundApp'
import { Navigation } from '@components/Navigation'
import { AutoFocus } from '@components'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  // <BrowserRouter>
  <div>
    {/* <Navigation />
    <Routes>
      <Route path="/" element={<PlaygroundApp />} />
      <Route path="/auto-focus" element={<AutoFocus />} />
    </Routes> */}
    <PlaygroundApp />
  </div>
  // {/* </BrowserRouter> */}
  // </React.StrictMode>
)
