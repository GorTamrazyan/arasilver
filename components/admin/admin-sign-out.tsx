"use client"

import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { createClient } from "@/lib/supabase/client"

export function AdminSignOut() {
  const t = useTranslations("Admin")
  const router = useRouter()
  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }
  return (
    <button
      type="button"
      onClick={signOut}
      className="text-xs tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-foreground"
    >
      {t("signOut")}
    </button>
  )
}
