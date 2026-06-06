import type { ReactNode } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { AdminSignOut } from "./admin-sign-out"

export function AdminShell({ children, active }: { children: ReactNode; active?: "orders" | "products" | "media" }) {
  const t = useTranslations("Admin")
  const linkClass = (key: "orders" | "products" | "media") =>
    active === key
      ? "bg-secondary px-3 py-1.5 text-foreground"
      : "px-3 py-1.5 text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:px-10">
          <div className="flex items-center gap-10">
            <Link href="/" className="font-serif text-xl tracking-[0.3em]">
              ARASILVER
            </Link>
            <nav className="flex items-center gap-6 text-xs tracking-[0.2em] uppercase">
              <Link href="/admin" className={linkClass("orders")}>
                {t("nav.orders")}
              </Link>
              <Link href="/admin/products" className={linkClass("products")}>
                {t("nav.products")}
              </Link>
              <Link href="/admin/media" className={linkClass("media")}>
                {t("nav.media")}
              </Link>
            </nav>
          </div>
          <AdminSignOut />
        </div>
      </header>
      <div className="mx-auto max-w-[1400px] px-5 py-10 md:px-10 md:py-14">{children}</div>
    </div>
  )
}
