import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import DataUploadPage from './pages/DataUploadPage'
import NotebookPage from './pages/NotebookPage'
import Layout from './components/Layout'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<DataUploadPage />} />
          <Route path="/notebook/:datasetName" element={<NotebookPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
