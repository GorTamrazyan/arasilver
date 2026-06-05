import type { Metadata } from "next"
import { Inter, Cormorant_Garamond } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { NextIntlClientProvider, hasLocale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import { CartProvider } from "@/components/cart/cart-provider"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { routing } from "@/i18n/routing"
import "../globals.css"

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Meta" })
  return {
    title: t("title"),
    description: t("description"),
    generator: "v0.app",
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      type: "website",
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  return (
    <html lang={locale} className={`${inter.variable} ${cormorant.variable} bg-background`}>
      <body className="font-sans antialiased">
        <NextIntlClientProvider>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </NextIntlClientProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
