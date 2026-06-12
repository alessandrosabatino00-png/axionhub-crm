import { createBrowserClient } from '@supabase/ssr'

// Client lato browser — salva la sessione nei cookie,
// così proxy e layout server la vedono
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
