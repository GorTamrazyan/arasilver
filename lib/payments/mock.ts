import type {
  InitPaymentInput,
  PaymentInitResult,
  PaymentProvider,
  PaymentVerification,
} from "./types"

/**
 * Демо-провайдер: имитация банка БЕЗ внешних вызовов.
 *
 * Нужен, чтобы увидеть весь конвейер оплаты целиком (создание платежа →
 * редирект → «оплата» → смена статуса заказа на confirmed → success) ещё до
 * получения доступов ArCa/Idram. Включается флагом NEXT_PUBLIC_PAYMENTS_DEMO=1.
 *
 * Реальные адаптеры (arca.ts, idram.ts) этот файл не трогает — он живёт рядом.
 */
export const MockProvider: PaymentProvider = {
  name: "mock",

  async initPayment(input: InitPaymentInput): Promise<PaymentInitResult> {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
    // Вместо формы банка отправляем покупателя на нашу демо-страницу «оплаты».
    const redirectUrl = `${siteUrl}/${input.locale}/payment/mock?order=${input.orderId}`
    return { redirectUrl, providerPaymentId: `mock_${Date.now()}` }
  },

  async handleCallback(req: Request): Promise<PaymentVerification> {
    const url = new URL(req.url)
    const orderId = url.searchParams.get("order") ?? ""
    const outcome = url.searchParams.get("outcome")
    return {
      orderId,
      providerPaymentId: url.searchParams.get("pid") ?? `mock_${Date.now()}`,
      status: outcome === "paid" ? "paid" : "failed",
      raw: Object.fromEntries(url.searchParams.entries()),
    }
  },
}
