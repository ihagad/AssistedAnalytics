import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { NotebookCell, ChatMessage } from '../types'
import NotebookCellComponent from '../components/NotebookCell'
import ChatSidebar from '../components/ChatSidebar'
import { Download, FileText } from 'lucide-react'

export default function NotebookPage() {
  const { datasetName } = useParams<{ datasetName: string }>()
  const [cells, setCells] = useState<NotebookCell[]>([])
  const [selectedCellId, setSelectedCellId] = useState<string | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])

  const handleCellClick = (cellId: string) => {
    setSelectedCellId(cellId)
    const cell = cells.find(c => c.id === cellId)
    if (cell?.relatedCells) {
      // Highlight related cells
      cell.relatedCells.forEach(relatedId => {
        // Visual feedback could be added here
      })
    }
  }

  const toggleCellCollapse = (cellId: string) => {
    setCells(prev => prev.map(cell =>
      cell.id === cellId ? { ...cell, isCollapsed: !cell.isCollapsed } : cell
    ))
  }

  const handleChatMessage = (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date()
    }

    setChatMessages(prev => [...prev, userMessage])

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I understand you're asking about "${message}". Based on the dataset "${datasetName}", I can help you with data analysis, transformations, or creating new analysis steps. Would you like me to suggest a specific transformation or analysis?`,
        timestamp: new Date()
      }
      setChatMessages(prev => [...prev, assistantMessage])
    }, 1000)
  }

  const handleDownload = () => {
    // In a real app, this would download the transformed dataset
    alert('Download functionality would export the transformed dataset here')
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] min-h-[600px] bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Main Notebook Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Using dataset: <span className="text-blue-600">{decodeURIComponent(datasetName || '')}</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">Interactive analysis notebook</p>
          </div>
          <button
            onClick={handleDownload}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Dataset</span>
          </button>
        </div>

        {/* Notebook Cells */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cells.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <FileText className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg font-medium text-gray-500">Blank Canvas</p>
              <p className="text-sm text-gray-400 mt-2">Start by asking the assistant to create analysis steps</p>
            </div>
          ) : (
            cells.map((cell) => (
              <NotebookCellComponent
                key={cell.id}
                cell={cell}
                isSelected={selectedCellId === cell.id}
                onClick={() => handleCellClick(cell.id)}
                onToggleCollapse={() => toggleCellCollapse(cell.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Chat Sidebar */}
      <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col h-96 lg:h-auto">
        <ChatSidebar
          messages={chatMessages}
          onSendMessage={handleChatMessage}
          datasetName={datasetName || ''}
        />
      </div>
    </div>
  )
}
