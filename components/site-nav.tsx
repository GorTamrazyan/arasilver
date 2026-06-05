"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { Menu, X, User, ChevronDown } from "lucide-react"
import { Link, useRouter } from "@/i18n/navigation"
import { CartButton } from "./cart/cart-button"
import { LanguageSwitcher } from "./language-switcher"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const CATALOG_CATEGORIES = [
  "rings",
  "earrings",
  "pendants",
  "bracelets",
  "necklaces",
] as const

function CatalogMenu() {
  const t = useTranslations("Nav")
  const tCategories = useTranslations("Categories")
  const [open, setOpen] = useState(false)
  let closeTimer: ReturnType<typeof setTimeout> | undefined

  function handleEnter() {
    if (closeTimer) clearTimeout(closeTimer)
    setOpen(true)
  }
  function handleLeave() {
    // Small delay so the cursor can travel from the trigger to the panel
    // without the menu flickering closed.
    closeTimer = setTimeout(() => setOpen(false), 120)
  }

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <Link
        href="/shop"
        className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
      >
        {t("catalog")}
        <ChevronDown className="h-3 w-3 opacity-60" aria-hidden="true" />
      </Link>

      {open && (
        <div className="absolute left-0 top-full z-50 pt-3">
          <div className="min-w-[220px] border border-border bg-background shadow-lg">
            <Link
              href="/shop"
              className="block border-b border-border/60 px-5 py-3 text-[11px] tracking-[0.2em] uppercase text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
            >
              {tCategories("all")}
            </Link>
            {CATALOG_CATEGORIES.map((c) => (
              <Link
                key={c}
                href={{ pathname: "/shop", query: { category: c } }}
                className="block border-b border-border/60 px-5 py-3 text-[11px] tracking-[0.2em] uppercase text-foreground/80 transition-colors last:border-b-0 hover:bg-secondary hover:text-foreground"
              >
                {tCategories(c)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function UserNavSection() {
  const t = useTranslations("Nav")
  const [user, setUser] = useState<SupabaseUser | null | undefined>(undefined)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  if (user === undefined) return <div className="w-14" />

  if (!user) {
    return (
      <Link
        href="/account/login"
        className="text-sm tracking-wide transition-colors hover:text-foreground"
      >
        {t("login")}
      </Link>
    )
  }

  const isAdmin = user.user_metadata?.is_admin === true
  const displayName = user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? t("account")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1.5 text-sm tracking-wide transition-colors hover:text-foreground focus:outline-none">
          <User className="h-4 w-4" />
          <span className="hidden lg:block max-w-[120px] truncate">{displayName}</span>
          <ChevronDown className="h-3 w-3 opacity-60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 rounded-none border-border bg-background p-0">
        {isAdmin && (
          <>
            <DropdownMenuItem asChild className="rounded-none px-4 py-3 text-xs tracking-[0.15em] uppercase focus:bg-secondary">
              <Link href="/admin">{t("adminPanel")}</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
          </>
        )}
        <DropdownMenuItem asChild className="rounded-none px-4 py-3 text-xs tracking-[0.15em] uppercase focus:bg-secondary">
          <Link href="/account">{t("myAccount")}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="rounded-none px-4 py-3 text-xs tracking-[0.15em] uppercase focus:bg-secondary">
          <Link href="/account/orders">{t("orders")}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="rounded-none px-4 py-3 text-xs tracking-[0.15em] uppercase focus:bg-secondary">
          <Link href="/account/wishlist">{t("wishlist")}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="rounded-none px-4 py-3 text-xs tracking-[0.15em] uppercase focus:bg-secondary">
          <Link href="/account/addresses">{t("addresses")}</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="rounded-none px-4 py-3 text-xs tracking-[0.15em] uppercase text-muted-foreground focus:bg-secondary focus:text-foreground cursor-pointer"
        >
          {t("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function SiteNav() {
  const t = useTranslations("Nav")
  const [open, setOpen] = useState(false)
  const [mobileUser, setMobileUser] = useState<SupabaseUser | null | undefined>(undefined)
  const router = useRouter()

  const navLinks = [
    { label: t("catalog"), href: "/shop" as const },
    { label: t("about"), href: "/#about" as const },
  ]

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setMobileUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setMobileUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleMobileSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setOpen(false)
    router.push("/")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:px-10">
        <nav className="hidden items-center gap-8 text-sm tracking-wide text-foreground/80 md:flex">
          <CatalogMenu />
          <Link href="/#about" className="transition-colors hover:text-foreground">
            {t("about")}
          </Link>
        </nav>

        <button type="button" aria-label={t("openMenu")} onClick={() => setOpen(true)} className="md:hidden">
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        <Link
          href="/"
          className="font-serif text-2xl tracking-[0.35em] text-foreground md:text-[1.6rem]"
          aria-label={t("homeAria")}
        >
          ARASILVER
        </Link>

        <div className="flex items-center gap-5 text-sm text-foreground/80">
          <a
            href="https://instagram.com/arasilver"
            target="_blank"
            rel="noreferrer noopener"
            className="hidden tracking-wide transition-colors hover:text-foreground lg:block"
          >
            {t("instagram")}
          </a>
          <LanguageSwitcher />
          <UserNavSection />
          <CartButton />
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-background md:hidden">
          <div className="flex h-16 items-center justify-between border-b border-border/60 px-5">
            <span className="font-serif text-xl tracking-[0.3em]">ARASILVER</span>
            <button type="button" aria-label={t("closeMenu")} onClick={() => setOpen(false)}>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <nav className="flex flex-col gap-1 px-5 py-8">
            {navLinks.map((l, i) => (
              <Link
                key={i}
                // @ts-expect-error -- mixed string/object hrefs for the locale-aware Link
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-border/50 py-4 font-serif text-2xl text-foreground"
              >
                {l.label}
              </Link>
            ))}
            {mobileUser ? (
              <>
                <Link href="/account" onClick={() => setOpen(false)} className="border-b border-border/50 py-4 font-serif text-2xl text-foreground">
                  {t("myAccount")}
                </Link>
                <Link href="/account/orders" onClick={() => setOpen(false)} className="border-b border-border/50 py-4 font-serif text-2xl text-foreground">
                  {t("orders")}
                </Link>
                <Link href="/account/wishlist" onClick={() => setOpen(false)} className="border-b border-border/50 py-4 font-serif text-2xl text-foreground">
                  {t("wishlist")}
                </Link>
                <button onClick={handleMobileSignOut} className="mt-4 text-left text-sm tracking-[0.2em] text-muted-foreground uppercase">
                  {t("logout")}
                </button>
              </>
            ) : (
              <Link href="/account/login" onClick={() => setOpen(false)} className="border-b border-border/50 py-4 font-serif text-2xl text-foreground">
                {t("login")}
              </Link>
            )}
            <a
              href="https://instagram.com/arasilver"
              target="_blank"
              rel="noreferrer noopener"
              className="mt-8 text-sm tracking-[0.2em] text-muted-foreground uppercase"
            >
              Instagram ↗
            </a>
            <div className="mt-6">
              <LanguageSwitcher className="text-base" />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
