"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Plus, Trash2 } from "lucide-react"
import { saveAnnouncement } from "@/app/actions/admin"
import { ANNOUNCEMENT_LOCALES, ANNOUNCEMENT_LOCALE_LABELS } from "@/lib/site-settings"

/** Splits the stored multiline text into individual messages. */
function toMessages(raw: string): string[] {
  const items = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
  return items.length > 0 ? items : [""]
}

export function AnnouncementManager({ initial }: { initial: Record<string, string> }) {
  const [messages, setMessages] = useState<Record<string, string[]>>(() => {
    const out: Record<string, string[]> = {}
    for (const locale of ANNOUNCEMENT_LOCALES) out[locale] = toMessages(initial[locale] ?? "")
    return out
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const t = useTranslations("Admin.announcement")
  const router = useRouter()

  function setLocaleMessages(locale: string, next: string[]) {
    setMessages((prev) => ({ ...prev, [locale]: next }))
    setSaved(false)
  }

  function updateMessage(locale: string, index: number, value: string) {
    const next = [...messages[locale]]
    next[index] = value
    setLocaleMessages(locale, next)
  }

  function addMessage(locale: string) {
    setLocaleMessages(locale, [...messages[locale], ""])
  }

  function removeMessage(locale: string, index: number) {
    const next = messages[locale].filter((_, i) => i !== index)
    setLocaleMessages(locale, next.length > 0 ? next : [""])
  }

  async function onSave() {
    setSaving(true)
    setError(null)
    setSaved(false)
    // Collapse each locale's messages back into the stored "one item per line" format.
    const byLocale: Record<string, string> = {}
    for (const locale of ANNOUNCEMENT_LOCALES) {
      byLocale[locale] = messages[locale].map((m) => m.trim()).filter(Boolean).join("\n")
    }
    const res = await saveAnnouncement(byLocale)
    if (res.ok) {
      setSaved(true)
      router.refresh()
    } else {
      setError(res.error)
    }
    setSaving(false)
  }

  return (
    <div className="border border-border bg-background p-6">
      <p className="text-[11px] tracking-[0.2em] text-muted-foreground uppercase">{t("title")}</p>
      <p className="mt-2 text-sm text-muted-foreground">{t("hint")}</p>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {ANNOUNCEMENT_LOCALES.map((locale) => (
          <div key={locale}>
            <span className="mb-3 block text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
              {ANNOUNCEMENT_LOCALE_LABELS[locale] ?? locale}
            </span>

            <div className="space-y-2">
              {messages[locale].map((value, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="w-5 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                    {index + 1}.
                  </span>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => updateMessage(locale, index, e.target.value)}
                    placeholder={t("messagePlaceholder")}
                    className="w-full border border-border bg-background px-3 py-2 text-sm focus:border-foreground focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeMessage(locale, index)}
                    aria-label={t("removeMessage")}
                    className="shrink-0 border border-border p-2 text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => addMessage(locale)}
              className="mt-3 inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-foreground"
            >
              <Plus className="h-3.5 w-3.5" />
              {t("addMessage")}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-4 border-t border-border pt-5">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="bg-foreground px-6 py-3 text-xs tracking-[0.25em] text-background uppercase transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {saving ? t("saving") : t("save")}
        </button>
        {saved && <span className="text-xs tracking-[0.2em] text-muted-foreground uppercase">{t("saved")}</span>}
        {error && <span className="text-xs text-destructive">{error}</span>}
      </div>
    </div>
  )
}
