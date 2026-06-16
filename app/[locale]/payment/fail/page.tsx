import Link from "next/link"
import { setRequestLocale } from "next-intl/server"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default async function PaymentFailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ order?: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const { order } = await searchParams

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <section className="mx-auto flex max-w-3xl flex-col items-center px-5 py-20 text-center md:py-32">
        <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase">Оплата не прошла</p>
        <h1 className="mt-6 font-serif text-5xl leading-tight text-balance md:text-7xl">
          Что-то <em className="font-light italic text-muted-foreground">пошло не так</em>
        </h1>
        <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground">
          Платёж не был завершён. Заказ сохранён — вы можете попробовать оплатить ещё раз или
          выбрать другой способ.
        </p>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          {order && (
            <Link
              href={`/order/${order}`}
              className="border border-foreground px-8 py-4 text-xs tracking-[0.25em] uppercase transition-colors hover:bg-foreground hover:text-background"
            >
              Вернуться к заказу
            </Link>
          )}
          <Link
            href="/shop"
            className="px-8 py-4 text-xs tracking-[0.25em] text-muted-foreground uppercase transition-colors hover:text-foreground"
          >
            Продолжить покупки
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
