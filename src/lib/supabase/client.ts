import { createBrowserClient as supabaseBrowserClient } from '@supabase/ssr'

export function createBrowserClient() {
  return supabaseBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
