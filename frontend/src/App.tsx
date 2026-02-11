import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import DataUploadPage from './pages/DataUploadPage'
import NotebookPage from './pages/NotebookPage'
import Layout from './components/Layout'
import CsvDisplayPage from './pages/CsvDisplayPage'
import DatasetAnalysisPage from './pages/DatasetAnalysisPage'
import { DatasetProvider } from './context/DatasetContext'

function App() {
  return (
    <Router>
      <DatasetProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<DataUploadPage />} />
            <Route path="/notebook/:datasetName" element={<NotebookPage />} />
            <Route path="/csv-display" element={<CsvDisplayPage />} />
            <Route path="/analysis/:datasetId" element={<DatasetAnalysisPage />} />
          </Routes>
        </Layout>
      </DatasetProvider>
    </Router>
  )
}

export default App
