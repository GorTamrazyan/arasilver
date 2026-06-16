/**
 * Проверка подлинности входящих колбэков банка.
 *
 * ВАЖНО: без рабочего алгоритма НЕЛЬЗЯ доверять статусу из колбэка — иначе
 * кто угодно сможет подделать «оплачено». Функции пока fail-closed (Idram
 * возвращает false), чтобы случайно не принять неподтверждённый платёж в проде.
 */

/**
 * Idram: контрольная сумма (checksum) по полям колбэка и секретному ключу.
 *
 * TODO(банк/Idram): заполнить по доке.
 *   1. Собрать строку из полей в нужном порядке (обычно: EDP_REC_ACCOUNT +
 *      EDP_AMOUNT + EDP_BILL_NO + SECRET_KEY + EDP_PAYER_ACCOUNT +
 *      EDP_TRANS_ID + EDP_TRANS_DATE).
 *   2. Посчитать хеш (обычно MD5), привести к нужному регистру.
 *   3. Сравнить с присланным EDP_CHECKSUM (без учёта регистра).
 *
 * Пример каркаса (раскомментировать и поправить порядок полей по доке):
 *   import { createHash } from "node:crypto"
 *   const base = [
 *     fields.EDP_REC_ACCOUNT, fields.EDP_AMOUNT, fields.EDP_BILL_NO,
 *     secretKey, fields.EDP_PAYER_ACCOUNT, fields.EDP_TRANS_ID,
 *     fields.EDP_TRANS_DATE,
 *   ].join(":")
 *   const expected = createHash("md5").update(base).digest("hex")
 *   return expected.toLowerCase() === receivedChecksum.toLowerCase()
 */
export function verifyIdramChecksum(
  fields: Record<string, string>,
  receivedChecksum: string,
  secretKey: string,
): boolean {
  void fields
  void receivedChecksum
  void secretKey
  // TODO: реальный алгоритм. До его появления — fail-closed.
  return false
}

/**
 * ArCa: статус платежа подтверждается серверным запросом getOrderStatus,
 * а не подписью колбэка (см. lib/payments/arca.ts → getStatus()).
 *
 * TODO(банк/ArCa): если банк присылает подписанный колбэк — добавить проверку
 * подписи здесь.
 */
export function verifyArcaCallback(payload: Record<string, unknown>): boolean {
  void payload
  // TODO: при наличии подписи в колбэке — проверить её. Иначе полагаемся на
  // серверную сверку статуса в getStatus().
  return true
}
