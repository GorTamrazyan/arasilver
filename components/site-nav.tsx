"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { CartButton } from "./cart/cart-button"

const navLinks = [
  { label: "Каталог", href: "/shop" },
  { label: "Кольца", href: "/shop?category=rings" },
  { label: "Серьги", href: "/shop?category=earrings" },
  { label: "О бренде", href: "/#about" },
]

export function SiteNav() {
  const [open, setOpen] = useState(false)

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
