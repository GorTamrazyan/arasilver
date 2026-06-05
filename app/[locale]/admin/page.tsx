import { createClient } from "@/lib/supabase/server"
import { AdminShell } from "@/components/admin/admin-shell"
import { OrdersTable } from "@/components/admin/orders-table"
import type { Order, OrderItem } from "@/lib/types"
import { formatPrice } from "@/lib/format"

export const dynamic = "force-dynamic"

export default async function AdminOrdersPage() {
  const supabase = await createClient()

  const { data: ordersData } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })

  const orders = (ordersData ?? []) as Order[]

  const ids = orders.map((o) => o.id)
  const { data: itemsData } = ids.length
    ? await supabase.from("order_items").select("*").in("order_id", ids)
    : { data: [] as OrderItem[] }

  const items = (itemsData ?? []) as OrderItem[]
  const itemsByOrder = new Map<string, OrderItem[]>()
  for (const it of items) {
    const arr = itemsByOrder.get(it.order_id) ?? []
    arr.push(it)
    itemsByOrder.set(it.order_id, arr)
  }

  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + Number(o.total), 0)
  const pendingCount = orders.filter((o) => o.status === "pending").length

  return (
    <AdminShell active="orders">
      <div className="mb-10">
        <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase">Заказы</p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl">Управление заказами</h1>
      </div>

      <div className="mb-10 grid gap-5 sm:grid-cols-3">
        <Stat label="Всего заказов" value={orders.length.toString()} />
        <Stat label="Ожидают обработки" value={pendingCount.toString()} />
        <Stat label="Выручка" value={formatPrice(totalRevenue)} />
      </div>

      <OrdersTable orders={orders} itemsByOrder={Object.fromEntries(itemsByOrder)} />
    </AdminShell>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border bg-secondary/30 p-6">
      <p className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase">{label}</p>
      <p className="mt-3 font-serif text-3xl tabular-nums">{value}</p>
    </div>
  )
}
