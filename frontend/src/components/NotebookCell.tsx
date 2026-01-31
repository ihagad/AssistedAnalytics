import { NotebookCell as NotebookCellType } from '../types'
import { ChevronDown, ChevronRight, Code, List, ArrowRight } from 'lucide-react'

interface NotebookCellProps {
  cell: NotebookCellType
  isSelected: boolean
  onClick: () => void
  onToggleCollapse: () => void
}

export default function NotebookCell({ cell, isSelected, onClick, onToggleCollapse }: NotebookCellProps) {
  const getIcon = () => {
    switch (cell.type) {
      case 'plan':
        return <List className="w-5 h-5 text-blue-600" />
      case 'code':
        return <Code className="w-5 h-5 text-green-600" />
      case 'transformation':
        return <ArrowRight className="w-5 h-5 text-purple-600" />
      default:
        return <List className="w-5 h-5 text-gray-600" />
    }
  }

  const getBorderColor = () => {
    if (isSelected) return 'border-blue-500 border-2'
    switch (cell.type) {
      case 'plan':
        return 'border-blue-200'
      case 'code':
        return 'border-green-200'
      case 'transformation':
        return 'border-purple-200'
      default:
        return 'border-gray-200'
    }
  }

  const getBackgroundColor = () => {
    if (isSelected) return 'bg-blue-50'
    switch (cell.type) {
      case 'plan':
        return 'bg-blue-50'
      case 'code':
        return 'bg-green-50'
      case 'transformation':
        return 'bg-purple-50'
      default:
        return 'bg-white'
    }
  }

  return (
    <div
      className={`border rounded-lg ${getBorderColor()} ${getBackgroundColor()} transition-all cursor-pointer hover:shadow-md`}
      onClick={onClick}
    >
      {/* Cell Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-gray-200"
        onClick={(e) => {
          e.stopPropagation()
          onToggleCollapse()
        }}
      >
        <div className="flex items-center space-x-3">
          {cell.isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
          {getIcon()}
          <h3 className="font-semibold text-gray-900">{cell.title}</h3>
          <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-white rounded border border-gray-300">
            {cell.type}
          </span>
        </div>
      </div>

      {/* Cell Content */}
      {!cell.isCollapsed && (
        <div className="p-4">
          {cell.type === 'code' ? (
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
              <code>{cell.content}</code>
            </pre>
          ) : (
            <p className="text-gray-700 whitespace-pre-wrap">{cell.content}</p>
          )}
          
          {cell.relatedCells && cell.relatedCells.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Related to: {cell.relatedCells.join(', ')}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
