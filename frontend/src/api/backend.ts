export async function postJson(path: string, body: any) {
  const base = import.meta.env.VITE_BACKEND_URL || ''
  const res = await fetch(`${base}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText)
  }
  return res.json()
}

export async function saveDataset(dataset: any, userId?: string) {
  return postJson('/api/save-dataset', { dataset, userId })
}
