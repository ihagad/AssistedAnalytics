import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { ChatMessage } from '../types'
import ChatSidebar from '../components/ChatSidebar'
import {
  Download,
  FileText,
  Loader2,
  ExternalLink,
  AlertCircle,
  PanelRightOpen,
  PanelRightClose,
} from 'lucide-react'
import { getJupyterStatus, startJupyter } from '../api/jupyter'

type JupyterState = 'idle' | 'loading' | 'ready' | 'error'

export default function NotebookPage() {
  const { datasetName } = useParams<{ datasetName: string }>()
  const [jupyterUrl, setJupyterUrl] = useState<string | null>(null)
  const [state, setState] = useState<JupyterState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])

  const ensureJupyter = useCallback(async () => {
    setState('loading')
    setError(null)
    try {
      const status = await getJupyterStatus()
      if (status.running) {
        setJupyterUrl(status.browser_url || (status.url ? getJupyterLabUrl(status.url) : `/jupyter-app/lab`))
        setState('ready')
        return
      }
      const result = await startJupyter({ wait_ready: true })
      if (result.ok) {
        setJupyterUrl(result.browser_url || (result.url ? getJupyterLabUrl(result.url) : '/jupyter-app/lab'))
        setState('ready')
      } else {
        setError(result.message || 'Failed to start Jupyter')
        setState('error')
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to connect to Jupyter'
      setError(message)
      setState('error')
    }
  }, [])

  useEffect(() => {
    ensureJupyter()
  }, [ensureJupyter])

  const handleChatMessage = (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    }
    setChatMessages((prev) => [...prev, userMessage])
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I understand you're asking about "${message}". Based on the dataset "${datasetName}", I can help with analysis, transformations, or new analysis steps. You can run code in the Jupyter notebook to the left. Would you like a specific suggestion?`,
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, assistantMessage])
    }, 1000)
  }

  const handleDownload = () => {
    alert('Download functionality would export the transformed dataset here')
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] min-h-[600px] bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex-none px-6 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <h1 className="text-lg font-bold text-gray-900 truncate">
            Notebook: <span className="text-blue-600">{decodeURIComponent(datasetName || '')}</span>
          </h1>
          {jupyterUrl && (
            <a
              href={jupyterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 shrink-0"
            >
              <ExternalLink className="w-4 h-4" />
              Open in new tab
            </a>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDownload}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          <button
            type="button"
            onClick={() => setSidebarOpen((o) => !o)}
            className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg"
            title={sidebarOpen ? 'Hide chat' : 'Show chat'}
          >
            {sidebarOpen ? <PanelRightClose className="w-5 h-5" /> : <PanelRightOpen className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main: Jupyter iframe or loading/error */}
      <div className="flex-1 flex min-h-0">
        <div className="flex-1 min-w-0 flex flex-col">
          {state === 'loading' && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-500 bg-gray-50/50">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
              <p className="text-lg font-medium">Starting Jupyter...</p>
              <p className="text-sm">This may take a few seconds.</p>
            </div>
          )}

          {state === 'error' && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-700 p-6">
              <AlertCircle className="w-12 h-12 text-amber-500" />
              <p className="text-lg font-medium">Could not start Jupyter</p>
              <p className="text-sm text-gray-600 text-center max-w-md">{error}</p>
              <p className="text-xs text-gray-500 text-center max-w-md">
                Make sure the Python service is running: <code className="bg-gray-100 px-1 rounded">uvicorn main:app --port 8000</code> (from python_service).
              </p>
              <button
                onClick={ensureJupyter}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Loader2 className="w-4 h-4" />
                Retry
              </button>
            </div>
          )}

          {state === 'ready' && jupyterUrl && (
            <iframe
              title="Jupyter Notebook"
              src={jupyterUrl}
              className="w-full h-full border-0 rounded-b-lg"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              allow="cross-origin-isolated"
            />
          )}

          {state === 'idle' && (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <FileText className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg font-medium text-gray-500">Preparing notebook...</p>
            </div>
          )}
        </div>

        {/* Chat sidebar */}
        {sidebarOpen && (
          <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col h-96 lg:h-auto shrink-0">
            <ChatSidebar
              messages={chatMessages}
              onSendMessage={handleChatMessage}
              datasetName={datasetName || ''}
            />
          </div>
        )}
      </div>
    </div>
  )
}
/** Jupyter Server base URL -> Jupyter Lab URL for notebook-like UI */
function getJupyterLabUrl(baseUrl: string): string {
  const u = baseUrl.replace(/\/$/, '')
  return `${u}/lab`
}

