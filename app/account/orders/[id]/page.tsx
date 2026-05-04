import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { formatPrice } from "@/lib/format"
import { STATUS_LABELS } from "@/lib/types"
import type { Order, OrderItem } from "@/lib/types"

export const dynamic = "force-dynamic"

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: orderData } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .eq("user_id", user!.id)
    .maybeSingle()

  if (!orderData) notFound()
  const order = orderData as Order

  const { data: itemsData } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", id)

  const items = (itemsData ?? []) as OrderItem[]

  return (
    <div className="space-y-8">
      <div>
        <Link href="/account/orders" className="text-xs tracking-[0.2em] text-muted-foreground uppercase hover:text-foreground">
          ← К заказам
        </Link>
        <h2 className="mt-4 font-serif text-3xl">{order.order_number}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {new Date(order.created_at).toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="inline-block border border-border px-4 py-2">
        <span className="text-[10px] tracking-[0.25em] uppercase">{STATUS_LABELS[order.status]}</span>
      </div>

      <div>
        <p className="mb-4 text-xs tracking-[0.25em] text-muted-foreground uppercase">Товары</p>
        <ul className="divide-y divide-border/60 border-y border-border/60">
          {items.map((item) => (
            <li key={item.id} className="flex gap-4 py-4">
              <div className="relative aspect-[4/5] w-16 shrink-0 overflow-hidden bg-muted">
                {item.product_image && (
                  <Image src={item.product_image} alt={item.product_name} fill sizes="64px" className="object-cover" />
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <p className="font-serif text-base">{item.product_name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">× {item.quantity}</p>
                </div>
                <p className="text-sm tabular-nums">{formatPrice(item.subtotal)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <dl className="space-y-2 text-sm max-w-xs">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Подытог</dt>
          <dd className="tabular-nums">{formatPrice(order.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Доставка</dt>
          <dd className="tabular-nums">{formatPrice(order.shipping_cost)}</dd>
        </div>
        <div className="flex justify-between border-t border-border/60 pt-3 font-serif text-xl">
          <dt>Итого</dt>
          <dd className="tabular-nums">{formatPrice(order.total)}</dd>
        </div>
      </dl>

      <div className="grid gap-6 border-t border-border/60 pt-8 sm:grid-cols-2">
        <div>
          <p className="mb-3 text-[10px] tracking-[0.25em] text-muted-foreground uppercase">Получатель</p>
          <p className="text-sm">{order.customer_name}</p>
          <p className="text-sm text-muted-foreground">{order.customer_email}</p>
          <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
        </div>
        <div>
          <p className="mb-3 text-[10px] tracking-[0.25em] text-muted-foreground uppercase">Адрес доставки</p>
          <p className="text-sm">{order.shipping_address}</p>
          <p className="text-sm text-muted-foreground">{order.shipping_city}, {order.shipping_country}</p>
          {order.shipping_postal && <p className="text-sm text-muted-foreground">{order.shipping_postal}</p>}
        </div>
      </div>
    </div>
  )
}
