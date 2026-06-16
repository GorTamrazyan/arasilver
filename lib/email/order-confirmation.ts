import "server-only"
import { sendEmail } from "./client"
import { formatPrice } from "@/lib/format"

export type OrderEmailItem = {
  product_name: string
  quantity: number
  unit_price: number
  subtotal: number
}

export type OrderConfirmationData = {
  to: string
  orderNumber: string
  customerName: string
  items: OrderEmailItem[]
  subtotal: number
  shippingCost: number
  total: number
  currency: string
  /** Локаль покупателя (hy | ru | en). По умолчанию — hy. */
  locale?: string
}

type Dict = {
  subject: (orderNumber: string) => string
  greeting: (name: string) => string
  intro: (orderNumber: string) => string
  thItem: string
  thQty: string
  thSum: string
  subtotal: string
  shipping: string
  total: string
  outro: string
  signature: string
  adminSubject: (orderNumber: string) => string
}

const DICTS: Record<string, Dict> = {
  hy: {
    subject: (n) => `Պատվեր ${n}-ը ընդունված է — ARASILVER`,
    greeting: (name) => `Բարև, ${name}։`,
    intro: (n) =>
      `Շնորհակալություն ARASILVER-ում պատվերի համար։ Մենք ստացել ենք ձեր <b>${n}</b> պատվերը և շուտով կկապվենք ձեզ հետ՝ առաքման մանրամասները հաստատելու համար։`,
    thItem: "Ապրանք",
    thQty: "Քանակ",
    thSum: "Գումար",
    subtotal: "Ենթագումար",
    shipping: "Առաքում",
    total: "Ընդամենը",
    outro: "Հարցերի դեպքում պարզապես պատասխանեք այս նամակին։",
    signature: "Հարգանքով՝ ARASILVER",
    adminSubject: (n) => `🛍 Նոր պատվեր ${n}`,
  },
  ru: {
    subject: (n) => `Заказ ${n} принят — ARASILVER`,
    greeting: (name) => `Здравствуйте, ${name}!`,
    intro: (n) =>
      `Спасибо за заказ в ARASILVER. Мы приняли ваш заказ <b>${n}</b> и свяжемся с вами в ближайшее время для подтверждения деталей доставки.`,
    thItem: "Товар",
    thQty: "Кол-во",
    thSum: "Сумма",
    subtotal: "Подытог",
    shipping: "Доставка",
    total: "Итого",
    outro: "Если у вас есть вопросы — просто ответьте на это письмо.",
    signature: "С уважением, ARASILVER",
    adminSubject: (n) => `🛍 Новый заказ ${n}`,
  },
  en: {
    subject: (n) => `Order ${n} received — ARASILVER`,
    greeting: (name) => `Hello, ${name}!`,
    intro: (n) =>
      `Thank you for your order at ARASILVER. We've received order <b>${n}</b> and will contact you shortly to confirm delivery details.`,
    thItem: "Item",
    thQty: "Qty",
    thSum: "Amount",
    subtotal: "Subtotal",
    shipping: "Shipping",
    total: "Total",
    outro: "If you have any questions, simply reply to this email.",
    signature: "Best regards, ARASILVER",
    adminSubject: (n) => `🛍 New order ${n}`,
  },
}

function pickDict(locale?: string): Dict {
  return (locale && DICTS[locale]) || DICTS.hy
}

function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  )
}

function renderHtml(d: Dict, data: OrderConfirmationData): string {
  const cur = data.currency
  const rows = data.items
    .map(
      (i) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px">${escapeHtml(i.product_name)}</td>
        <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;text-align:center;color:#666">×${i.quantity}</td>
        <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;text-align:right;white-space:nowrap">${formatPrice(i.subtotal, cur)}</td>
      </tr>`,
    )
    .join("")

  const totalsRow = (label: string, value: string, strong = false) => `
    <tr>
      <td colspan="2" style="padding:6px 0;font-size:${strong ? "16px" : "14px"};${strong ? "font-weight:600" : "color:#666"}">${label}</td>
      <td style="padding:6px 0;font-size:${strong ? "16px" : "14px"};text-align:right;${strong ? "font-weight:600" : "color:#666"};white-space:nowrap">${value}</td>
    </tr>`

  return `<!doctype html>
<html lang="${data.locale ?? "hy"}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#f6f5f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1a1a1a">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px">
    <div style="text-align:center;letter-spacing:6px;font-size:18px;font-weight:600;padding:8px 0 24px">ARASILVER</div>
    <div style="background:#fff;border:1px solid #eceae6;border-radius:4px;padding:28px 28px 24px">
      <p style="margin:0 0 14px;font-size:16px">${escapeHtml(d.greeting(data.customerName))}</p>
      <p style="margin:0 0 22px;font-size:14px;line-height:1.6;color:#333">${d.intro(escapeHtml(data.orderNumber))}</p>

      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr>
            <th style="text-align:left;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#999;padding-bottom:6px">${d.thItem}</th>
            <th style="text-align:center;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#999;padding-bottom:6px">${d.thQty}</th>
            <th style="text-align:right;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#999;padding-bottom:6px">${d.thSum}</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>

      <table style="width:100%;border-collapse:collapse;margin-top:14px">
        ${totalsRow(d.subtotal, formatPrice(data.subtotal, cur))}
        ${totalsRow(d.shipping, formatPrice(data.shippingCost, cur))}
        ${totalsRow(d.total, formatPrice(data.total, cur), true)}
      </table>

      <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#666">${d.outro}</p>
      <p style="margin:18px 0 0;font-size:13px;color:#333">${d.signature}</p>
    </div>
  </div>
</body>
</html>`
}

/**
 * Отправляет письмо-подтверждение покупателю и (опционально) копию владельцу
 * магазина, если задан EMAIL_ADMIN. Сбои логируются, но наружу не пробрасываются.
 */
export async function sendOrderConfirmation(data: OrderConfirmationData): Promise<void> {
  const d = pickDict(data.locale)
  const html = renderHtml(d, data)

  await sendEmail({
    to: data.to,
    subject: d.subject(data.orderNumber),
    html,
    replyTo: process.env.EMAIL_REPLY_TO || undefined,
  })

  const admin = process.env.EMAIL_ADMIN
  if (admin) {
    await sendEmail({
      to: admin,
      subject: d.adminSubject(data.orderNumber),
      html,
      replyTo: data.to,
    })
  }
}
