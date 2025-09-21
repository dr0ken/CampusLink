import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router'
import {Toaster} from 'react-hot-toast'
import ContextProvider from './context/ContextProvider.jsx'

createRoot(document.getElementById('root')).render(
    <ContextProvider>
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </ContextProvider>
)
