import Papa from 'papaparse'

export interface ParseResult {
  data: any[]
  errors: any[]
  meta: {
    fields: string[]
    delimiter: string
  }
}

export function parseCSV(file: File): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve({
          data: results.data,
          errors: results.errors,
          meta: {
            fields: results.meta.fields || [],
            delimiter: results.meta.delimiter || ','
          }
        })
      },
      error: (error) => {
        reject(error)
      }
    })
  })
}
