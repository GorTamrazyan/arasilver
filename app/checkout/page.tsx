import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { CheckoutForm } from "@/components/checkout-form"

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <section className="mx-auto max-w-[1400px] px-5 py-12 md:px-10 md:py-16">
        <div className="mb-10">
          <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase">Оформление заказа</p>
          <h1 className="mt-4 font-serif text-4xl md:text-5xl">
            Доставка и <em className="font-light italic text-muted-foreground">контакты</em>
          </h1>
        </div>
        <CheckoutForm />
      </section>
      <SiteFooter />
    </main>
  )
}
