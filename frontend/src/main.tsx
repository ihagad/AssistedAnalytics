import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { DatasetProvider } from './context/DatasetContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <DatasetProvider>
        <App />
      </DatasetProvider>
    </AuthProvider>
  </React.StrictMode>,
)
