"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get("next") ?? "/account"

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      setError("Неверный email или пароль")
      setLoading(false)
      return
    }

    const isAdmin = data.user?.user_metadata?.is_admin === true
    if (isAdmin) {
      await supabase.auth.signOut()
      setError("Для входа в админ-панель используйте /admin/login")
      setLoading(false)
      return
    }

    router.push(next)
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <label className="block">
        <span className="mb-2 block text-[11px] tracking-[0.2em] text-muted-foreground uppercase">Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none"
        />
      </label>
      <label className="block">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-[11px] tracking-[0.2em] text-muted-foreground uppercase">Пароль</span>
          <Link href="/account/forgot-password" className="text-[11px] text-muted-foreground hover:text-foreground">
            Забыли пароль?
          </Link>
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none"
        />
      </label>

      {error && (
        <div className="border border-destructive/50 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-foreground py-4 text-xs tracking-[0.25em] text-background uppercase transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Входим..." : "Войти"}
      </button>
    </form>
  )
}
