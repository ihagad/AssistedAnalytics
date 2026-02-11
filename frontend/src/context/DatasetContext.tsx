import React, { createContext, useContext, useState } from 'react'
import { Dataset } from '../types'
import { useAuth } from './AuthContext'
import { saveDataset } from '../api/backend'

interface DatasetContextType {
  currentDataset: Dataset | null
  setCurrentDataset: (dataset: Dataset) => void
  saveCurrentDataset: () => Promise<any>
}

const DatasetContext = createContext<DatasetContextType | undefined>(undefined)

export function DatasetProvider({ children }: { children: React.ReactNode }) {
  const [currentDataset, setCurrentDataset] = useState<Dataset | null>(null)
  const { user } = useAuth()

  async function saveCurrentDataset() {
    if (!currentDataset) throw new Error('No dataset to save')
    const userId = user?.id
    return saveDataset(currentDataset, userId)
  }

  return (
    <DatasetContext.Provider value={{ currentDataset, setCurrentDataset, saveCurrentDataset }}>
      {children}
    </DatasetContext.Provider>
  )
}

export function useDataset() {
  const context = useContext(DatasetContext)
  if (!context) {
    throw new Error('useDataset must be used within DatasetProvider')
  }
  return context
}
