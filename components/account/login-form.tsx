"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { createClient } from "@/lib/supabase/client"

export function LoginForm() {
  const t = useTranslations("Auth")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [needsConfirmation, setNeedsConfirmation] = useState(false)
  const [resendState, setResendState] = useState<"idle" | "sending" | "sent">("idle")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const locale = useLocale()
  const next = searchParams.get("next") ?? "/account"

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setNeedsConfirmation(false)
    setResendState("idle")

    const supabase = createClient()
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      if (signInError.code === "email_not_confirmed") {
        setNeedsConfirmation(true)
        setError(t("emailNotConfirmed"))
      } else {
        setError(t("invalidCredentials"))
      }
      setLoading(false)
      return
    }

    const isAdmin = data.user?.user_metadata?.is_admin === true
    if (isAdmin) {
      await supabase.auth.signOut()
      setError(t("useAdminLogin"))
      setLoading(false)
      return
    }

    router.push(next)
    router.refresh()
  }

  async function resendConfirmation() {
    setResendState("sending")
    const supabase = createClient()
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${window.location.origin}/${locale}/auth/callback` },
    })
    if (resendError) {
      setError(resendError.message)
      setResendState("idle")
      return
    }
    setResendState("sent")
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <label className="block">
        <span className="mb-2 block text-[11px] tracking-[0.2em] text-muted-foreground uppercase">{t("emailLabel")}</span>
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
          <span className="text-[11px] tracking-[0.2em] text-muted-foreground uppercase">{t("passwordLabel")}</span>
          <Link href="/account/forgot-password" className="text-[11px] text-muted-foreground hover:text-foreground">
            {t("forgotPassword")}
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
        <div className="border border-destructive/50 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
          {needsConfirmation && (
            <div className="mt-3">
              {resendState === "sent" ? (
                <span className="text-muted-foreground">{t("resent")}</span>
              ) : (
                <button
                  type="button"
                  onClick={resendConfirmation}
                  disabled={resendState === "sending"}
                  className="text-foreground underline underline-offset-4 disabled:opacity-60"
                >
                  {resendState === "sending" ? t("resending") : t("resend")}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-foreground py-4 text-xs tracking-[0.25em] text-background uppercase transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {loading ? t("loggingIn") : t("login")}
      </button>
    </form>
  )
}
