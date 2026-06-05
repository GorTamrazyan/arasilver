"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { resetPassword } from "@/app/actions/account"

export function ResetPasswordForm() {
  const t = useTranslations("Auth")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (password !== confirm) {
      setError(t("passwordsDontMatch"))
      return
    }
    setLoading(true)
    setError(null)
    const result = await resetPassword(password)
    if (!result.ok) {
      setError(result.error)
      setLoading(false)
      return
    }
    router.push("/account")
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <label className="block">
        <span className="mb-2 block text-[11px] tracking-[0.2em] text-muted-foreground uppercase">{t("newPasswordLabel")}</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-[11px] tracking-[0.2em] text-muted-foreground uppercase">{t("confirmPasswordLabel")}</span>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
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
        {loading ? t("saving") : t("savePassword")}
      </button>
    </form>
  )
}
