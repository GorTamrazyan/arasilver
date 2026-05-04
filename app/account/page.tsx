import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { formatPrice } from "@/lib/format"

export const dynamic = "force-dynamic"

export default async function AccountDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ count: orderCount }, { count: wishlistCount }] = await Promise.all([
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("user_id", user!.id),
    supabase.from("wishlists").select("id", { count: "exact", head: true }).eq("user_id", user!.id),
  ])

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("id, order_number, total, status, created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(3)

  return (
    <div className="space-y-16">

      <div className="grid gap-6 sm:grid-cols-2">
        <Stat label="Заказов" value={String(orderCount ?? 0)} href="/account/orders" />
        <Stat label="Избранных" value={String(wishlistCount ?? 0)} href="/account/wishlist" />
      </div>

      {recentOrders && recentOrders.length > 0 && (
        <div>
          <div className="mb-6 flex items-baseline justify-between">
            <p className="text-xs tracking-[0.25em] text-muted-foreground uppercase">Последние заказы</p>
            <Link href="/account/orders" className="text-xs text-muted-foreground hover:text-foreground">
              Все →
            </Link>
          </div>
          <div className="divide-y divide-border/60 border-y border-border/60">
            {recentOrders.map((o) => (
              <Link
                key={o.id}
                href={`/account/orders/${o.id}`}
                className="flex items-center justify-between py-6 -mx-3 px-3 transition-colors hover:bg-secondary/30"
              >
                <div>
                  <p className="font-serif text-lg">{o.order_number}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {new Date(o.created_at).toLocaleDateString("ru-RU")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm tabular-nums">{formatPrice(o.total)}</p>
                  <p className="mt-2 text-[10px] tracking-[0.15em] text-muted-foreground uppercase">{o.status}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <QuickLink href="/account/orders" label="История заказов" />
        <QuickLink href="/account/wishlist" label="Избранное" />
        <QuickLink href="/account/addresses" label="Адреса доставки" />
        <QuickLink href="/account/profile" label="Редактировать профиль" />
        <QuickLink href="/shop" label="Перейти в каталог" />
      </div>

    </div>
  )
}

function Stat({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <Link href={href} className="block border border-border bg-secondary/30 p-10 transition-colors hover:bg-secondary/50">
      <p className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase">{label}</p>
      <p className="mt-4 font-serif text-5xl tabular-nums">{value}</p>
    </Link>
  )
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="border border-border/60 px-6 py-6 text-xs tracking-[0.2em] uppercase transition-colors hover:border-foreground hover:bg-secondary/30"
    >
      {label} →
    </Link>
  )
}
