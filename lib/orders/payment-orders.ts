import { createServiceClient } from "@/lib/supabase/service"
import type { PaymentVerification, ProviderName } from "@/lib/payments/types"

/**
 * Слой заказов для платежей. Банк-независимый: знает только про таблицы
 * payments и orders в Supabase. Запись идёт через service-role клиент, т.к.
 * вызывается из вебхуков без пользовательской сессии.
 */

/**
 * Создаёт запись о попытке платежа (status=pending) и возвращает её id.
 * Вызывается при старте оплаты (server action), до редиректа в банк.
 */
export async function createPaymentRecord(params: {
  orderId: string
  provider: ProviderName
  amountMinor: number
}): Promise<{ ok: true; paymentId: string } | { ok: false; error: string }> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from("payments")
    .insert({
      order_id: params.orderId,
      provider: params.provider,
      amount_minor: params.amountMinor,
      currency: "AMD",
      status: "pending",
    })
    .select("id")
    .single()
  if (error || !data) return { ok: false, error: error?.message ?? "Не удалось создать платёж" }
  return { ok: true, paymentId: data.id as string }
}

/** Прописывает id платежа банка после успешной регистрации. */
export async function attachProviderPaymentId(paymentId: string, providerPaymentId: string) {
  const supabase = createServiceClient()
  await supabase
    .from("payments")
    .update({ provider_payment_id: providerPaymentId, updated_at: new Date().toISOString() })
    .eq("id", paymentId)
}

/**
 * Идемпотентно применяет результат платежа из колбэка банка.
 *  - если платёж по этому заказу уже в финальном статусе — ничего не делаем
 *    (колбэк может прийти повторно);
 *  - при paid: payments.status=paid + orders.status='confirmed'.
 */
export async function applyPaymentResult(
  result: PaymentVerification & { provider: ProviderName },
): Promise<{ ok: true; idempotent: boolean }> {
  const supabase = createServiceClient()

  // Находим последнюю запись платежа по заказу и провайдеру.
  const { data: existing } = await supabase
    .from("payments")
    .select("id, status")
    .eq("order_id", result.orderId)
    .eq("provider", result.provider)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  // Идемпотентность: финальный статус не перезаписываем.
  if (existing && existing.status !== "pending") {
    return { ok: true, idempotent: true }
  }

  const nowIso = new Date().toISOString()

  if (existing) {
    await supabase
      .from("payments")
      .update({
        status: result.status,
        provider_payment_id: result.providerPaymentId || null,
        raw_callback: result.raw,
        updated_at: nowIso,
      })
      .eq("id", existing.id)
  } else {
    // Колбэк пришёл без предварительной записи — создаём по факту.
    await supabase.from("payments").insert({
      order_id: result.orderId,
      provider: result.provider,
      provider_payment_id: result.providerPaymentId || null,
      status: result.status,
      currency: "AMD",
      amount_minor: 0, // TODO(банк): при отсутствии — взять сумму из заказа
      raw_callback: result.raw,
    })
  }

  // Платёж успешен → подтверждаем заказ.
  if (result.status === "paid") {
    await supabase
      .from("orders")
      .update({ status: "confirmed", updated_at: nowIso })
      .eq("id", result.orderId)
  }

  return { ok: true, idempotent: false }
}
