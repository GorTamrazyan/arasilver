"use client"

import { useState, useTransition } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { updateOrderStatus } from "@/app/actions/admin"
import { formatPrice, formatDate } from "@/lib/format"
import { type Order, type OrderItem, type OrderStatus } from "@/lib/types"

const STATUS_OPTIONS: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled"]

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-accent/40 text-foreground",
  confirmed: "bg-secondary text-foreground",
  shipped: "bg-foreground text-background",
  delivered: "bg-secondary text-muted-foreground",
  cancelled: "bg-destructive/10 text-destructive",
}

export function OrdersTable({
  orders,
  itemsByOrder,
}: {
  orders: Order[]
  itemsByOrder: Record<string, OrderItem[]>
}) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const t = useTranslations("Admin.orders")
  const tStatus = useTranslations("Admin.status")
  const router = useRouter()

  function toggle(id: string) {
    setExpanded((cur) => (cur === id ? null : id))
  }

  function onStatusChange(orderId: string, status: OrderStatus) {
    startTransition(async () => {
      await updateOrderStatus(orderId, status)
      router.refresh()
    })
  }

  if (orders.length === 0) {
    return (
      <div className="border border-border bg-secondary/20 p-16 text-center">
        <p className="font-serif text-2xl italic text-muted-foreground">{t("empty")}</p>
      </div>
    )
  }

  return (
    <div className="border border-border">
      <div className="hidden grid-cols-[1fr_1.5fr_1fr_1fr_1fr_40px] gap-4 border-b border-border bg-secondary/40 px-5 py-3 text-[10px] tracking-[0.25em] text-muted-foreground uppercase md:grid">
        <span>{t("colNumber")}</span>
        <span>{t("colCustomer")}</span>
        <span>{t("colDate")}</span>
        <span>{t("colTotal")}</span>
        <span>{t("colStatus")}</span>
        <span />
      </div>

      <ul className="divide-y divide-border">
        {orders.map((order) => {
          const isOpen = expanded === order.id
          const items = itemsByOrder[order.id] ?? []
          return (
            <li key={order.id}>
              <button
                type="button"
                onClick={() => toggle(order.id)}
                className="grid w-full grid-cols-[1fr_40px] items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-secondary/30 md:grid-cols-[1fr_1.5fr_1fr_1fr_1fr_40px]"
              >
                <div className="md:contents">
                  <p className="font-mono text-sm tracking-wider">{order.order_number}</p>
                  <p className="text-sm">{order.customer_name}</p>
                  <p className="hidden text-xs text-muted-foreground md:block">{formatDate(order.created_at)}</p>
                  <p className="hidden font-serif text-lg tabular-nums md:block">
                    {formatPrice(Number(order.total), order.currency)}
                  </p>
                  <span
                    className={`hidden justify-self-start px-3 py-1 text-[10px] tracking-[0.2em] uppercase md:inline-block ${STATUS_STYLES[order.status]}`}
                  >
                    {tStatus(order.status)}
                  </span>
                </div>
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 justify-self-end text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 justify-self-end text-muted-foreground" />
                )}
              </button>

              {isOpen && (
                <div className="border-t border-border bg-secondary/20 px-5 py-6">
                  <div className="grid gap-8 md:grid-cols-2">
                    <div>
                      <h3 className="mb-3 text-[10px] tracking-[0.25em] text-muted-foreground uppercase">{t("sectionCustomer")}</h3>
                      <dl className="space-y-2 text-sm">
                        <Row label={t("name")} value={order.customer_name} />
                        <Row label={t("email")} value={order.customer_email} />
                        <Row label={t("phone")} value={order.customer_phone} />
                      </dl>

                      <h3 className="mt-6 mb-3 text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
                        {t("sectionShipping")}
                      </h3>
                      <dl className="space-y-2 text-sm">
                        <Row label={t("address")} value={order.shipping_address} />
                        <Row
                          label={t("city")}
                          value={`${order.shipping_city}${order.shipping_postal ? `, ${order.shipping_postal}` : ""}`}
                        />
                        <Row label={t("country")} value={order.shipping_country} />
                        {order.notes && <Row label={t("comment")} value={order.notes} />}
                      </dl>
                    </div>

                    <div>
                      <h3 className="mb-3 text-[10px] tracking-[0.25em] text-muted-foreground uppercase">{t("sectionItems")}</h3>
                      <ul className="space-y-2 border border-border bg-background p-4">
                        {items.map((it) => (
                          <li key={it.id} className="flex items-start justify-between gap-4 text-sm">
                            <div className="flex-1">
                              <p>{it.product_name}</p>
                              <p className="text-xs text-muted-foreground">
                                × {it.quantity} · {formatPrice(Number(it.unit_price))}
                              </p>
                            </div>
                            <p className="tabular-nums">{formatPrice(Number(it.subtotal))}</p>
                          </li>
                        ))}
                      </ul>

                      <dl className="mt-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">{t("subtotal")}</dt>
                          <dd className="tabular-nums">{formatPrice(Number(order.subtotal))}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">{t("shippingCost")}</dt>
                          <dd className="tabular-nums">{formatPrice(Number(order.shipping_cost))}</dd>
                        </div>
                        <div className="flex justify-between border-t border-border pt-2 font-serif text-lg">
                          <dt>{t("total")}</dt>
                          <dd className="tabular-nums">{formatPrice(Number(order.total))}</dd>
                        </div>
                      </dl>

                      <div className="mt-6">
                        <label className="mb-2 block text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
                          {t("statusLabel")}
                        </label>
                        <select
                          value={order.status}
                          onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
                          disabled={pending}
                          className="w-full border border-border bg-background px-3 py-2 text-sm focus:border-foreground focus:outline-none"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {tStatus(s)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}
