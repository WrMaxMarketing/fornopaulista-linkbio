import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Client Supabase com service_role.
 *
 * SOMENTE SERVER. Nunca importe este arquivo em um Client Component
 * ('use client') — a service_role key ignora RLS e não pode vazar pro browser.
 */

let cache: SupabaseClient | null = null

export function getSupabase(): SupabaseClient | null {
  if (cache) return cache

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  // Sem env configurada (build local, preview sem secrets) o tracking simplesmente
  // não grava — o redirect do cliente nunca pode quebrar por causa disso.
  if (!url || !key) return null

  cache = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  return cache
}
