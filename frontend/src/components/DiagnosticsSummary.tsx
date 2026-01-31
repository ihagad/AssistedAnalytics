import { Diagnostic } from '../types'
import { AlertCircle, CheckCircle } from 'lucide-react'

interface DiagnosticsSummaryProps {
  diagnostics: Diagnostic[]
}

export default function DiagnosticsSummary({ diagnostics }: DiagnosticsSummaryProps) {
  const byType = {
    missing: diagnostics.filter(d => d.type === 'missing').length,
    invalid: diagnostics.filter(d => d.type === 'invalid').length,
    skewed: diagnostics.filter(d => d.type === 'skewed').length,
    suspicious: diagnostics.filter(d => d.type === 'suspicious').length
  }

  const bySeverity = {
    high: diagnostics.filter(d => d.severity === 'high').length,
    medium: diagnostics.filter(d => d.severity === 'medium').length,
    low: diagnostics.filter(d => d.severity === 'low').length
  }

  const totalIssues = diagnostics.length

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-red-600 font-medium">Total Issues</p>
            <p className="text-2xl font-bold text-red-900">{totalIssues}</p>
          </div>
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-orange-600 font-medium">High Severity</p>
            <p className="text-2xl font-bold text-orange-900">{bySeverity.high}</p>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-yellow-600 font-medium">Medium Severity</p>
            <p className="text-2xl font-bold text-yellow-900">{bySeverity.medium}</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-600 font-medium">Low Severity</p>
            <p className="text-2xl font-bold text-blue-900">{bySeverity.low}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
