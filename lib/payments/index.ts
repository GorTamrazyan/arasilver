import { ArcaProvider } from "./arca"
import { IdramProvider } from "./idram"
import { MockProvider } from "./mock"
import type { PaymentProvider, ProviderName } from "./types"

const PROVIDERS: Record<ProviderName, PaymentProvider> = {
  arca: ArcaProvider,
  idram: IdramProvider,
  mock: MockProvider,
}

/** Возвращает адаптер по имени провайдера. */
export function getProvider(name: ProviderName): PaymentProvider {
  const provider = PROVIDERS[name]
  if (!provider) throw new Error(`Неизвестный платёжный провайдер: ${name}`)
  return provider
}

/** Type guard: строка является допустимым именем провайдера. */
export function isProviderName(value: string): value is ProviderName {
  return value === "arca" || value === "idram" || value === "mock"
}

export * from "./types"
