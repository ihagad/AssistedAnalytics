import { useParams } from 'react-router-dom'
import { Dataset } from '../types'
import DiagnosticsTable from '../components/DiagnosticsTable'
import DiagnosticsSummary from '../components/DiagnosticsSummary'
import { analyzeDataset } from '../utils/diagnostics'
import CsvTable from '../components/CsvTable'
import { useDataset } from '../context/DatasetContext'

export default function DatasetAnalysisPage() {
  const { datasetId } = useParams()
  const { currentDataset } = useDataset()

  if (!currentDataset || currentDataset.id !== datasetId) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dataset Not Found</h1>
          <p className="text-gray-600">The dataset you're looking for could not be found. Please go back and select a dataset to analyze.</p>
        </div>
      </div>
    )
  }

  const dataset = currentDataset
  const diagnostics = analyzeDataset(dataset.data, dataset.columns)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dataset Analysis: {dataset.name}</h1>
        <p className="text-gray-600">
          {dataset.columns.length} columns • {dataset.data.length} rows • 
          Uploaded {dataset.uploadedAt.toLocaleDateString()}
        </p>
      </div>

      {/* Diagnostics Summary */}
      {diagnostics.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Quality Summary</h2>
          <DiagnosticsSummary diagnostics={diagnostics} />
          <div className="mt-6">
            <DiagnosticsTable diagnostics={diagnostics} />
          </div>
        </div>
      )}

      {/* Data Preview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Preview</h2>
        <div className="overflow-x-auto">
          <CsvTable data={dataset.data} />
        </div>
      </div>
    </div>
  )
}
