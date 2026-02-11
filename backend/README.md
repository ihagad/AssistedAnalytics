# Backend (Railway) for AssistedAnalytics

This minimal Express backend is intended to be deployed to Railway (or similar) and provides a small proxy endpoint to save dataset records into Supabase using a service role key.

Environment variables (set in Railway):

- `SUPABASE_URL` - your Supabase project URL
- `SUPABASE_SERVICE_KEY` - Supabase service role key (keep secret)
- `PORT` - optional, default 3001

Database:
- Create a `datasets` table in Supabase with at least the columns:
  - `id` (uuid or serial primary key)
  - `user_id` (text, nullable)
  - `data` (jsonb)
  - `created_at` (timestamp with time zone, default now())

Run locally:

```bash
cd backend
npm install
SUPABASE_URL=... SUPABASE_SERVICE_KEY=... npm start
```
