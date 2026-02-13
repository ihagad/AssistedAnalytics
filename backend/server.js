require('dotenv').config()
const express = require('express')
const path = require('path')
const cors = require('cors')
const { createClient } = require('@supabase/supabase-js')

const app = express()
app.use(cors())
app.use(express.json({ limit: '5mb' }))

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.warn('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in environment')
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// API routes (mounted first so they always win over static/catch-all)
const api = require('express').Router()

api.get('/health', async (req, res) => {
  const supabaseConfigured = !!(SUPABASE_URL && SUPABASE_SERVICE_KEY)
  let supabaseConnected = false
  if (supabaseConfigured) {
    try {
      const { error } = await supabase.from('datasets').select('id').limit(1)
      supabaseConnected = !error
    } catch (_) {
      // ignore
    }
  }
  res.json({
    ok: true,
    supabase: supabaseConfigured ? (supabaseConnected ? 'connected' : 'configured_not_connected') : 'not_configured',
  })
})

api.post('/save-dataset', async (req, res) => {
  try {
    const { dataset, userId } = req.body
    if (!dataset) return res.status(400).json({ error: 'dataset required' })

    const payload = {
      user_id: userId || null,
      name: dataset.name || null,
      data: dataset,
    }

    const { data, error } = await supabase.from('datasets').insert(payload).select()
    if (error) {
      console.error('Supabase insert error', error)
      return res.status(500).json({ error: error.message || error })
    }
    return res.json({ ok: true, record: data?.[0] ?? null })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'internal error' })
  }
})

app.use('/api', api)

// Serve frontend when built (e.g. on Railway with no separate frontend host)
const frontendDist = path.join(__dirname, '../frontend/dist')
app.use(express.static(frontendDist))
app.get('*', (req, res, next) => {
  const fs = require('fs')
  const index = path.join(frontendDist, 'index.html')
  if (fs.existsSync(index)) res.sendFile(index)
  else next()
})

const port = process.env.PORT || 3001
app.listen(port, () => console.log(`Server listening on ${port}`))
