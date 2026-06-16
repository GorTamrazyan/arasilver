import "server-only"

/**
 * Минимальный клиент отправки писем через Resend (https://resend.com).
 * Используем REST API напрямую через fetch — без дополнительных зависимостей.
 *
 * Если RESEND_API_KEY не задан — письмо НЕ отправляется, но и ошибки нет:
 * оформление заказа не должно ломаться из-за почты.
 */
type SendEmailInput = {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
}

type SendEmailResult = { ok: boolean; skipped?: boolean; error?: string }

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.log("[email] RESEND_API_KEY не задан — письмо не отправлено (пропуск)")
    return { ok: false, skipped: true }
  }

  const from = process.env.EMAIL_FROM || "ARASILVER <onboarding@resend.dev>"

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(input.to) ? input.to : [input.to],
        subject: input.subject,
        html: input.html,
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.log("[email] ошибка Resend:", res.status, text)
      return { ok: false, error: `${res.status} ${text}` }
    }

    return { ok: true }
  } catch (e) {
    console.log("[email] исключение при отправке:", e)
    return { ok: false, error: e instanceof Error ? e.message : "unknown" }
  }
}
