require('dotenv').config()
const express = require('express')
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

app.post('/api/save-dataset', async (req, res) => {
  try {
    const { dataset, userId } = req.body
    if (!dataset) return res.status(400).json({ error: 'dataset required' })

    // store dataset metadata in a 'datasets' table
    const payload = {
      user_id: userId || null,
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

const port = process.env.PORT || 3001
app.listen(port, () => console.log(`Server listening on ${port}`))
