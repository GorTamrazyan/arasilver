"use client"

import { useLocale, useTranslations } from "next-intl"
import { useTransition } from "react"
import { Globe, Check } from "lucide-react"
import { usePathname, useRouter } from "@/i18n/navigation"
import { useParams } from "next/navigation"
import { routing, type Locale } from "@/i18n/routing"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const t = useTranslations("LanguageSwitcher")
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const [isPending, startTransition] = useTransition()

  function changeLocale(next: Locale) {
    if (next === locale) return
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- params is generic and the route is dynamic
        { pathname, params },
        { locale: next },
      )
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label={t("label")}
          disabled={isPending}
          className={`flex items-center gap-1.5 text-sm tracking-wide transition-colors hover:text-foreground focus:outline-none disabled:opacity-50 ${className}`}
        >
          <Globe className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline uppercase text-xs tracking-[0.2em]">
            {locale}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-40 rounded-none border-border bg-background p-0"
      >
        {routing.locales.map((l) => (
          <DropdownMenuItem
            key={l}
            onClick={() => changeLocale(l)}
            className="flex items-center justify-between rounded-none px-4 py-3 text-xs tracking-[0.15em] uppercase focus:bg-secondary cursor-pointer"
          >
            <span>{t(l)}</span>
            {l === locale && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
