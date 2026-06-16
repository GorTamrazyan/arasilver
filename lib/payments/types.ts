// Общие типы платёжного слоя. Route handlers и бизнес-логика работают ТОЛЬКО
// через эти типы и интерфейс PaymentProvider — никакой банковской специфики
// здесь нет. Вся специфика банка живёт в адаптерах (arca.ts, idram.ts).

// "mock" — демо-провайдер (имитация банка) для проверки всего флоу без доступов.
export type ProviderName = "arca" | "idram" | "mock"

/** Статус платежа. Хранится в таблице payments, отдельно от orders.status. */
export type PaymentStatus = "pending" | "paid" | "failed" | "cancelled"

/** Данные для регистрации платежа в банке. */
export interface InitPaymentInput {
  /** Наш внутренний id заказа (orders.id). */
  orderId: string
  /** Человекочитаемый номер заказа (orders.order_number). */
  orderNumber: string
  /** Сумма в минорных единицах (лума). См. lib/payments/money.ts. */
  amountMinor: number
  /** Валюта платежа. Сейчас всегда AMD. */
  currency: "AMD"
  /** Локаль покупателя (hy | ru | en) — чтобы вернуть на нужную страницу. */
  locale: string
  /** Email покупателя, если есть (для чека банка). */
  customerEmail?: string
  /** Описание заказа для платёжной формы. */
  description?: string
}

/** Результат регистрации платежа: куда отправить покупателя. */
export interface PaymentInitResult {
  /** URL платёжной формы банка, на который редиректим покупателя. */
  redirectUrl: string
  /** Идентификатор платежа на стороне банка. */
  providerPaymentId: string
}

/** Нормализованный результат разбора колбэка/вебхука банка. */
export interface PaymentVerification {
  /** Наш order_id, извлечённый из колбэка. */
  orderId: string
  /** Идентификатор платежа на стороне банка. */
  providerPaymentId: string
  /** Итоговый статус. */
  status: PaymentStatus
  /** Сырой payload колбэка — сохраняем для аудита. */
  raw: Record<string, unknown>
}

/**
 * Единый интерфейс провайдера оплаты. ArcaProvider и IdramProvider реализуют
 * его. Вся банковская специфика живёт ТОЛЬКО внутри адаптеров.
 */
export interface PaymentProvider {
  readonly name: ProviderName
  /** Регистрирует платёж в банке и возвращает URL для редиректа. */
  initPayment(input: InitPaymentInput): Promise<PaymentInitResult>
  /** Разбирает входящий колбэк/вебхук и возвращает нормализованный статус. */
  handleCallback(req: Request): Promise<PaymentVerification>
  /** Серверная сверка статуса напрямую в банке (ArCa getOrderStatus). */
  getStatus?(providerPaymentId: string): Promise<PaymentStatus>
}
