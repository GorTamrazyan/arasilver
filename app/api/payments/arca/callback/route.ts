import { NextResponse } from "next/server"
import { getProvider } from "@/lib/payments"
import { applyPaymentResult } from "@/lib/orders/payment-orders"
import { routing } from "@/i18n/routing"

/**
 * Return/колбэк от ArCa. Покупатель попадает сюда после оплаты; статус
 * подтверждается серверным запросом getOrderStatus внутри адаптера, после чего
 * клиента редиректит на локализованную страницу success/fail.
 *
 * Лежит в /api → исключён из next-intl middleware (локаль приходит в ?loc=).
 */
export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const locale = url.searchParams.get("loc") ?? routing.defaultLocale
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? url.origin

  try {
    const provider = getProvider("arca")
    const result = await provider.handleCallback(req)
    await applyPaymentResult({ ...result, provider: "arca" })

    const page = result.status === "paid" ? "success" : "fail"
    return NextResponse.redirect(`${siteUrl}/${locale}/payment/${page}?order=${result.orderId}`)
  } catch (e) {
    console.log("[payments] arca callback error:", e)
    return NextResponse.redirect(`${siteUrl}/${locale}/payment/fail`)
  }
}
