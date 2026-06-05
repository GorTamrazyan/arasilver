import { createClient as createSupabaseClient } from "@supabase/supabase-js"

/**
 * Anonymous Supabase client for **public** server reads (products, etc.).
 *
 * Does NOT touch cookies — so a route using this client stays statically
 * cacheable / ISR-friendly. Use this for any data that doesn't depend on the
 * signed-in user. For user-scoped data, use `lib/supabase/server.ts`.
 */
let cached: ReturnType<typeof createSupabaseClient> | null = null

export function createPublicClient() {
  if (cached) return cached
  cached = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  )
  return cached
}
