/**
 * Единая точка работы с деньгами для платежей. Магазин хранит суммы в orders
 * (numeric), а банковские шлюзы принимают сумму в МИНОРНЫХ единицах.
 *
 * TODO(банк): подтвердить требуемый формат суммы по доке.
 *   - ArCa (Ameria/ArCa eCommerce), как правило, принимает сумму в лума
 *     (1 AMD = 100 лума) целым числом.
 *   - Idram может ожидать сумму в AMD с двумя знаками — уточнить.
 *   Если форматы разойдутся — конвертацию вынести в адаптеры, а здесь оставить
 *   нейтральные toMinorUnits/fromMinorUnits.
 */

export const PAYMENT_CURRENCY = "AMD" as const
export type PaymentCurrency = typeof PAYMENT_CURRENCY

/** 1 AMD = 100 минорных единиц (лума). */
export const MINOR_UNITS_PER_AMD = 100

/** AMD → минорные единицы (целое число). */
export function toMinorUnits(amountAmd: number): number {
  return Math.round(amountAmd * MINOR_UNITS_PER_AMD)
}

/** Минорные единицы → AMD. */
export function fromMinorUnits(minor: number): number {
  return minor / MINOR_UNITS_PER_AMD
}

/** Форматирование суммы AMD для интерфейса. */
export function formatAmd(amountAmd: number): string {
  return new Intl.NumberFormat("hy-AM", {
    style: "currency",
    currency: PAYMENT_CURRENCY,
    maximumFractionDigits: 0,
  }).format(amountAmd)
}
