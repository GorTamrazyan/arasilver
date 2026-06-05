import type { ReactNode } from "react"
import Link from "next/link"
import { AdminSignOut } from "./admin-sign-out"

export function AdminShell({ children, active }: { children: ReactNode; active?: "orders" | "products" | "media" }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:px-10">
          <div className="flex items-center gap-10">
            <Link href="/" className="font-serif text-xl tracking-[0.3em]">
              ARASILVER
            </Link>
            <nav className="flex items-center gap-6 text-xs tracking-[0.2em] uppercase">
              <Link
                href="/admin"
                className={active === "orders" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}
              >
                Заказы
              </Link>
              <Link
                href="/admin/products"
                className={active === "products" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}
              >
                Товары
              </Link>
              <Link
                href="/admin/media"
                className={active === "media" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}
              >
                Медиа
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
