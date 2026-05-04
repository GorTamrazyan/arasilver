"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function RegisterForm({ prefillEmail }: { prefillEmail?: string }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState(prefillEmail ?? "")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const redirectTo = `${window.location.origin}/auth/callback`

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
        data: { full_name: name.trim(), is_admin: false },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="border border-border bg-secondary/30 p-6 text-center">
        <p className="font-serif text-2xl">Проверьте почту</p>
        <p className="mt-3 text-sm text-muted-foreground">
          Мы отправили письмо на <strong>{email}</strong>. Перейдите по ссылке, чтобы подтвердить аккаунт.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <label className="block">
        <span className="mb-2 block text-[11px] tracking-[0.2em] text-muted-foreground uppercase">Имя</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none"
        />
      </label>
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
        <span className="mb-2 block text-[11px] tracking-[0.2em] text-muted-foreground uppercase">Пароль</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
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
        {loading ? "Создаём..." : "Создать аккаунт"}
      </button>
    </form>
  )
}
