import type {
  InitPaymentInput,
  PaymentInitResult,
  PaymentProvider,
  PaymentStatus,
  PaymentVerification,
} from "./types"

/**
 * Адаптер ArCa (онлайн-эквайринг через банк, шлюз типа Ameria/ArCa eCommerce).
 *
 * Конфиг берётся ТОЛЬКО из process.env:
 *   ARCA_API_URL, ARCA_USERNAME, ARCA_PASSWORD
 *
 * Что заполнить по доке банка помечено TODO(банк/ArCa).
 */
function env() {
  const apiUrl = process.env.ARCA_API_URL
  const username = process.env.ARCA_USERNAME
  const password = process.env.ARCA_PASSWORD
  if (!apiUrl || !username || !password) {
    throw new Error("ArCa: не заданы ARCA_API_URL / ARCA_USERNAME / ARCA_PASSWORD")
  }
  return { apiUrl, username, password }
}

export const ArcaProvider: PaymentProvider = {
  name: "arca",

  async initPayment(input: InitPaymentInput): Promise<PaymentInitResult> {
    const { apiUrl, username, password } = env()
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    if (!siteUrl) throw new Error("Не задан NEXT_PUBLIC_SITE_URL")

    // Куда банк вернёт покупателя после оплаты (с нашим orderId и локалью).
    const returnUrl = `${siteUrl}/api/payments/arca/callback?orderId=${input.orderId}&loc=${input.locale}`

    // TODO(банк/ArCa): точный endpoint регистрации платежа и поля запроса.
    //   Обычно POST на register.do (form-urlencoded) с параметрами:
    //     userName, password, orderNumber, amount (в лума), currency (051=AMD),
    //     returnUrl, description, language.
    //   Ответ — JSON: { orderId, formUrl, errorCode, errorMessage }.
    //
    // const res = await fetch(`${apiUrl}/register.do`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/x-www-form-urlencoded" },
    //   body: new URLSearchParams({
    //     userName: username,
    //     password,
    //     orderNumber: input.orderNumber,
    //     amount: String(input.amountMinor),
    //     currency: "051",
    //     returnUrl,
    //     description: input.description ?? "",
    //     language: input.locale,
    //   }),
    // })
    // const data = await res.json()
    // if (data.errorCode && data.errorCode !== "0") {
    //   throw new Error(`ArCa register error: ${data.errorMessage}`)
    // }
    // return { redirectUrl: data.formUrl as string, providerPaymentId: data.orderId as string }

    void apiUrl
    void username
    void password
    void returnUrl
    throw new Error("ArCa.initPayment: не реализовано — заполнить по доке банка")
  },

  async handleCallback(req: Request): Promise<PaymentVerification> {
    const url = new URL(req.url)
    // Наш orderId мы сами положили в returnUrl при регистрации платежа.
    const orderId = url.searchParams.get("orderId") ?? ""
    // ArCa в return-URL обычно кладёт mdOrder (id платежа на стороне банка).
    const providerPaymentId = url.searchParams.get("mdOrder") ?? orderId

    // Статус подтверждаем серверным запросом getOrderStatus — колбэку не доверяем.
    const status: PaymentStatus = providerPaymentId
      ? await ArcaProvider.getStatus!(providerPaymentId)
      : "failed"

    return {
      orderId,
      providerPaymentId,
      status,
      raw: Object.fromEntries(url.searchParams.entries()),
    }
  },

  async getStatus(providerPaymentId: string): Promise<PaymentStatus> {
    const { apiUrl, username, password } = env()

    // TODO(банк/ArCa): getOrderStatus.do / getOrderStatusExtended.do.
    //   Параметры: userName, password, orderId (=providerPaymentId).
    //   Ответ содержит orderStatus; замапить в PaymentStatus:
    //     2 → paid, 3 → cancelled, 6 → failed, иначе → pending.
    //
    // const res = await fetch(`${apiUrl}/getOrderStatusExtended.do`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/x-www-form-urlencoded" },
    //   body: new URLSearchParams({ userName: username, password, orderId: providerPaymentId }),
    // })
    // const data = await res.json()
    // switch (data.orderStatus) {
    //   case 2: return "paid"
    //   case 3: return "cancelled"
    //   case 6: return "failed"
    //   default: return "pending"
    // }

    void apiUrl
    void username
    void password
    void providerPaymentId
    throw new Error("ArCa.getStatus: не реализовано — заполнить по доке банка")
  },
}
