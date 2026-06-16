import type { Metadata } from "next"
import { Inter, Cormorant_Garamond } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { NextIntlClientProvider, hasLocale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import { CartProvider } from "@/components/cart/cart-provider"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { JsonLd } from "@/components/json-ld"
import { routing } from "@/i18n/routing"
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE, OG_LOCALE, buildAlternates, localeUrl } from "@/lib/seo"
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
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("title"),
      template: `%s — ${SITE_NAME}`,
    },
    description: t("description"),
    applicationName: SITE_NAME,
    generator: "v0.app",
    alternates: buildAlternates(locale, ""),
    icons: {
      icon: [
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/icon-light-32x32.png", sizes: "32x32", media: "(prefers-color-scheme: light)" },
        { url: "/icon-dark-32x32.png", sizes: "32x32", media: "(prefers-color-scheme: dark)" },
      ],
      apple: "/apple-icon.png",
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: localeUrl(locale, ""),
      locale: OG_LOCALE[locale],
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("ogTitle"),
      description: t("ogDescription"),
      images: [DEFAULT_OG_IMAGE],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
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

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: localeUrl(locale, ""),
    logo: `${SITE_URL}/icon.svg`,
    image: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
  }

  const siteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: localeUrl(locale, ""),
    inLanguage: locale,
    potentialAction: {
      "@type": "SearchAction",
      target: `${localeUrl(locale, "/shop")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <html lang={locale} className={`${inter.variable} ${cormorant.variable} bg-background`}>
      <body className="font-sans antialiased">
        <JsonLd data={[orgJsonLd, siteJsonLd]} />
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
