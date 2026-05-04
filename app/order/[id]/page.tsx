import Link from "next/link"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

export const dynamic = "force-dynamic"

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ number?: string }>
}) {
  const { id } = await params
  const { number } = await searchParams
  const displayNumber = number ?? id.slice(0, 8).toUpperCase()

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <section className="mx-auto flex max-w-3xl flex-col items-center px-5 py-20 text-center md:py-32">
        <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase">Заказ оформлен</p>
        <h1 className="mt-6 font-serif text-5xl leading-tight text-balance md:text-7xl">
          Благодарим <em className="font-light italic text-muted-foreground">вас</em>
        </h1>
        <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground">
          Ваш заказ принят в работу. Мы свяжемся с вами в ближайшее время для подтверждения деталей, способа оплаты и
          доставки.
        </p>

        <div className="mt-10 border border-border px-8 py-6">
          <p className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase">Номер заказа</p>
          <p className="mt-2 font-serif text-3xl tracking-wider">{displayNumber}</p>
        </div>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/shop"
            className="border border-foreground px-8 py-4 text-xs tracking-[0.25em] uppercase transition-colors hover:bg-foreground hover:text-background"
          >
            Продолжить покупки
          </Link>
          <Link
            href="/"
            className="px-8 py-4 text-xs tracking-[0.25em] text-muted-foreground uppercase transition-colors hover:text-foreground"
          >
            На главную
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
