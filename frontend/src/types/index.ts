export interface Dataset {
  id: string
  name: string
  uploadedAt: Date
  data: any[]
  columns: string[]
}

export interface Diagnostic {
  type: 'missing' | 'invalid' | 'skewed' | 'suspicious'
  column: string
  message: string
  severity: 'low' | 'medium' | 'high'
  details?: any
}

export interface NotebookCell {
  id: string
  type: 'plan' | 'code' | 'transformation'
  title: string
  content: string
  isCollapsed: boolean
  relatedCells?: string[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}
