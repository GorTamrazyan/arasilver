import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["hy", "ru", "en"] as const,
  defaultLocale: "hy",
  localePrefix: "always",
  localeDetection: true,
})

export type Locale = (typeof routing.locales)[number]
