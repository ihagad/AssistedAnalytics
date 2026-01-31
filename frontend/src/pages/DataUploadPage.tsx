import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, FileText, AlertCircle, CheckCircle, XCircle, Plus } from 'lucide-react'
import { parseCSV } from '../utils/csvParser'
import { analyzeDataset } from '../utils/diagnostics'
import { Dataset, Diagnostic } from '../types'
import DiagnosticsTable from '../components/DiagnosticsTable'
import DiagnosticsSummary from '../components/DiagnosticsSummary'

export default function DataUploadPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [currentFile, setCurrentFile] = useState<File | null>(null)
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.csv')) {
      setUploadError('Please upload a CSV file')
      return
    }

    setCurrentFile(file)
    setUploadError(null)
    setIsAnalyzing(true)

    try {
      const result = await parseCSV(file)
      const columns = result.meta.fields || []
      const data = result.data

      const diags = analyzeDataset(data, columns)
      setDiagnostics(diags)

      const dataset: Dataset = {
        id: Date.now().toString(),
        name: file.name.replace('.csv', ''),
        uploadedAt: new Date(),
        data,
        columns
      }

      setDatasets(prev => [...prev, dataset])
    } catch (error) {
      setUploadError('Failed to parse CSV file. Please check the file format.')
      console.error('CSV parsing error:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }, [])

  const handleCreateNotebook = (dataset: Dataset) => {
    navigate(`/notebook/${encodeURIComponent(dataset.name)}`)
  }

  const handleDownload = (dataset: Dataset) => {
    const csv = [
      dataset.columns.join(','),
      ...dataset.data.map(row => 
        dataset.columns.map(col => {
          const value = row[col] || ''
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value
        }).join(',')
      )
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${dataset.name}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Upload</h1>
        <p className="text-gray-600">Upload your CSV files and analyze them for data quality issues</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <label
          htmlFor="csv-upload"
          className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">CSV files only</p>
          </div>
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isAnalyzing}
          />
        </label>

        {uploadError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{uploadError}</p>
          </div>
        )}

        {isAnalyzing && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <p className="text-blue-800">Analyzing dataset...</p>
          </div>
        )}
      </div>

      {/* Diagnostics Section */}
      {diagnostics.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>Data Diagnostics</span>
          </h2>
          <DiagnosticsSummary diagnostics={diagnostics} />
          <div className="mt-6">
            <DiagnosticsTable diagnostics={diagnostics} />
          </div>
        </div>
      )}

      {/* Datasets List */}
      {datasets.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Uploaded Datasets</span>
          </h2>
          <div className="space-y-4">
            {datasets.map((dataset) => (
              <div
                key={dataset.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors gap-4"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{dataset.name}</h3>
                  <p className="text-sm text-gray-500">
                    {dataset.columns.length} columns • {dataset.data.length} rows • 
                    Uploaded {dataset.uploadedAt.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                  <button
                    onClick={() => handleDownload(dataset)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Download CSV
                  </button>
                  <button
                    onClick={() => handleCreateNotebook(dataset)}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Notebook</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
