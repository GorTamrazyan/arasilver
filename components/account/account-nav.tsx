"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronRight } from "lucide-react"
import { Link, usePathname } from "@/i18n/navigation"
import { signOut } from "@/app/actions/auth"

const accountLinks = [
  { label: "Кабинет", href: "/account" },
  { label: "Заказы", href: "/account/orders" },
  { label: "Избранное", href: "/account/wishlist" },
  { label: "Адреса", href: "/account/addresses" },
  { label: "Профиль", href: "/account/profile" },
]

export function AccountNav() {
  const pathname = usePathname()
  const scrollRef = useRef<HTMLDivElement>(null)
  // Whether the horizontal tab strip is scrolled all the way right. When false
  // (more tabs hidden off-screen) we show a fade + arrow hint on mobile.
  const [atEnd, setAtEnd] = useState(false)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const update = () => {
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4)
    }
    update()
    el.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      el.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  function isActive(href: string) {
    return href === "/account" ? pathname === "/account" : pathname.startsWith(href)
  }

  return (
    <div className="relative lg:contents">
      <nav
        ref={scrollRef}
        className="-mx-5 flex snap-x flex-row gap-1 overflow-x-auto px-5 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0"
        // Hide the scrollbar on mobile while keeping the row swipeable.
        style={{ scrollbarWidth: "none" }}
      >
        {accountLinks.map((l) => {
          const active = isActive(l.href)
          return (
            <Link
              key={l.href}
              href={l.href}
              aria-current={active ? "page" : undefined}
              className={`shrink-0 snap-start whitespace-nowrap border-b px-4 py-4 text-[11px] tracking-[0.2em] uppercase transition-colors lg:px-0 lg:pr-0 lg:py-5 ${
                active
                  ? "border-foreground text-foreground"
                  : "border-border/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          )
        })}
        <form action={signOut} className="shrink-0 lg:mt-6">
          <button
            type="submit"
            className="w-full whitespace-nowrap border-b border-border/60 px-4 py-4 text-left text-[11px] tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-foreground lg:px-0 lg:py-5"
          >
            Выйти
          </button>
        </form>
      </nav>

      {/* Scroll hint — fade + arrow, only on mobile and only while more tabs
          remain to the right. Non-interactive so it never blocks taps. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 right-0 flex items-center bg-gradient-to-l from-background via-background to-transparent pr-1 pl-10 transition-opacity duration-200 lg:hidden ${
          atEnd ? "opacity-0" : "opacity-100"
        }`}
      >
        <ChevronRight className="h-4 w-4 animate-pulse text-muted-foreground" />
      </div>
    </div>
  )
}
