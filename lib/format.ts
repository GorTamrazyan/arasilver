export function formatPrice(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Названия месяцев в родительном падеже (для дат вида «16 июня 2026»).
// Подставляем сами, не полагаясь на Intl: разные версии ICU на сервере (Node)
// и в браузере дают разные сокращения месяца → ошибка гидрации.
const RU_MONTHS = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
]

export function formatDate(iso: string) {
  // Детерминированное форматирование, одинаковое на сервере и клиенте:
  // берём только числовые части с фиксированным часовым поясом, а название
  // месяца подставляем из массива выше.
  const parts = new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Asia/Yerevan",
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date(iso))

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? ""

  const month = RU_MONTHS[Number(get("month")) - 1] ?? ""
  return `${get("day")} ${month} ${get("year")} г., ${get("hour")}:${get("minute")}`
}
