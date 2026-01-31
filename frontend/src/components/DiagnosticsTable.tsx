import { Diagnostic } from '../types'
import { AlertCircle, XCircle, TrendingUp, Eye } from 'lucide-react'

interface DiagnosticsTableProps {
  diagnostics: Diagnostic[]
}

export default function DiagnosticsTable({ diagnostics }: DiagnosticsTableProps) {
  const getIcon = (type: Diagnostic['type']) => {
    switch (type) {
      case 'missing':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'invalid':
        return <AlertCircle className="w-4 h-4 text-orange-600" />
      case 'skewed':
        return <TrendingUp className="w-4 h-4 text-yellow-600" />
      case 'suspicious':
        return <Eye className="w-4 h-4 text-blue-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const getSeverityBadge = (severity: Diagnostic['severity']) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-blue-100 text-blue-800 border-blue-200'
    }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded border ${colors[severity]}`}>
        {severity.toUpperCase()}
      </span>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Column
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Message
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Severity
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {diagnostics.map((diagnostic, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  {getIcon(diagnostic.type)}
                  <span className="text-sm text-gray-900 capitalize">{diagnostic.type}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-medium text-gray-900">{diagnostic.column}</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-gray-700">{diagnostic.message}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getSeverityBadge(diagnostic.severity)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
