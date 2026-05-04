"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Menu, X, User, ChevronDown } from "lucide-react"
import { CartButton } from "./cart/cart-button"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navLinks = [
  { label: "Каталог", href: "/shop" },
  { label: "Кольца", href: "/shop?category=rings" },
  { label: "Серьги", href: "/shop?category=earrings" },
  { label: "О бренде", href: "/#about" },
]

function UserNavSection() {
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
        Войти
      </Link>
    )
  }

  const isAdmin = user.user_metadata?.is_admin === true
  const displayName = user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "Аккаунт"

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
              <Link href="/admin">Админ-панель</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
          </>
        )}
        <DropdownMenuItem asChild className="rounded-none px-4 py-3 text-xs tracking-[0.15em] uppercase focus:bg-secondary">
          <Link href="/account">Мой кабинет</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="rounded-none px-4 py-3 text-xs tracking-[0.15em] uppercase focus:bg-secondary">
          <Link href="/account/orders">Заказы</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="rounded-none px-4 py-3 text-xs tracking-[0.15em] uppercase focus:bg-secondary">
          <Link href="/account/wishlist">Избранное</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="rounded-none px-4 py-3 text-xs tracking-[0.15em] uppercase focus:bg-secondary">
          <Link href="/account/addresses">Адреса</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="rounded-none px-4 py-3 text-xs tracking-[0.15em] uppercase text-muted-foreground focus:bg-secondary focus:text-foreground cursor-pointer"
        >
          Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function SiteNav() {
  const [open, setOpen] = useState(false)
  const [mobileUser, setMobileUser] = useState<SupabaseUser | null | undefined>(undefined)
  const router = useRouter()

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
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </nav>

        <button type="button" aria-label="Открыть меню" onClick={() => setOpen(true)} className="md:hidden">
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        <Link
          href="/"
          className="font-serif text-2xl tracking-[0.35em] text-foreground md:text-[1.6rem]"
          aria-label="ARASILVER — на главную"
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
            Instagram
          </a>
          <UserNavSection />
          <CartButton />
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-background md:hidden">
          <div className="flex h-16 items-center justify-between border-b border-border/60 px-5">
            <span className="font-serif text-xl tracking-[0.3em]">ARASILVER</span>
            <button type="button" aria-label="Закрыть меню" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <nav className="flex flex-col gap-1 px-5 py-8">
            {navLinks.map((l) => (
              <Link
                key={l.href}
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
                  Мой кабинет
                </Link>
                <Link href="/account/orders" onClick={() => setOpen(false)} className="border-b border-border/50 py-4 font-serif text-2xl text-foreground">
                  Заказы
                </Link>
                <Link href="/account/wishlist" onClick={() => setOpen(false)} className="border-b border-border/50 py-4 font-serif text-2xl text-foreground">
                  Избранное
                </Link>
                <button onClick={handleMobileSignOut} className="mt-4 text-left text-sm tracking-[0.2em] text-muted-foreground uppercase">
                  Выйти
                </button>
              </>
            ) : (
              <Link href="/account/login" onClick={() => setOpen(false)} className="border-b border-border/50 py-4 font-serif text-2xl text-foreground">
                Войти
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
          </nav>
        </div>
      )}
    </header>
  )
}
