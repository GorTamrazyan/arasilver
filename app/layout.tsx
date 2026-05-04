import type { Metadata } from "next"
import { Inter, Cormorant_Garamond } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { CartProvider } from "@/components/cart/cart-provider"
import { CartDrawer } from "@/components/cart/cart-drawer"
import "./globals.css"

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

export const metadata: Metadata = {
  title: "ARASILVER — Авторские украшения из серебра ручной работы",
  description:
    "ARASILVER — авторские украшения из серебра 925 пробы. Кольца, серьги, подвески и браслеты, созданные вручную с любовью к деталям.",
  generator: "v0.app",
  openGraph: {
    title: "ARASILVER — Авторские украшения из серебра",
    description: "Авторские украшения из серебра 925 пробы ручной работы.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={`${inter.variable} ${cormorant.variable} bg-background`}>
      <body className="font-sans antialiased">
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
