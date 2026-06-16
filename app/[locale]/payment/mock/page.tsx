import { redirect } from "next/navigation"
import { setRequestLocale } from "next-intl/server"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { createClient } from "@/lib/supabase/server"
import { applyPaymentResult } from "@/lib/orders/payment-orders"
import { formatPrice } from "@/lib/format"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

/**
 * Демо-страница «банка» (имитация). Показывает, что произойдёт на стороне
 * банка: покупатель видит сумму и подтверждает или отклоняет оплату. Кнопки
 * прогоняют тот же серверный путь, что и реальный колбэк: applyPaymentResult →
 * payments.status + orders.status='confirmed' → редирект на success/fail.
 */
export default async function MockBankPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ order?: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const { order } = await searchParams
  if (!order) redirect(`/${locale}`)

  const supabase = await createClient()
  const { data: ord } = await supabase
    .from("orders")
    .select("order_number, total")
    .eq("id", order)
    .single()

  async function complete(formData: FormData) {
    "use server"
    const outcome = formData.get("outcome") === "paid" ? "paid" : "failed"
    await applyPaymentResult({
      orderId: order!,
      provider: "mock",
      providerPaymentId: `mock_${Date.now()}`,
      status: outcome,
      raw: { demo: true, outcome },
    })
    redirect(`/${locale}/payment/${outcome === "paid" ? "success" : "fail"}?order=${order}`)
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <section className="mx-auto flex max-w-lg flex-col items-center px-5 py-20 text-center md:py-28">
        <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase">
          Демо-оплата · имитация банка
        </p>
        <h1 className="mt-6 font-serif text-4xl leading-tight md:text-5xl">
          Платёжная <em className="font-light italic text-muted-foreground">форма</em>
        </h1>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
          Это тестовая страница вместо настоящей формы банка. Выберите исход — весь
          остальной конвейер (запись платежа, смена статуса заказа, страница
          результата) отработает по-настоящему.
        </p>

        <div className="mt-10 w-full border border-border px-8 py-6 text-left">
          <p className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase">К оплате</p>
          <p className="mt-2 font-serif text-3xl tabular-nums">
            {typeof ord?.total === "number" ? formatPrice(ord.total) : "—"}
          </p>
          {ord?.order_number && (
            <p className="mt-2 text-xs text-muted-foreground">Заказ {ord.order_number}</p>
          )}
        </div>

        <form action={complete} className="mt-10 flex w-full flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            name="outcome"
            value="paid"
            className="flex-1 bg-foreground px-8 py-4 text-xs tracking-[0.25em] text-background uppercase transition-opacity hover:opacity-90"
          >
            Оплатить успешно
          </button>
          <button
            type="submit"
            name="outcome"
            value="failed"
            className="flex-1 border border-foreground px-8 py-4 text-xs tracking-[0.25em] uppercase transition-colors hover:bg-foreground hover:text-background"
          >
            Отклонить платёж
          </button>
        </form>
      </section>

      <SiteFooter />
    </main>
  )
}
