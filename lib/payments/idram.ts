import { verifyIdramChecksum } from "./verify-signature"
import type {
  InitPaymentInput,
  PaymentInitResult,
  PaymentProvider,
  PaymentStatus,
  PaymentVerification,
} from "./types"

/**
 * Адаптер Idram.
 *
 * Конфиг берётся ТОЛЬКО из process.env:
 *   IDRAM_MERCHANT_ID, IDRAM_SECRET_KEY
 *
 * Что заполнить по доке помечено TODO(банк/Idram).
 */
function env() {
  const merchantId = process.env.IDRAM_MERCHANT_ID
  const secretKey = process.env.IDRAM_SECRET_KEY
  if (!merchantId || !secretKey) {
    throw new Error("Idram: не заданы IDRAM_MERCHANT_ID / IDRAM_SECRET_KEY")
  }
  return { merchantId, secretKey }
}

export const IdramProvider: PaymentProvider = {
  name: "idram",

  async initPayment(input: InitPaymentInput): Promise<PaymentInitResult> {
    const { merchantId } = env()
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    if (!siteUrl) throw new Error("Не задан NEXT_PUBLIC_SITE_URL")

    // Idram обычно работает через автосабмит HTML-формы на шлюз. Варианта два:
    //   1) вернуть URL нашей промежуточной страницы, которая сабмитит форму;
    //   2) собрать GET-URL шлюза, если он это поддерживает.
    //
    // TODO(банк/Idram): точный URL шлюза и поля формы. Обычно:
    //   EDP_LANGUAGE, EDP_REC_ACCOUNT (=merchantId), EDP_DESCRIPTION,
    //   EDP_AMOUNT (в AMD), EDP_BILL_NO (=наш orderNumber).
    //   success/fail URL: EDP_SUCCESS_URL / EDP_FAIL_URL — указывают на
    //     `${siteUrl}/${locale}/payment/success|fail`.
    //
    // const params = new URLSearchParams({
    //   EDP_LANGUAGE: input.locale,
    //   EDP_REC_ACCOUNT: merchantId,
    //   EDP_DESCRIPTION: input.description ?? input.orderNumber,
    //   EDP_AMOUNT: fromMinorUnits(input.amountMinor).toFixed(2),
    //   EDP_BILL_NO: input.orderNumber,
    //   EDP_SUCCESS_URL: `${siteUrl}/${input.locale}/payment/success?order=${input.orderId}`,
    //   EDP_FAIL_URL: `${siteUrl}/${input.locale}/payment/fail?order=${input.orderId}`,
    // })
    // return { redirectUrl: `https://banking.idram.am/Payment/GetPayment?${params}`, providerPaymentId: input.orderNumber }

    void merchantId
    void siteUrl
    void input
    throw new Error("Idram.initPayment: не реализовано — заполнить по доке банка")
  },

  async handleCallback(req: Request): Promise<PaymentVerification> {
    const { secretKey } = env()
    const form = await req.formData()
    const fields: Record<string, string> = {}
    for (const [k, v] of form.entries()) fields[k] = String(v)

    // TODO(банк/Idram): подтвердить имена полей.
    //   EDP_BILL_NO — наш orderNumber; для связи с orders.id может понадобиться
    //   отдельный lookup по order_number, если шлём номер, а не id.
    const orderId = fields["EDP_BILL_NO"] ?? ""
    const providerPaymentId = fields["EDP_TRANS_ID"] ?? ""
    const checksum = fields["EDP_CHECKSUM"] ?? ""

    // Доверяем колбэку только при валидной checksum (иначе fail-closed).
    const valid = verifyIdramChecksum(fields, checksum, secretKey)
    const status: PaymentStatus = valid ? "paid" : "failed"

    return { orderId, providerPaymentId, status, raw: fields }
  },
}
