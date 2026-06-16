import { getProvider } from "@/lib/payments"
import { applyPaymentResult } from "@/lib/orders/payment-orders"

/**
 * Серверный колбэк Idram (precheck + платёж). Отдаёт текстовый ответ "OK",
 * как ожидает шлюз. Покупатель редиректится на success/fail отдельно
 * (EDP_SUCCESS_URL / EDP_FAIL_URL, заданные при регистрации в адаптере).
 *
 * Лежит в /api → исключён из next-intl middleware.
 */
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  // Клонируем запрос: тело читается и в precheck-ветке, и затем в адаптере.
  const form = await req.clone().formData()

  // 1) Precheck: Idram сначала шлёт EDP_PRECHECK=YES — отвечаем "OK", не меняя
  //    статус заказа.
  if (String(form.get("EDP_PRECHECK")) === "YES") {
    // TODO(банк/Idram): при желании сверить EDP_BILL_NO / EDP_AMOUNT с заказом
    //   и вернуть ошибку, если не совпало.
    return new Response("OK", { status: 200 })
  }

  // 2) Платёж: адаптер проверяет checksum и нормализует статус.
  try {
    const provider = getProvider("idram")
    const result = await provider.handleCallback(req)
    await applyPaymentResult({ ...result, provider: "idram" })
    return new Response("OK", { status: 200 })
  } catch (e) {
    console.log("[payments] idram callback error:", e)
    return new Response("ERROR", { status: 400 })
  }
}
