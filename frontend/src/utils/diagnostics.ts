import { Diagnostic } from '../types'

export function analyzeDataset(data: any[], columns: string[]): Diagnostic[] {
  const diagnostics: Diagnostic[] = []

  // Check for missing columns
  const allKeys = new Set<string>()
  data.forEach(row => {
    Object.keys(row).forEach(key => allKeys.add(key))
  })

  columns.forEach(col => {
    if (!allKeys.has(col)) {
      diagnostics.push({
        type: 'missing',
        column: col,
        message: `Column "${col}" is missing from the dataset`,
        severity: 'high'
      })
    }
  })

  // Check each column for issues
  columns.forEach(column => {
    const values = data.map(row => row[column]).filter(v => v !== undefined && v !== null && v !== '')
    
    if (values.length === 0) {
      diagnostics.push({
        type: 'missing',
        column,
        message: `Column "${column}" has no valid values`,
        severity: 'high'
      })
      return
    }

    // Check for inconsistent types
    const types = new Set(values.map(v => typeof v))
    if (types.size > 1) {
      diagnostics.push({
        type: 'invalid',
        column,
        message: `Column "${column}" has inconsistent data types`,
        severity: 'medium',
        details: { types: Array.from(types) }
      })
    }

    // Check for skewed data (high percentage of null/empty)
    const nullCount = data.filter(row => !row[column] || row[column] === '' || row[column] === 'null').length
    const nullPercentage = (nullCount / data.length) * 100
    if (nullPercentage > 50) {
      diagnostics.push({
        type: 'skewed',
        column,
        message: `Column "${column}" has ${nullPercentage.toFixed(1)}% missing or empty values`,
        severity: 'high',
        details: { nullPercentage: nullPercentage.toFixed(1) }
      })
    }

    // Check for suspicious patterns (e.g., all same value, very low variance)
    const uniqueValues = new Set(values)
    if (uniqueValues.size === 1 && data.length > 10) {
      diagnostics.push({
        type: 'suspicious',
        column,
        message: `Column "${column}" has only one unique value across all rows`,
        severity: 'low',
        details: { uniqueValue: Array.from(uniqueValues)[0] }
      })
    }

    // Check for potential ID columns (all unique)
    if (uniqueValues.size === data.length && data.length > 100) {
      diagnostics.push({
        type: 'suspicious',
        column,
        message: `Column "${column}" appears to be an ID column (all values unique)`,
        severity: 'low'
      })
    }
  })

  return diagnostics
}
