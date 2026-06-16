"use server"

import { getProvider, isProviderName } from "@/lib/payments"
import { toMinorUnits } from "@/lib/payments/money"
import { attachProviderPaymentId, createPaymentRecord } from "@/lib/orders/payment-orders"
import { createClient } from "@/lib/supabase/server"

export type StartPaymentResult = { ok: true; redirectUrl: string } | { ok: false; error: string }

/**
 * Старт онлайн-оплаты по уже созданному заказу.
 *
 * Работает ТОЛЬКО через интерфейс PaymentProvider — деталей банка не знает.
 * Возвращает URL платёжной формы банка, на который редиректит клиент.
 */
export async function startPayment(
  orderId: string,
  providerName: string,
  locale: string,
): Promise<StartPaymentResult> {
  try {
    if (!isProviderName(providerName)) return { ok: false, error: "Неизвестный способ оплаты" }

    const supabase = await createClient()
    const { data: order, error } = await supabase
      .from("orders")
      .select("id, order_number, total, currency, status, customer_email")
      .eq("id", orderId)
      .single()

    if (error || !order) return { ok: false, error: "Заказ не найден" }
    if (order.status !== "pending") return { ok: false, error: "Заказ уже обработан" }

    // TODO(валюта): сейчас orders.total хранится в условных единицах (USD).
    //   Когда магазин перейдёт на AMD — здесь будет реальная сумма AMD из заказа.
    const amountMinor = toMinorUnits(Number(order.total))

    const created = await createPaymentRecord({
      orderId: order.id,
      provider: providerName,
      amountMinor,
    })
    if (!created.ok) return { ok: false, error: created.error }

    const provider = getProvider(providerName)
    const init = await provider.initPayment({
      orderId: order.id,
      orderNumber: order.order_number,
      amountMinor,
      currency: "AMD",
      locale,
      customerEmail: order.customer_email ?? undefined,
      description: `ARASILVER ${order.order_number}`,
    })

    await attachProviderPaymentId(created.paymentId, init.providerPaymentId)

    return { ok: true, redirectUrl: init.redirectUrl }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Неизвестная ошибка"
    console.log("[payments] startPayment error:", message)
    return { ok: false, error: message }
  }
}
