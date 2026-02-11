import React, { createContext, useContext, useState } from 'react'
import { Dataset } from '../types'

interface DatasetContextType {
  currentDataset: Dataset | null
  setCurrentDataset: (dataset: Dataset) => void
}

const DatasetContext = createContext<DatasetContextType | undefined>(undefined)

export function DatasetProvider({ children }: { children: React.ReactNode }) {
  const [currentDataset, setCurrentDataset] = useState<Dataset | null>(null)

  return (
    <DatasetContext.Provider value={{ currentDataset, setCurrentDataset }}>
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
