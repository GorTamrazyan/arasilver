import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { formatPrice } from "@/lib/format"
import { STATUS_LABELS } from "@/lib/types"
import type { Order } from "@/lib/types"

export const dynamic = "force-dynamic"

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })

  const orders = (data ?? []) as Order[]

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="font-serif text-3xl italic text-muted-foreground">Заказов пока нет</p>
        <Link
          href="/shop"
          className="mt-8 border border-foreground px-8 py-4 text-xs tracking-[0.25em] uppercase transition-colors hover:bg-foreground hover:text-background"
        >
          Перейти в каталог
        </Link>
      </div>
    )
  }

  return (
    <div>
      <p className="mb-6 text-xs tracking-[0.25em] text-muted-foreground uppercase">
        {orders.length} {orders.length === 1 ? "заказ" : orders.length < 5 ? "заказа" : "заказов"}
      </p>
      <div className="divide-y divide-border/60 border-y border-border/60">
        {orders.map((o) => (
          <Link
            key={o.id}
            href={`/account/orders/${o.id}`}
            className="group flex items-start justify-between gap-4 py-7 -mx-2 px-2 transition-colors hover:bg-secondary/30"
          >
            <div>
              <p className="font-serif text-xl">{o.order_number}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {new Date(o.created_at).toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-serif text-xl tabular-nums">{formatPrice(o.total)}</p>
              <p className="mt-2 text-[10px] tracking-[0.15em] text-muted-foreground uppercase">
                {STATUS_LABELS[o.status]}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
