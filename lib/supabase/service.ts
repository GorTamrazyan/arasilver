import "server-only"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

/**
 * Supabase-клиент с service-role ключом.
 *
 * Используется ТОЛЬКО на сервере в вебхуках/колбэках банка, где нет
 * пользовательской сессии и cookie, но нужно записать результат платежа
 * в обход RLS.
 *
 * НИКОГДА не импортировать в клиентский код — ключ даёт полный доступ к БД.
 * Импорт "server-only" приведёт к ошибке сборки при попытке тянуть его в браузер.
 */
let cached: ReturnType<typeof createSupabaseClient<Database>> | null = null

export function createServiceClient() {
  if (cached) return cached
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    throw new Error("Не заданы NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY")
  }
  cached = createSupabaseClient<Database>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return cached
}
